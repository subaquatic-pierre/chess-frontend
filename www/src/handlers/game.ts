import {
  Board,
  Game,
  GameState,
  PieceType,
  PieceColor,
  MoveResult
} from 'chess-lib';

import { LastMove } from '../types/Board';

export const handleWriteMoveToGame = (
  lastMove: LastMove,
  board: Board,
  game: Game
): string => {
  const moveWriter = board.move_writer();
  const moveStr = moveWriter.write_move(
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

  return moveStr;
};

export const handleCheckmate = (game: Game) => {
  if (game.state() === GameState.Ended) {
    if (game.get_winner() === PieceColor.White) {
      alert(`Black Wins!, white is in checkmate`);
    } else if (game.get_winner() === PieceColor.Black) {
      alert(`White Wins!, black is in checkmate`);
      game.update_state(GameState.Ended);
    }
  }
};
