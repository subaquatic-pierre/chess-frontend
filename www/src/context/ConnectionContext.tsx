import React, { useState, useEffect, useRef } from 'react';
import { Board, Game, Piece, PieceColor, Tile, MoveParser } from 'chess-lib';

import { SetState } from '../types/Context';
import useGameContext from '../hooks/useGameContext';
import useBoardContext from '../hooks/useBoardContext';
import { handleCheckmate, handleGameStringMove } from '../handlers/game';
import { LastMove } from '../types/Board';
import { handleBoardPieceMove } from '../handlers/board';
import { saveGameMoves } from '../util/game';
import useConnectionContext from '../hooks/useConnectionContext';

// define context interface
export interface IConnectionContext {
  // tiles used to render the current board state
  sendMoveMsg: (moveStr: string) => void;
  connect: () => void;
  disconnect: () => void;
  sendTextMsg: (text: string) => void;
  joinRoom: (roomName: string) => void;
  listRooms: () => void;
  chatRooms: string[];
  textItems: string[];
  connected: boolean;
}

export const ConnectionContext = React.createContext({} as IConnectionContext);

const ConnectionContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [textItems, setTextItems] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const { game, setMoves } = useGameContext();
  const { board, setTiles } = useBoardContext();
  // ---
  // SOCKET LOGIC
  const socketRef: any = useRef();

  const joinRoom = (roomName: string) => {
    socketRef.current.send(`/join ${roomName}`);
  };

  const connect = () => {
    disconnect();

    const { location } = window;

    const proto = location.protocol.startsWith('https') ? 'wss' : 'ws';
    const wsUri = `${proto}://localhost:8080/ws`;
    // const wsUri = `${proto}://${location.hostname}/ws`;

    console.log('Connecting...');
    socketRef.current = new WebSocket(wsUri);

    socketRef.current.onopen = () => {
      console.log('Connected');
      setConnected(true);
    };

    // play move on move message receive
    socketRef.current.onmessage = (ev: any) => {
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
        const newItems = [...textItems];
        newItems.push(`Received: ${ev.data}`);
        setTextItems(newItems);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected');
      socketRef.current = null;
      setConnected(false);
    };
  };

  const sendMoveMsg = (text: string) => {
    if (socketRef.current) {
      socketRef.current.send(`Move:${text}`);
    }
  };

  const sendTextMsg = (text: string) => {
    if (socketRef.current) {
      socketRef.current.send(`Text:${text}`);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log('Disconnecting...');
      socketRef.current.close();
    }
  };

  const listRooms = () => {
    if (connected && socketRef.current) {
      const rooms = socketRef.current.send('/list');
      console.log('list rooms response: ', rooms);
      // setChatRooms(rooms);
    }
  };

  useEffect(() => {
    if (connected && socketRef.current) {
      const rooms = socketRef.current.send('/list');
      // setChatRooms(rooms);
    }
  }, [connected]);

  return (
    <ConnectionContext.Provider
      value={{
        sendMoveMsg,
        disconnect,
        connect,
        listRooms,
        chatRooms,
        textItems,
        connected,
        sendTextMsg,
        joinRoom
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContextProvider;
