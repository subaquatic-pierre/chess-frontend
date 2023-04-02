import { Theme } from '@emotion/react';
import { Tile, TileState, TileColor } from 'chess-lib';

export const parseTileColor = (tile: Tile, theme: Theme): string => {
  switch (tile.color()) {
    case TileColor.White:
      if (tile.state() === TileState.Highlight) {
        return theme.colors.board.whiteGradient;
      } else {
        return theme.colors.board.white;
      }

    case TileColor.Black:
      if (tile.state() === TileState.Highlight) {
        return theme.colors.board.blackGradient;
      } else {
        return theme.colors.board.black;
      }
    default:
      return 'purple';
  }
};

export const parseTileFilter = (tile: Tile): string => {
  switch (tile.state()) {
    case TileState.Active:
      return 'grayscale(80%)';

    default:
      return '';
  }
};
