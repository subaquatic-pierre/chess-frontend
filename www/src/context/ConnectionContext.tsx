import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@reach/router';

import { SetState } from '../types/Context';

import { getApiConfig } from '../config/api';

import { MessageType, Message } from '../types/Message';
import { buildOwnMsg } from '../util/message';

// define context interface
export interface IConnectionContext {
  // tiles used to render the current board state
  sendMoveMsg: (moveStr: string) => void;
  connect: (username: string) => void;
  disconnect: () => void;
  sendTextMsg: (text: string) => void;
  sendCommand: (text: string) => void;
  joinRoom: (roomName: string) => void;
  listRooms: () => void;
  listUsers: () => void;
  updateApp: boolean;
  setUpdateApp: SetState<boolean>;
  setActiveRoom: SetState<string>;
  activeRoom: string;
  username: string;
  connected: boolean;
  msgs: Message[];

  // game
  joinGame: (gameName: string) => void;
  newGame: () => void;
  leaveGame: () => void;
  joinLobby: () => void;
}

export const ConnectionContext = React.createContext({} as IConnectionContext);

const parseMessage = (msg: string): Message => {
  try {
    const parsed: Message = JSON.parse(msg);

    // console.log(parsed);

    if (parsed.msg_type === MessageType.SelfInfo) {
      parsed.content = JSON.parse(parsed.content);
    }

    return parsed;
  } catch (e) {
    console.log('An error ocurred parsing the last Chat Message: ', msg);

    return {
      msg_type: MessageType.Error,
      from_id: 0,
      username: 'anonymous',
      content: 'Client error parsing message'
    };
  }
};

let globalSocket: WebSocket | null = null;

const ConnectionContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const location = useLocation();

  // main ref holding all messages from web socket
  const msgRef = useRef<Message[]>([]);

  // TODO:
  // recheck update check method
  // it is not being called on every message
  // received from the web socket message event
  // state should be updated on each receive of message
  // from web socket
  const [updateApp, setUpdateApp] = useState(false);

  // TODO:
  // update username and active room storing method
  // should be retrieved from server
  // and cached on client side
  const [username, setUsername] = useState('');
  const [activeRoom, setActiveRoom] = useState('');

  // main socket connection
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // main connection method called
  // from connect button in Chat LobbyControl component
  const connect = (username: string) => {
    const { hostName, wsProtocol, wsEndpoint, port } = getApiConfig(location);
    const wsUri = `${wsProtocol}//${hostName}:${port}/${wsEndpoint}/${username}`;

    console.log('Connecting...');
    globalSocket = new WebSocket(wsUri);

    setUsername(username);
    setSocket(globalSocket);

    // save username for future automatic connection
    window.sessionStorage.setItem('savedUsername', username);

    if (location.pathname.includes('/lobby')) {
      joinRoom('lobby');
    }
  };

  const handleSocketMessage = (data: any) => {
    const msg = parseMessage(data);

    switch (msg.msg_type) {
      // case MessageType.GameMove:
      //   handleGameMove(msg);
      //   break;

      case MessageType.Connect:
        if (msg.content) {
          window.sessionStorage.setItem('wsId', msg.content);
        }
        break;

      default:
        msgRef.current.push(msg);
        setUpdateApp((old) => !old);
        break;
    }
  };

  // setup socket listeners once socket is connected
  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', () => {
        console.log('Connected');

        // set client state
        setConnected(true);

        // set active room, side effect is to join room
        if (globalSocket && location.pathname === '/lobby/') {
          setActiveRoom('lobby');
        } else {
          setActiveRoom('main');
        }
      });

      socket.addEventListener('message', (ev: any) => {
        try {
          handleSocketMessage(ev.data);
        } catch (e) {
          console.log(
            'There was an error parsing the message from the server!'
          );
          console.log(e);
          console.log('ev.data: ', ev.data);
        }
      });

      socket.addEventListener('close', () => {
        const msg = buildOwnMsg(
          'You disconnected from the server',
          MessageType.Status,
          'server'
        );

        msgRef.current.push(msg);

        // clear client state
        setSocket(null);
        setActiveRoom('');
        setConnected(false);

        // clear session storage variables
        window.sessionStorage.removeItem('username');
        window.sessionStorage.removeItem('wsId');
        window.sessionStorage.removeItem('activeRoom');
      });
    }
  }, [socket]);

  // used to set session on any changes to username or active room
  useEffect(() => {
    if (username) window.sessionStorage.setItem('username', username);
    if (activeRoom) window.sessionStorage.setItem('activeRoom', activeRoom);
  }, [username, activeRoom]);

  // ---
  // Command Helpers
  // ---

  const joinRoom = (roomName: string) => {
    if (socket) {
      socket.send(`/join-room ${roomName}`);
      listUsers();
      listRooms();
      setActiveRoom(roomName);
    }
  };

  const disconnect = () => {
    if (socket) {
      console.log('Disconnecting...');
      socket.close();
    }
  };

  const sendTextMsg = (text: string) => {
    if (socket) {
      socket.send(`${text}`);
    }
  };

  const sendCommand = (text: string) => {
    if (socket) {
      socket.send(`${text}`);
    }
  };

  const listUsers = () => {
    if (socket) {
      socket.send(`/list-users`);
    }
  };

  const listRooms = () => {
    if (socket) {
      socket.send('/list-rooms');
    }
  };

  // --- Game Commands
  const sendMoveMsg = (text: string) => {
    if (socket) {
      socket.send(`/game-move ${text}`);
    }
  };

  const joinGame = (gameName: string) => {
    if (socket) {
      socket.send(`/join-game ${gameName}`);
      setActiveRoom('in_game');
    }
  };

  const newGame = () => {
    if (socket) {
      socket.send(`/new-game`);
      setActiveRoom('in_game');
    }
  };

  const leaveGame = () => {
    if (socket) {
      socket.send(`/leave-game`);
      setActiveRoom('main');
    }
  };

  const joinLobby = () => {
    if (socket) {
      socket.send(`/join-room lobby`);
      listAvailableGames();
      listAllGames();
      setActiveRoom('lobby');
    }
  };

  const listAvailableGames = () => {
    if (socket) {
      socket.send('/list-available-games');
    }
  };

  const listAllGames = () => {
    if (socket) {
      socket.send('/list-all-games');
    }
  };

  // ---
  // END Command Helpers
  // ---

  // check if session exits
  // query the server for given session id
  // set connected if exists
  // TODO:
  // move to utl utils
  const checkCurrentSession = async () => {
    try {
      const maybeSessionId = window.sessionStorage.getItem('wsId');
      const wsId = maybeSessionId ? maybeSessionId : '123456789';

      const { hostName, httpProtocol, port } = getApiConfig(location);
      const uri = `${httpProtocol}//${hostName}:${port}/check-session/${wsId}`;
      const res = await fetch(uri);

      const rawBody = await res.json();
      const jsonBody = JSON.parse(rawBody);

      if (jsonBody.content) {
        setSocket(globalSocket);
        setConnected(true);

        const username = window.sessionStorage.getItem('username');
        const activeRoom = window.sessionStorage.getItem('activeRoom');

        setUsername(username as string);

        if (location.pathname === '/') {
          if (activeRoom) {
            if (activeRoom === 'lobby' || activeRoom === 'in_game') {
              globalSocket?.send('/join-room main');
              setActiveRoom('main');
            } else {
              globalSocket?.send(`/join-room ${activeRoom}`);
              setActiveRoom(activeRoom);
            }
          } else {
            globalSocket?.send('/join-room main');
            setActiveRoom('main');
          }
        }

        if (location.pathname.includes('/lobby')) {
          globalSocket?.send('/join-room lobby');
          setActiveRoom('lobby');
        }

        setConnected(true);
      } else {
        const savedUserName = window.sessionStorage.getItem('savedUsername');

        if (savedUserName) {
          connect(savedUserName);
        }
      }
    } catch (e) {
      console.log('There was an error checking sessionID', e);
    }
  };

  // check socket in session storage
  useEffect(() => {
    console.log('Connection context reload');
    checkCurrentSession();
  }, []);

  useEffect(() => {
    const sessionRoom = window.sessionStorage.getItem('activeRoom');
    if (activeRoom === 'lobby') {
      if (sessionRoom) {
        joinRoom(sessionRoom);
      } else {
        joinRoom('main');
      }
    }
  }, [connected, location.pathname]);

  return (
    <ConnectionContext.Provider
      value={{
        msgs: msgRef.current,
        setUpdateApp,
        connect,
        updateApp,
        username,
        activeRoom,
        setActiveRoom,
        connected,

        // commands
        sendCommand,
        listUsers,
        sendTextMsg,
        sendMoveMsg,
        disconnect,
        listRooms,
        joinRoom,

        // game
        joinGame,
        joinLobby,
        newGame,
        leaveGame
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContextProvider;
