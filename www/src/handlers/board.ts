import { Board, Game, PieceColor, Tile, TileCoord, TileState } from 'chess-lib';

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
): boolean => {
  const oldRow = oldCoord.row();
  const oldCol = oldCoord.col();
  const newRow = newCoord.row();
  const newCol = newCoord.col();

  const piece = board.get_piece(oldCoord);

  if (piece) {
    const isPieceMoved = board.move_piece(oldRow, oldCol, newRow, newCol);
    return isPieceMoved;
  }
  return false;
};

export const handleMovePiece = (newTile: Tile, board: Board, game: Game) => {
  // check if current player turn
  const oldTile = board.get_selected_piece_coord();
  if (oldTile) {
    const curPlayerPiece = board.get_piece(oldTile);

    const pieceMoved = movePiece(oldTile, newTile.coord(), board);

    // change player turn if piece moved
    if (pieceMoved) {
      // get current player move color
      // change current player turn if piece moved

      if (curPlayerPiece && curPlayerPiece.color() === PieceColor.White) {
        game.set_player_turn(PieceColor.Black);
      } else {
        game.set_player_turn(PieceColor.White);
      }
    }

    board.clear_active_tiles();
    return pieceMoved;
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
