import {
  Board,
  Game,
  GameState,
  TileCoord,
  PieceColor,
  MoveResult,
  MoveParser
} from 'chess-lib';

import { handleBoardPieceMove } from './board';
import { getSavedGameMoves } from '../util/game';

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

export const handleGameStringMove = (
  moveStr: string,
  pieceColor: PieceColor,
  board: Board,
  game: Game
) => {
  const moveResult: MoveResult = MoveParser.str_to_move_result(
    moveStr,
    pieceColor
  );

  console.log('moveRes in HandleGameStringMove: ', moveResult.to_json());

  // make board move for white
  handleBoardPieceMove(moveResult.from_coord, moveResult.to_coord, board, game);

  // write move to game
  game.add_move(moveStr, pieceColor);

  // update board if promote piece
  if (moveResult.is_promote_piece && moveResult.promote_piece_type) {
    const coord = TileCoord.from_json(moveResult.to_coord.to_json());
    board.set_new_tile(
      coord,
      moveResult.promote_piece_type,
      moveResult.piece_color
    );
  }
};

export const handlePlaySavedMoves = (board: Board, game: Game) => {
  const savedGameMoves = getSavedGameMoves();

  const movesSplit = MoveParser.js_split_all_moves(savedGameMoves);

  for (const moveStrSet of movesSplit) {
    const whiteMoveStr: string = moveStrSet[0];
    const blackMoveStr: string | undefined = moveStrSet[1];

    handleGameStringMove(whiteMoveStr, PieceColor.White, board, game);

    if (blackMoveStr) {
      handleGameStringMove(blackMoveStr, PieceColor.Black, board, game);
    }
  }
};
