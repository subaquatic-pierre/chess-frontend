import { PieceColor, Tile, Game } from 'chess-lib';
import { BorderSide } from '../types/Board';

export const rotateBoard = (
  tiles: Tile[],
  boardDirection: PieceColor
): Tile[] => {
  if (boardDirection === PieceColor.White) {
    const chunks: Tile[][] = [];
    for (let i = 0; i < 8; i++) {
      const offset = i * 8;
      const chunk = tiles.slice(offset, offset + 8);
      chunks.push(chunk);
    }
    return chunks.reverse().flatMap((tileArr) => tileArr);
  } else {
    const chunks: Tile[][] = [];
    for (let i = 0; i < 8; i++) {
      const offset = i * 8;
      const chunk = tiles.slice(offset, offset + 8);
      chunks.push(chunk);
    }
    return chunks
      .map((tileArr) => tileArr.reverse())
      .flatMap((tileArr) => tileArr);
  }
};

export const getBorderLabels = (
  boardDirection: PieceColor,
  borderSide: BorderSide
) => {
  const rankLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // render rank numbers in reverse order if direction is white
  // white is default direction
  const isReversed = boardDirection === PieceColor.White;

  switch (borderSide) {
    case BorderSide.Top:
      if (!isReversed) {
        return fileLabels.reverse();
      } else {
        return fileLabels;
      }
    case BorderSide.Bottom:
      if (!isReversed) {
        return fileLabels.reverse();
      } else {
        return fileLabels;
      }

    case BorderSide.Right:
      if (isReversed) {
        return rankLabels.reverse();
      } else {
        return rankLabels;
      }

    case BorderSide.Left:
      if (isReversed) {
        return rankLabels.reverse();
      } else {
        return rankLabels;
      }

    default:
      return [''];
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
