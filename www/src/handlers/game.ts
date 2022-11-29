import { Board, Game, Tile, MoveResult, PieceType } from 'chess-lib';
import { LastMove } from '../types/Board';

export const handleWriteMoveToGame = (
  moveResult: LastMove,
  board: Board,
  game: Game,
  promote_piece_type?: PieceType
): string => {
  const moveWriter = board.move_writer();
  const moveStr = moveWriter.write_move(
    moveResult.moveResult,
    moveResult.promotePiece
  );

  // TODO
  // write move to game
  // game.write_move(move_str)

  return moveStr;
};
