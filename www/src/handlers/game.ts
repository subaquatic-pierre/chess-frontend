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
import { SetState } from '../types/Context';
import { OnlineGameState } from '../types/Game';

export const handleCheckmate = (
  game: Game,
  board: Board,
  setOnlineGameState: SetState<OnlineGameState | null>
) => {
  // set checkmate status
  const colorInCheckmate = board.is_checkmate();
  if (colorInCheckmate === PieceColor.White) {
    game.set_winner(PieceColor.Black);
  } else if (colorInCheckmate === PieceColor.Black) {
    game.set_winner(PieceColor.White);
  }

  if (game.is_online() && game.state() === GameState.Ended) {
    setOnlineGameState('winner');
  } else if (game.state() === GameState.Ended) {
    if (game.get_winner() === PieceColor.White) {
      alert(`White Wins!, black is in checkmate`);
    } else if (game.get_winner() === PieceColor.Black) {
      alert(`Black Wins!, white is in checkmate`);
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
