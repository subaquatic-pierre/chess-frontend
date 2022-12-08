import React, { useEffect, useState } from 'react';

import { MoveReader, MoveResult, TileCoord, Board } from 'chess-lib';

import useLoadingContext from '../hooks/useLoadingContext';
import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';

import { handleCheckmate } from '../handlers/game';
import { handleMovePiece } from '../handlers/board';
import { handleWriteMoveToGame } from '../handlers/game';
import { LastMove } from '../types/Board';
import { getMovesFromSession, saveMovesToSession } from '../util/game';

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { board, setTiles, setBoard } = useBoardContext();
  const { game, updateGame, setUpdateGame } = useGameContext();
  const { loading, setLoading } = useLoadingContext();

  const initSession = () => {
    const gameMovesStr = getMovesFromSession();

    if (gameMovesStr) {
      const newBoard = Board.new();
      // game.reset_moves();
      // setBoard(newBoard);

      // get move results from string
      const moveReader = newBoard.move_reader();
      const moveResults = moveReader.parse_moves_to_js_arr(gameMovesStr);

      // set save
      moveResults.forEach((moveResult: MoveResult) => {
        if (moveResult && moveResult.to_coord && moveResult.from_coord) {
          const toCoord = TileCoord.from_json(moveResult.to_coord);
          const fromCoord = TileCoord.from_json(moveResult.from_coord);
          handleMovePiece(fromCoord, toCoord, newBoard, game);

          const lastMove: LastMove = new LastMove(
            MoveResult.from_json(moveResult)
          );
          handleWriteMoveToGame(lastMove, board, game);
        }
      });

      setTiles(newBoard.tiles());
      setUpdateGame(!updateGame);
    }
  };

  // used as global effect to game change
  // updated each time board is updated
  useEffect(() => {
    handleCheckmate(game);

    const gameMovesStr = getMovesFromSession();
    if (gameMovesStr && gameMovesStr?.length > 0) {
      console.log('init session');
      console.log(game.print_moves());
      saveMovesToSession(game);
    }

    // TODO
    // make network request with new move notation

    // TODO
    // set board with new tiles
  }, [updateGame]);

  // check user session for current game state
  // update board and game state from session
  // only set loading false after game is initialized
  const initGame = () => {
    // completed loading
    initSession();

    setTimeout(() => {
      setLoading(false);
    }, 10);
  };

  useEffect(() => {
    initGame();
  }, []);

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameContainer;
