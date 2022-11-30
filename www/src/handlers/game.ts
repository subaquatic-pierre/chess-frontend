import {
  Board,
  Game,
  Tile,
  MoveResult,
  PieceType,
  PieceColor
} from 'chess-lib';
import { LastMove } from '../types/Board';

export const handleWriteMoveToGame = (
  lastMove: LastMove,
  board: Board,
  game: Game,
  promote_piece_type?: PieceType
): string => {
  const moveParser = board.move_parser();
  const moveStr = moveParser.write_move(
    lastMove.moveResult,
    lastMove.pieceToPromote
  );

  let playerTurn = PieceColor.White;

  if (game.player_turn() == PieceColor.White) {
    playerTurn = PieceColor.Black;
  } else {
    playerTurn = PieceColor.White;
  }

  game.add_move(moveStr, playerTurn);

  // TODO
  // write move to game

  return moveStr;
};
