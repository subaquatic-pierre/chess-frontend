import { MessageType, Message } from '../types/Message';

export const buildOwnMsg = (
  msg: string,
  msgType: MessageType,
  username: string = 'me'
): Message => {
  const ownMessage: Message = {
    msg_type: msgType,
    from_id: 0,
    username: username,
    content: msg
  };

  return ownMessage;
};
