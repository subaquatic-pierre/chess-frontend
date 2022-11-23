import React, { useState, useEffect, useRef } from 'react';
import { IBoardContext } from '../types/Context';
import { Board, BoardDirection, Game, Piece, Tile, TileCoord } from 'chess-lib';
import useLoadingContext from '../hooks/useLoadingContext';
import { TileToPromote } from '../types/Board';

export const BoardContext = React.createContext({} as IBoardContext);

const board = Board.new();

const BoardContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const { setLoading } = useLoadingContext();

  // promote piece state
  const [tileToPromote, setTileToPromote] = useState<TileToPromote | null>(
    null
  );
  const [promotePiece, setPromotePiece] = useState<Piece | null>(null);
  // loading state

  // tile state
  const [tiles, setTiles] = useState<Tile[]>([]);

  // direction of the board
  const [boardDirection, setBoardDirection] = useState<BoardDirection>(
    BoardDirection.White
  );

  // piece coords used for moving pieces
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  const initBoard = () => {
    // set base board element

    // set tiles based on initial board state
    setTiles(board.tiles());

    // set board direction
    setBoardDirection(board.board_direction());

    // completed loading
    setLoading(false);
  };

  useEffect(() => {
    initBoard();
  }, []);

  return (
    <BoardContext.Provider
      value={{
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
        tileToPromote,
        setTileToPromote
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;
