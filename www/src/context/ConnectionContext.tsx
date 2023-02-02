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
  setUpdateChat: React.Dispatch<React.SetStateAction<boolean>>;
  activeRoom: string;
  username: string;
  lastMsg: Message | null;
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
  const msgRef = useRef<Message[]>([]);
  const [updateChat, setUpdateChat] = useState(false);
  const [username, setUsername] = useState('');
  const [activeRoom, setActiveRoom] = useState('');
  const { game, setMoves } = useGameContext();
  const { board, setTiles } = useBoardContext();

  const location = useLocation();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMsg, setLastMessage] = useState<Message | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const connect = (username: string) => {
    disconnect();

    const proto = location.protocol.startsWith('https') ? 'wss' : 'ws';
    const wsUri = `${proto}://localhost:8080/ws/${username}`;
    // const wsUri = `${proto}://${location.hostname}/ws`;

    console.log('Connecting...');
    const socket = new WebSocket(wsUri);

    setUsername(username);
    setSocket(socket);
  };

  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', () => {
        console.log('Connected');

        // set client state
        setConnected(true);
        setActiveRoom('main');
      });

      socket.addEventListener('message', (ev: any) => {
        if (ev.data.startsWith('Move')) {
          const moveStr = ev.data.split(':')[1];
          const playerTurn = game.player_turn();

          // add last move to game
          handleGameStringMove(moveStr, playerTurn, board, game);

          // save moves to local session
          // saveGameMoves(game);

          // set moves on UI
          setMoves(game.moves().str_array());
          setTiles(board.js_tiles());
          handleCheckmate(game, board);
        } else {
          const msg = parseMessage(ev.data);
          msgRef.current.push(msg);
          setUpdateChat((old) => !old);
        }
      });

      socket.addEventListener('close', () => {
        console.log('Disconnected');

        const msg = buildOwnMsg(
          'You successfully disconnected from the server',
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

  const joinRoom = (roomName: string) => {
    if (socket) {
      socket.send(`/join-room ${roomName}`);
      setActiveRoom(roomName);
      listRooms();
    }
  };

  const listUsers = () => {
    if (socket) {
      socket.send(`/list-users`);
    }
  };

  // ---
  // End command helpers
  // ---

  const disconnect = () => {
    if (socket) {
      console.log('Disconnecting...');
      socket.close();
    }
  };

  const listRooms = () => {
    if (socket) {
      socket.send('/list-rooms');
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        msgs: msgRef.current,
        sendCommand,
        listUsers,
        sendMoveMsg,
        setUpdateChat,
        disconnect,
        connect,
        updateChat,
        listRooms,
        username,
        activeRoom,
        connected,
        lastMsg,
        sendTextMsg,
        joinRoom
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContextProvider;
