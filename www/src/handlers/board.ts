import {
  Board,
  Game,
  PieceColor,
  PieceType,
  Tile,
  TileCoord,
  TileState,
  MoveResult,
  Piece
} from 'chess-lib';

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
): MoveResult | undefined => {
  const oldRow = oldCoord.row();
  const oldCol = oldCoord.col();
  const newRow = newCoord.row();
  const newCol = newCoord.col();

  const piece = board.get_piece(oldCoord);

  if (piece) {
    const moveResult = board.move_piece(oldRow, oldCol, newRow, newCol);
    return moveResult;
  }
  return undefined;
};

export const handleBoardPieceMove = (
  fromCoord: TileCoord,
  toCoord: TileCoord,
  board: Board,
  game: Game
): MoveResult | undefined => {
  // check if current player turn
  const curPlayerPiece = board.get_piece(fromCoord);

  const moveResult = movePiece(fromCoord, toCoord, board);

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
};
