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
import { handleCheckmate, handleGameStringMove } from '../handlers/game';
import { LastMove } from '../types/Board';
import { handleBoardPieceMove } from '../handlers/board';
import { saveGameMoves } from '../util/game';
import useConnectionContext from '../hooks/useConnectionContext';

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { sendMoveMsg } = useConnectionContext();
  const { loading, setLoading } = useLoadingContext();
  const { board, setTiles, tiles } = useBoardContext();
  const { game, lastMove, setMoves } = useGameContext();

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
      // saveGameMoves(game);

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
  const initGame = () => {
    // handlePlaySavedMoves(board, game);

    // set moves on UI
    // setMoves(game.moves().str_array());

    // completed loading
    setTimeout(() => {
      setLoading(false);
    }, 10);
  };

  // initialized game from session
  useEffect(() => {
    initGame();
  }, []);

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameContainer;
