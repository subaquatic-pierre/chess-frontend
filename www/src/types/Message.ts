export enum MessageType {
  Info = 'Info',
  ClientMessage = 'ClientMessage',
  RoomList = 'RoomList',
  UserList = 'UserList',
  Status = 'Status',
  Error = 'Error',
  Join = 'Join',
  Connect = 'Connect',
  Command = 'Command',

  // UserInfo
  SelfInfo = 'SelfInfo',

  // Game messages
  GameMove = 'GameMove',
  AvailableGameList = 'AvailableGameList',
  AllGameList = 'AllGameList',
  GameJoin = 'GameJoin',
  GameLeave = 'GameLeave',
  GameChat = 'GameChat'
}

export interface Message {
  msg_type: MessageType;
  from_id: number;
  username: string;
  content: string;
}
