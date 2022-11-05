import { Board, BoardDirection, Game, Tile, TileCoord } from 'chess-lib';
import React from 'react';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IGameContext {
  tiles: Tile[];
  boardDirection: BoardDirection;
  board: Board;
  game: Game;
  loading: boolean;
  players: number;
  selectedPieceCoord: TileCoord | null;
  newPieceCoord: TileCoord | null;

  setBoardDirection: SetState<BoardDirection>;
  setLoading: SetState<boolean>;
  setTiles: SetState<Tile[]>;
  setPlayers: SetState<number>;
  setSelectedPieceCoord: SetState<TileCoord | null>;
  setNewPieceCoord: SetState<TileCoord | null>;
}
