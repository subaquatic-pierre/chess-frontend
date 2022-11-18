import {
  Board,
  BoardDirection,
  Game,
  PieceColor,
  Tile,
  TileCoord
} from 'chess-lib';
import React from 'react';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IModalContext {}

export interface ILoadingContext {
  loading: boolean;
  setLoading: SetState<boolean>;
}

export interface IGameContext {
  game: Game;

  // checkmate state
  setCheckmate: SetState<PieceColor | null>;

  // player state, used to determine who moves next
  players: number;
  setPlayers: SetState<number>;

  playerTurn: PieceColor;
  setPlayerTurn: SetState<PieceColor>;
}

export interface IBoardContext {
  // tiles used to render the current board state
  board: Board;
  tiles: Tile[];
  setTiles: SetState<Tile[]>;

  // selected tile coord, used to move and highlight tiles
  selectedTile: Tile | null;
  setSelectedTile: SetState<Tile | null>;

  // board direction
  boardDirection: BoardDirection;
  setBoardDirection: SetState<BoardDirection>;
}
