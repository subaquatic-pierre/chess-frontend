import React, { useState, useEffect } from 'react';
import { Board, Game, Piece, PieceColor, Tile } from 'chess-lib';

import { SetState } from '../types/Context';
import { LastMove } from '../types/Board';
import useGameContext from '../hooks/useGameContext';
import { clearSavedGameMoves } from '../util/game';

// define context interface
export interface IBoardContext {
  // tiles used to render the current board state
  board: Board;
  setBoard: SetState<Board>;

  tiles: Tile[];
  setTiles: SetState<Tile[]>;

  // used to reset entire game and board state
  resetAll: () => void;

  // selected tile coord, used to move and highlight tiles
  selectedTile: Tile | null;
  setSelectedTile: SetState<Tile | null>;

  // board direction
  boardDirection: PieceColor;
  setBoardDirection: SetState<PieceColor>;

  // promote piece state, used when user clicks in
  // select piece to promote modal
  promotePiece: Piece | null;
  setPromotePiece: SetState<Piece | null>;

  // set promote tile as last move when pawn reaches
  // promotable tile, used to control whether to
  // write move directly after move or wait until
  // user selects promotable piece
  tileToPromote: LastMove | null;
  setTileToPromote: SetState<LastMove | null>;
}

export const BoardContext = React.createContext({} as IBoardContext);

const firstBoard = Board.new();

const BoardContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [board, setBoard] = useState<Board>(firstBoard);
  const { setGame, setMoves, game, setOnline } = useGameContext();

  // promote piece state
  const [tileToPromote, setTileToPromote] = useState<LastMove | null>(null);
  const [promotePiece, setPromotePiece] = useState<Piece | null>(null);

  // tile state
  const [tiles, setTiles] = useState<Tile[]>([]);

  // direction of the board
  const [boardDirection, setBoardDirection] = useState<PieceColor>(
    PieceColor.White
  );

  // piece coords used for moving pieces
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  const initBoard = () => {
    // set tiles based on initial board state
    setTiles(board.js_tiles());

    // set board direction
    // check if currently online game for session
    const playerColor = window.sessionStorage.getItem('playerColor');

    if (playerColor) {
      if (playerColor === 'black') {
        setBoardDirection(PieceColor.Black);
      } else {
        setBoardDirection(PieceColor.White);
      }
    } else {
      setBoardDirection(PieceColor.White);
    }
  };

  // used to reset entire game
  // needs to be in the lowest Context component
  // to access all game and board state
  // ie. board and setBoard is not available in GameContext
  // as GameContext is the parent of BoardContext
  const resetAll = () => {
    // TODO
    // clear session state
    clearSavedGameMoves();

    // set new game
    const newGame = Game.new();
    setGame(newGame);

    // set new board
    const newBoard = Board.new();
    setTiles(newBoard.js_tiles());

    setBoard(newBoard);

    setMoves([]);

    // TODO
    // call update game
    // setGameUpdate(!gameUpdate)
  };

  useEffect(() => {
    initBoard();
  }, []);

  return (
    <BoardContext.Provider
      value={{
        resetAll,
        setBoard,
        board,

        tiles,
        setTiles,

        selectedTile,
        setSelectedTile,

        setBoardDirection,
        boardDirection,

        // promote piece state
        promotePiece,
        setPromotePiece,

        // last move result if tile to promote
        tileToPromote,
        setTileToPromote
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;
