import React, { useRef, useState } from 'react';
import {
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
import useForceUpdate from '../hooks/forceUpdate';

interface Props {
  tile: ITile;
}

const Tile: React.FC<Props> = ({ tile }) => {
  const { boardDirection, setSelectedTile } = useBoardContext();

  const handleTileClick = () => {
    setSelectedTile(tile);
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
        aspectRatio: '1/ 1'
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
