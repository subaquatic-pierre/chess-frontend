import React, { useState, useEffect, useRef } from 'react';
import { Board, Game, Piece, PieceColor, Tile } from 'chess-lib';

import { SetState } from '../types/Context';
import { LastMove } from '../types/Board';
import useGameContext from '../hooks/useGameContext';

// define context interface
export interface IBoardContext {
  // tiles used to render the current board state
  board: Board;
  tiles: Tile[];
  setTiles: SetState<Tile[]>;
  setBoard: SetState<Board>;
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
  const { setGame, updateGame, setUpdateGame } = useGameContext();

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
    setTiles(board.tiles());

    // set board direction
    setBoardDirection(PieceColor.White);
  };

  const resetAll = () => {
    // TODO
    // clear session state

    // set new game
    const newGame = Game.new();
    setGame(newGame);

    // set new board
    const newBoard = Board.new();
    setTiles(newBoard.tiles());

    setBoard(newBoard);

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
