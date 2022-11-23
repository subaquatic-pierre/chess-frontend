import { PieceColor, TileCoord } from 'chess-lib';

export const TILE_SPACE: number = 5;
export const TILE_HEIGHT: number = 100;

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
