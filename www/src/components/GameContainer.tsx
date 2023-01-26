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
import { handleCheckmate, handleWriteMoveToGame } from '../handlers/game';
import { LastMove } from '../types/Board';
import { handleMovePiece } from '../handlers/board';

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { loading, setLoading } = useLoadingContext();
  const { board } = useBoardContext();
  const { game, updateGame, lastMove } = useGameContext();

  // used as global effect to game change
  // updated each time board is updated
  // used to write move to game
  // used to make network request with move result
  useEffect(() => {
    handleCheckmate(game);

    if (lastMove) {
      // write moves to game wasm object
      // saveMoves(game);
      // // const moveStr = handleWriteMoveToGame(lastMove, board, game);
      // console.log('moveStr: ', moveStr);
      // console.log('parsing move str ...');
      // const moveRes = parseMoveStr(moveStr, lastMove.piece_color);
      // console.log('moveRes.to_json(): ', moveRes.to_json());

      const pieceColor = lastMove.piece_color;

      // board will have been updated with new tile positions
      // after move is made ie. lastMove is the result returned from the
      // updated board

      const moveStr = MoveParser.move_result_to_str(lastMove, board);

      console.log('moveStr: ', moveStr);

      const moveResult = MoveParser.str_to_move_result(moveStr, pieceColor);

      console.log('moveResult: ', moveResult.to_json());
    }

    // TODO
    // write moves to session

    // TODO
    // make network request with new move notation

    // TODO
    // set board with new tiles
  }, [updateGame]);

  const saveMoves = (game: Game) => {
    // const moves = game.moves().str_array();

    // write moves to session storage
    sessionStorage.setItem('gameMoves', game.print_moves());

    console.log('Moves saved ...');
  };

  const getSavedMoves = (): MoveResult[] => {
    const moveReader = new MoveReader();

    const gameMovesStr: string | null = sessionStorage.getItem('gameMoves');

    const moveResults: MoveResult[] = moveReader.parse_moves_to_js_arr(
      gameMovesStr ? gameMovesStr : ''
    );

    return moveResults;
  };

  const parseMoveStr = (
    moveStr: string,
    pieceColor: PieceColor
  ): MoveResult => {
    const moveResult = MoveParser.str_to_move_result(moveStr, pieceColor);
    return moveResult;
  };

  const playMove = (moveResult: MoveResult) => {
    // console.log('Playing move on board ...', moveResult.to_json());
    const toCoord = TileCoord.from_json(moveResult.to_coord);
    const fromCoord = TileCoord.from_json(moveResult.from_coord);
    handleMovePiece(fromCoord, toCoord, board, game);
  };

  // const addMoveToGame = (game:Game,moveResult:MoveResult)=>{

  // }

  // const playSavedMoves = (game: Game) => {
  //   const savedMoves = getSavedMoves();

  //   savedMoves.forEach((moveResult: MoveResult) => {
  //     if (moveResult && moveResult.to_coord && moveResult.from_coord) {
  //       const toCoord = TileCoord.from_json(moveResult.to_coord);
  //       const fromCoord = TileCoord.from_json(moveResult.from_coord);
  //       console.log(moveResult);
  //       handleMovePiece(fromCoord, toCoord, board, game);
  //     }
  //   });
  // };

  // check user session for current game state
  // update board and game state from session
  // only set loading false after game is initialized
  const initGame = () => {
    // const moveWriter = board.move_writer();
    // const savedMoves = getSavedMoves();

    // console.log(savedMoves);

    // savedMoves.forEach((moveResult: MoveResult) => {
    // console.log(moveResult);
    // const moveResult: MoveResult = MoveResult.from_json(moveResultObj);

    // playMove(moveResult);

    // const moveStr = moveWriter.write_move(moveResult);
    // game.add_move(moveStr, moveResult.piece_color);
    // });

    // completed loading
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
