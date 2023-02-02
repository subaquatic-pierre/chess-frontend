import React, { useState, useEffect } from 'react';

import useConnectionContext from '../hooks/useConnectionContext';

import { Message, MessageType } from '../models/message';

import { buildOwnMsg } from '../util/message';

interface IChatContext {
  setOwnLastMsg: (msg: string) => void;
  chatRooms: string[];
  users: string[];
  chatMessages: Message[];
  infoMessages: Message[];
  handleUpdateChat: () => void;
}

export const ChatContext = React.createContext({} as IChatContext);

const ChatContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const { msgs, updateChat, setUpdateChat } = useConnectionContext();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<string[]>([]);
  const [infoMessages, setInfoMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  // Main method used to update chat area
  const handleUpdateChat = () => {
    const _chatMessages = [];
    const _infoMessages = [];

    for (const msg of msgs) {
      switch (msg.msg_type) {
        case MessageType.RoomList:
          const rooms = msg.content.split(',');
          setChatRooms(rooms);
          break;

        case MessageType.UserList:
          const users = msg.content.split(',');
          // console.log(rooms);
          setUsers(users);
          break;

        case MessageType.Info:
          _infoMessages.push(msg);
          break;

        default:
          _chatMessages.push(msg);
          break;
      }
    }

    setInfoMessages(_infoMessages);
    setChatMessages(_chatMessages);
  };

  const setOwnLastMsg = (msgInput: string) => {
    let msgType = MessageType.ClientMessage;

    if (msgInput.startsWith('/')) {
      msgType = MessageType.Command;
    }

    const msg = buildOwnMsg(msgInput, msgType);

    msgs.push(msg);

    setUpdateChat((old) => !old);
  };

  useEffect(() => {
    handleUpdateChat();
  }, [updateChat]);

  return (
    <ChatContext.Provider
      value={{
        handleUpdateChat,
        setOwnLastMsg,
        chatMessages,
        chatRooms,
        infoMessages,
        users
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
