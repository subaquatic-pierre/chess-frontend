import React, { useEffect, useState, useRef } from 'react';
import { Tile as ITile } from 'chess-lib';

import Tile from './Tile';

import { rotateBoard } from '../util/board';
import { TILE_SPACE } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';

const Board = () => {
  const divEl = useRef<HTMLDivElement>(null);
  const { tiles, board, boardDirection, setSelectedTile, setTiles } =
    useBoardContext();
  const [localTiles, setLocalTiles] = useState<ITile[]>(tiles);

  // local tiles used to keep state fresh
  useEffect(() => {
    setLocalTiles(rotateBoard(board.js_tiles(), boardDirection));
  }, [tiles]);

  // remove selected tile if not click on the board
  // handle away from tile click,
  // mark as inactive if not clicked on tile
  const handleAwayClickListener = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divEl.current) {
      if (!divEl.current.contains(e.target as HTMLDivElement)) {
        setSelectedTile(null);
        board.clear_active_tiles();
        setTiles(board.js_tiles());
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleAwayClickListener as any);
    return () =>
      window.removeEventListener('click', handleAwayClickListener as any);
  }, []);

  return (
    <div
      ref={divEl}
      css={(theme) => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(8, minmax(10px, 1fr))',
        gridTemplateRows: 'repeat(8, minmax(10px, 1fr))',
        backgroundColor: theme.colors.board.background,
        padding: TILE_SPACE,
        gap: TILE_SPACE,
        width: '100%',
        maxWidth: '700px'
      })}
    >
      {/* {tiles.map((tile, idx) => ( */}
      {localTiles.map((tile, idx) => (
        <Tile key={idx} tile={tile} />
      ))}
    </div>
  );
};

export default Board;
