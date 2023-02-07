import React, { useRef, useState } from 'react';
import {
  GameState,
  Piece as IPiece,
  PieceColor,
  Tile as ITile,
  TileCoord,
  TileState
} from 'chess-lib';
import { useEffect } from 'react';
import useGameContext from '../hooks/useGameContext';
import Piece from './Piece';
import { isPieceReverse } from '../util/piece';
import { TILE_HEIGHT } from '../types/Board';
import { parseTileColor, parseTileFilter } from '../util/tile';
import useBoardContext from '../hooks/useBoardContext';

interface Props {
  tile: ITile;
}

const Tile: React.FC<Props> = ({ tile }) => {
  const { game, online } = useGameContext();
  const { boardDirection, setSelectedTile } = useBoardContext();

  const handleTileClick = () => {
    setSelectedTile(tile);
  };

  const curPlayerTurnAndPiece = (): boolean => {
    if (game.state() === GameState.Ended) {
      return false;
    }

    if (tile.state() === TileState.Highlight) {
      return true;
    }

    if (online && game.player_color() !== tile.piece()?.color()) {
      return false;
    }

    if (tile.piece()) {
      if (game.player_turn() === tile.piece()?.color()) {
        return true;
      }
    }

    return false;
  };

  return (
    <div
      onClick={handleTileClick}
      css={(theme) => ({
        background: parseTileColor(tile, theme),
        filter: parseTileFilter(tile),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: '1/1',
        ...(curPlayerTurnAndPiece() && {
          '&:hover': {
            cursor: 'pointer'
          }
        })
      })}
    >
      {/* {tile.render()} */}
      {tile.piece() && (
        <Piece
          piece={tile.piece() as IPiece}
          reverse={isPieceReverse(
            boardDirection,
            tile.piece()?.color() as PieceColor
          )}
        />
      )}
    </div>
  );
};

export default Tile;
