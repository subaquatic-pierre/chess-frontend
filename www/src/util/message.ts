import { MessageType, Message } from '../models/message';

export const buildOwnMsg = (msg: string, msgType: MessageType): Message => {
  const ownMessage: Message = {
    msg_type: msgType,
    from_id: 0,
    username: 'me',
    content: msg
  };

  return ownMessage;
};
