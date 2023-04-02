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

export const handleBoardPieceMove = (
  fromCoord: TileCoord,
  toCoord: TileCoord,
  board: Board,
  game: Game
): MoveResult | undefined => {
  // check if current player turn
  const curPlayerPiece = board.get_piece(fromCoord);

  const piece = board.get_piece(fromCoord);

  if (piece) {
    const moveResult = board.move_piece(fromCoord, toCoord);

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
