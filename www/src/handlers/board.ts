import {
  Board,
  Game,
  PieceColor,
  PieceType,
  Tile,
  TileCoord,
  TileState,
  MoveResult
} from 'chess-lib';
import { TileToPromote } from '../types/Board';

export const handleHighlightMoves = (tile: Tile, board: Board) => {
  // clear all current active tiles
  board.clear_active_tiles();

  const piece = tile.piece();

  // only set tile as active if has piece
  if (piece) {
    // set current tile as active
    board.set_tile_state(tile.coord(), TileState.Active);

    // highlight active tile moves
    board.highlight_moves(tile.coord());
  }
};

const movePiece = (
  oldCoord: TileCoord,
  newCoord: TileCoord,
  board: Board
): MoveResult | false => {
  const oldRow = oldCoord.row();
  const oldCol = oldCoord.col();
  const newRow = newCoord.row();
  const newCol = newCoord.col();

  const piece = board.get_piece(oldCoord);

  if (piece) {
    const moveResult = board.move_piece(oldRow, oldCol, newRow, newCol);
    return moveResult;
  }
  return false;
};

export const handleMovePiece = (
  newTile: Tile,
  board: Board,
  game: Game
): MoveResult | false => {
  // check if current player turn
  const oldTile = board.get_selected_piece_coord();
  if (oldTile) {
    const curPlayerPiece = board.get_piece(oldTile);

    const moveResult = movePiece(oldTile, newTile.coord(), board);

    // change player turn if piece moved
    if (moveResult) {
      // get current player move color
      // change current player turn if piece moved

      if (curPlayerPiece && curPlayerPiece.color() === PieceColor.White) {
        game.set_player_turn(PieceColor.Black);
      } else {
        game.set_player_turn(PieceColor.White);
      }
    }

    board.clear_active_tiles();
    return moveResult;
  }
};

export const isPlayerTurn = (tile: Tile, game: Game): boolean => {
  const curPlayerTurn = game.player_turn();

  if (tile && tile.piece()) {
    if (curPlayerTurn !== tile.piece()?.color()) {
      return false;
    }
  }

  return true;
};

export const checkTileToPromote = (tiles: Tile[]): false | TileToPromote => {
  // check 1st rank
  for (let i = 0; i < 8; i++) {
    const tile = tiles[i];

    const piece = tile.piece();

    if (piece && piece.piece_type() === PieceType.Pawn) {
      return {
        row: tile.coord().row(),
        col: tile.coord().col(),
        pieceColor: piece.color()
      };
    }
  }

  // check 8th rank
  for (let i = 56; i < 64; i++) {
    const tile = tiles[i];

    const piece = tile.piece();

    if (piece && piece.piece_type() === PieceType.Pawn) {
      return {
        row: tile.coord().row(),
        col: tile.coord().col(),
        pieceColor: piece.color()
      };
    }
  }
  return false;
};
