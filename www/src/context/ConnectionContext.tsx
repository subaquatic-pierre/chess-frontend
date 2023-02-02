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

// const webSocketWorker = new SharedWorker('web-sockets-worker.js');

// /**
//  * Sends a message to the worker and passes that to the Web Socket.
//  * @param {any} message
//  */
// const sendMessageToSocket = (message:any) => {
//   webSocketWorker.port.postMessage({
//     action: 'send',
//     value: message,
//   });
// };

// // Event to listen for incoming data from the worker and update the DOM.
// webSocketWorker.port.addEventListener('message', ({ data }) => {
//   requestAnimationFrame(() => {
//     appendGatePublicTickersData(data);
//   });
// });

// // Initialize the port connection.
// webSocketWorker.port.start();

// // Remove the current worker port from the connected ports list.
// // This way your connectedPorts list stays true to the actual connected ports,
// // as they array won't get automatically updated when a port is disconnected.
// window.addEventListener('beforeunload', () => {
//   webSocketWorker.port.postMessage({
//     action: 'unload',
//     value: null,
//   });

//   webSocketWorker.port.close();
// });

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
    globalSocket = new WebSocket(wsUri);

    setUsername(username);
    setSocket(globalSocket);
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

  const handleSocketMessage = (data: any) => {
    const msg = parseMessage(data);

    switch (msg.msg_type) {
      case MessageType.GameMove:
        handleGameMove(msg);
        break;

      case MessageType.Connect:
        console.log('Connect message type received: ', msg);
        if (msg.content) {
          window.sessionStorage.setItem('wsId', msg.content);
        }
        break;

      default:
        msgRef.current.push(msg);
        setUpdateChat((old) => !old);
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
        setActiveRoom('main');

        // set session storage variables
        window.sessionStorage.setItem('activeRoom', 'main');
        window.sessionStorage.setItem('username', username);
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
          MessageType.Status
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

  // ---
  // Command Helpers
  // ---

  const joinRoom = (roomName: string) => {
    if (socket) {
      socket.send(`/join-room ${roomName}`);
      socket.send('/list-rooms');
      window.sessionStorage.setItem('activeRoom', roomName);
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

  // check if session exits
  // query the server for given session id
  // set connected if exists
  const checkCurrentSession = async () => {
    try {
      const maybeSessionId = window.sessionStorage.getItem('wsId');
      const wsId = maybeSessionId ? maybeSessionId : '123456789';
      const res = await fetch(`http://localhost:8080/check-session/${wsId}`);
      const rawBody = await res.json();
      const jsonBody = JSON.parse(rawBody);

      if (jsonBody.content) {
        setSocket(globalSocket);
        setConnected(true);

        if (globalSocket) {
          globalSocket.send('/list-rooms');
          globalSocket.send('/list-users');
        }

        const username = window.sessionStorage.getItem('username');
        const activeRoom = window.sessionStorage.getItem('activeRoom');

        setUsername(username as string);
        setActiveRoom(activeRoom as string);

        setConnected(true);
      }
    } catch (e) {
      console.log('There was an error checking sessionID', e);
    }
  };

  // check socket in session storage
  useEffect(() => {
    checkCurrentSession();
  }, []);

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
