import React, { useEffect, useState } from 'react';
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
import { handleCheckmate, handlePlaySavedMoves } from '../handlers/game';
import { LastMove } from '../types/Board';
import { handleBoardPieceMove } from '../handlers/board';
import { saveGameMoves } from '../util/game';

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { loading, setLoading } = useLoadingContext();
  const { board } = useBoardContext();
  const { game, updateGame, lastMove, setMoves } = useGameContext();

  // used as global effect to game change
  // updated each time board is updated
  // used to write move to game
  // used to make network request with move result
  useEffect(() => {
    handleCheckmate(game);

    if (lastMove) {
      const pieceColor = lastMove.piece_color;

      // board will have been updated with new tile positions
      // after move is made ie. lastMove is the result returned from the
      // updated board
      console.log('Move Result: ', lastMove.to_json());

      console.log(board.js_tiles()[62].to_json());

      const moveStr = MoveParser.move_result_to_str(lastMove, board);

      // TODO:
      // fix why move string not showing check after promote
      console.log('moveStr: ', moveStr);

      // add last move to game
      game.add_move(moveStr, pieceColor);

      // save moves to local session
      // saveGameMoves(game);

      // set moves on UI
      setMoves(game.moves().str_array());
    }

    // TODO
    // write moves to session

    // TODO
    // make network request with new move notation

    // TODO
    // set board with new tiles
  }, [updateGame]);

  const playMove = (moveResult: MoveResult) => {
    // console.log('Playing move on board ...', moveResult.to_json());
    const toCoord = TileCoord.from_json(moveResult.to_coord);
    const fromCoord = TileCoord.from_json(moveResult.from_coord);
    handleBoardPieceMove(fromCoord, toCoord, board, game);
  };

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
