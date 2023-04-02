import { PieceColor, Tile, Game, Board, TileState } from 'chess-lib';
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
  let curPlayerTurn = game.player_turn();

  if (tile && tile.piece()) {
    if (game.is_online() && curPlayerTurn !== game.player_color()) {
      return false;
    }

    if (curPlayerTurn !== tile.piece()?.color()) {
      return false;
    }
  }

  return true;
};

export const highlightMoves = (tile: Tile, board: Board) => {
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
