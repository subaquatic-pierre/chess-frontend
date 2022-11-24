import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';

import Board from '../components/Board';
import HorizontalBorder from './HorizontalBorder';
import VerticalBorder from './VerticalBorder';
import { BorderSide, TILE_SPACE } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';

const BoardContainer = () => {
  const { showCoords } = useGameContext();
  const { setSelectedTile, board, setTiles } = useBoardContext();
  const divEl = useRef<HTMLDivElement>(null);

  // remove selected tile if not click on the board
  // handle away from tile click,
  // mark as inactive if not clicked on tile
  const handleAwayClickListener = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divEl.current) {
      if (!divEl.current.contains(e.target as HTMLDivElement)) {
        setSelectedTile(null);
        board.clear_active_tiles();
        setTiles(board.tiles());
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleAwayClickListener as any);
    return () =>
      window.removeEventListener('click', handleAwayClickListener as any);
  }, []);

  return (
    <Container className="justify-content-center d-flex my-5">
      {showCoords ? (
        <div
          ref={divEl}
          css={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3,auto)',
            gridGap: TILE_SPACE
          }}
        >
          <VerticalBorder side={BorderSide.Top} />
          <HorizontalBorder side={BorderSide.Left} />
          <Board />
          <HorizontalBorder side={BorderSide.Right} />
          <VerticalBorder side={BorderSide.Bottom} />
        </div>
      ) : (
        <div
          ref={divEl}
          css={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Board />
        </div>
      )}
    </Container>
  );
};

export default BoardContainer;
