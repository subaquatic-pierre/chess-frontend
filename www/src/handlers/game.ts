import { Board, Game, Tile, MoveResult } from 'chess-lib';

export const handleWriteMoveToGame = (
  moveResult: MoveResult,
  board: Board,
  game: Game
): string => {
  console.log(moveResult.to_json());
  return 'heelo';
};
