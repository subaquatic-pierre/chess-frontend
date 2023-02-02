export enum MessageType {
  Info = 'Info',
  ClientMessage = 'ClientMessage',
  RoomList = 'RoomList',
  UserList = 'UserList',
  GameMove = 'GameMove',
  Status = 'Status',
  Error = 'Error',
  Join = 'Join',
  Connect = 'Connect',
  Command = 'Command'
}

export interface Message {
  msg_type: MessageType;
  from_id: number;
  username: string;
  content: string;
}
