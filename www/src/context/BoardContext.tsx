import React, { useState, useEffect, useRef } from 'react';
import { SetState } from '../types/Context';
import { Board, Game, Piece, PieceColor, Tile } from 'chess-lib';
import useLoadingContext from '../hooks/useLoadingContext';
import { LastMove, TileToPromote } from '../types/Board';
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

  // promote piece state
  promotePiece: Piece | null;
  setPromotePiece: SetState<Piece | null>;

  tileToPromote: LastMove | null;
  setTileToPromote: SetState<LastMove | null>;
}

export const BoardContext = React.createContext({} as IBoardContext);

const firstBoard = Board.new();

const BoardContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [board, setBoard] = useState<Board>(firstBoard);
  const { setGame } = useGameContext();
  const { setLoading } = useLoadingContext();

  // promote piece state
  const [tileToPromote, setTileToPromote] = useState<LastMove | null>(null);
  const [promotePiece, setPromotePiece] = useState<Piece | null>(null);
  // loading state

  // tile state
  const [tiles, setTiles] = useState<Tile[]>([]);

  // direction of the board
  const [boardDirection, setBoardDirection] = useState<PieceColor>(
    PieceColor.White
  );

  // piece coords used for moving pieces
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  const initBoard = () => {
    // TODO
    // get board from session if exists
    // use session board to set state

    // set tiles based on initial board state
    setTiles(board.tiles());

    // set board direction
    setBoardDirection(PieceColor.White);

    // completed loading
    setLoading(false);
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
