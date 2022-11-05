import React, { useState, useEffect, useRef } from 'react';
import { IGameContext } from '../types/GameContext';
import {
  Board,
  BoardDirection,
  Game,
  new_board,
  new_game,
  Tile,
  TileCoord
} from 'chess-lib';
import { rotateBoard } from '../util/board';

export const GameContext = React.createContext({} as IGameContext);

const GameContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [loading, setLoading] = useState<boolean>(true);

  // game state
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [game, setGame] = useState<Game>({} as Game);
  const boardRef = useRef<Board>({} as Board);
  // const [board, setBoard] = useState<Board>({} as Board);

  // players
  const [players, setPlayers] = useState(0);

  // direction of the board
  const [boardDirection, setBoardDirection] = useState<BoardDirection>(
    BoardDirection.White
  );

  // piece coords used for moving pieces
  const [selectedPieceCoord, setSelectedPieceCoord] =
    useState<TileCoord | null>(null);
  const [newPieceCoord, setNewPieceCoord] = useState<TileCoord | null>(null);

  useEffect(() => {
    const board = Board.new();
    const game = Game.new(board);
    setTiles(board.tiles());
    setGame(game);
    boardRef.current = board;
    setBoardDirection(board.board_direction());
    setLoading(false);
  }, []);

  return (
    <GameContext.Provider
      value={{
        tiles,
        board: boardRef.current,
        loading,
        boardDirection,
        players,
        selectedPieceCoord,
        newPieceCoord,
        game,

        setLoading,
        setBoardDirection,
        setTiles,
        setPlayers,
        setSelectedPieceCoord,
        setNewPieceCoord
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
