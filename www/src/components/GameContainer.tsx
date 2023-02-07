import React, { useEffect, useState, useRef } from 'react';
import {
  MoveReader,
  MoveResult,
  TileCoord,
  Game,
  MoveParser,
  PieceColor
} from 'chess-lib';

import useLoadingContext from '../hooks/useLoadingContext';
import useGameContext from '../hooks/useGameContext';
import useBoardContext from '../hooks/useBoardContext';
import {
  handleCheckmate,
  handleGameStringMove,
  handlePlaySavedMoves
} from '../handlers/game';

import { LastMove } from '../types/Board';
import { handleBoardPieceMove } from '../handlers/board';
import { saveGameMoves } from '../util/game';
import useConnectionContext from '../hooks/useConnectionContext';

import { Message, MessageType } from '../models/message';

const getLastMoveFromMsgs = (msgs: Message[]): Message | null => {
  for (let i = msgs.length - 1; i >= 0; i--) {
    let msg = msgs[i];
    if (msg.msg_type === MessageType.GameMove) {
      return msg;
    }
  }

  return null;
};

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { sendMoveMsg, updateApp, msgs } = useConnectionContext();

  const { loading, setLoading } = useLoadingContext();
  const { board, setTiles, tiles, setBoardDirection } = useBoardContext();
  const { game, lastMove, setMoves, setLastMove, setOnline, online } =
    useGameContext();

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

  // used as global effect to game change
  // updated each time board is updated
  // used to write move to game
  // used to make network request with move result
  useEffect(() => {
    if (lastMove) {
      // board will have been updated with new tile positions
      // after move is made ie. lastMove is the result returned from the
      // updated board
      console.log('lastMove', lastMove.to_json());
      const moveStr = MoveParser.move_result_to_str(lastMove);

      const playerTurn = game.player_turn();

      // add last move to game
      handleGameStringMove(moveStr, playerTurn, board, game);

      // save moves to local session
      if (!online) {
        saveGameMoves(game);
      }

      // make network request with new move notation
      sendMoveMsg(moveStr);

      // set moves on UI
      setMoves(game.moves().str_array());
      setTiles(board.js_tiles());
      handleCheckmate(game, board);
    }
  }, [lastMove]);

  // check user session for current game state
  // update board and game state from session
  // only set loading false after game is initialized
  const initLoading = () => {
    // completed loading
    setTimeout(() => {
      setLoading(false);
    }, 10);
  };

  // initialized game from session
  useEffect(() => {
    initLoading();

    window.onbeforeunload = function () {
      sessionStorage.removeItem('playerColor');
    };

    return () => {
      window.sessionStorage.removeItem('playerColor');
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const playerColor = window.sessionStorage.getItem('playerColor');

      if (playerColor) {
        setOnline(true);
        game.set_online(true);

        if (playerColor === 'black') {
          game.set_player_color(PieceColor.Black);
          setBoardDirection(PieceColor.Black);
        } else {
          game.set_player_color(PieceColor.White);
          setBoardDirection(PieceColor.White);
        }
      } else {
        handlePlaySavedMoves(board, game);
        // set moves on UI
        setMoves(game.moves().str_array());
      }
    }
  }, [loading]);

  useEffect(() => {
    const maybeLastMoveMsg = getLastMoveFromMsgs(msgs);

    if (maybeLastMoveMsg) {
      handleGameMove(maybeLastMoveMsg);
    }
  }, [updateApp]);

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameContainer;
