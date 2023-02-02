import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@reach/router';

import { Board, Game, Piece, PieceColor, Tile, MoveParser } from 'chess-lib';

import { SetState } from '../types/Context';
import useGameContext from '../hooks/useGameContext';
import useBoardContext from '../hooks/useBoardContext';
import { handleCheckmate, handleGameStringMove } from '../handlers/game';
import { LastMove } from '../types/Board';
import { handleBoardPieceMove } from '../handlers/board';
import { saveGameMoves } from '../util/game';
import useConnectionContext from '../hooks/useConnectionContext';

import { MessageType, Message } from '../models/message';
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
  updateChat: boolean;
  setUpdateChat: SetState<boolean>;
  activeRoom: string;
  username: string;
  connected: boolean;
  msgs: Message[];
}

export const ConnectionContext = React.createContext({} as IConnectionContext);

const parseMessage = (msg: string): Message => {
  try {
    const parsed = JSON.parse(msg);
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
  const [updateChat, setUpdateChat] = useState(false);

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
    const proto = location.protocol.startsWith('https') ? 'wss' : 'ws';
    const wsUri = `${proto}://localhost:8080/ws/${username}`;
    // const wsUri = `${proto}://${location.hostname}/ws`;

    console.log('Connecting...');
    const socket = new WebSocket(wsUri);

    setUsername(username);
    setSocket(socket);
  };

  // TODO:
  // invert dependencies on GameContext
  // the ConnectionContext should update the GameContext
  // on message received. This way the ConnectionContext
  // can be the highest component in the component tree
  const { game, setMoves } = useGameContext();
  const { board, setTiles } = useBoardContext();

  const handleGameMove = (msg: Message) => {
    const moveStr = msg.content;
    const playerTurn = game.player_turn();

    // add last move to game
    handleGameStringMove(moveStr, playerTurn, board, game);

    // save moves to local session
    // saveGameMoves(game);

    // set moves on UI
    setMoves(game.moves().str_array());
    setTiles(board.js_tiles());
    handleCheckmate(game, board);
  };

  // setup socket listeners once socket is connected
  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', () => {
        console.log('Connected');

        // set client state
        setConnected(true);
        setActiveRoom('main');
      });

      socket.addEventListener('message', (ev: any) => {
        const msg = parseMessage(ev.data);

        try {
          if (msg.msg_type === MessageType.GameMove) {
            handleGameMove(msg);
          } else {
            msgRef.current.push(msg);
            setUpdateChat((old) => !old);
          }
        } catch (e) {
          console.log(
            'There was an error parsing the message from the server!'
          );
          console.log(e);
          console.log('ev.data: ', ev.data);
        }
      });

      socket.addEventListener('close', () => {
        console.log('Disconnected');

        const msg = buildOwnMsg(
          'You disconnected from the server',
          MessageType.Status
        );

        msgRef.current.push(msg);

        setUpdateChat((old) => !old);
        setSocket(null);
        setActiveRoom('');
        setConnected(false);
      });
    }
  }, [socket]);

  // ---
  // Command Helpers
  // ---

  const joinRoom = (roomName: string) => {
    if (socket) {
      socket.send(`/join-room ${roomName}`);
      socket.send('/list-rooms');
    }
  };

  const disconnect = () => {
    if (socket) {
      console.log('Disconnecting...');
      socket.close();
    }
  };

  const sendMoveMsg = (text: string) => {
    if (socket) {
      socket.send(`GameMove:${text}`);
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

  // ---
  // End command helpers
  // ---

  return (
    <ConnectionContext.Provider
      value={{
        msgs: msgRef.current,
        setUpdateChat,
        connect,
        updateChat,
        username,
        activeRoom,
        connected,

        // commands
        sendCommand,
        listUsers,
        sendTextMsg,
        sendMoveMsg,
        disconnect,
        listRooms,
        joinRoom
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContextProvider;
