import { MoveResult, PieceColor, PieceType, TileCoord, Tile } from 'chess-lib';

export const TILE_SPACE: number = 2;
export const TILE_HEIGHT: number = 30;

export interface TileToPromote {
  row: number;
  col: number;
  pieceColor: PieceColor;
}

export enum BorderSide {
  Left,
  Right,
  Top,
  Bottom
}

export interface LastMove {
  moveResult: MoveResult;
  pieceToPromote?: PieceType;
  promoteTile?: Tile;
}
