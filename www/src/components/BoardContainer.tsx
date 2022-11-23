import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';

import Board from '../components/Board';
import HorizontalBorder from './HorizontalBorder';
import VerticalBorder from './VerticalBorder';
import { BorderSide } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';

const BoardContainer = () => {
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
      <div
        ref={divEl}
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,auto)',
          gridGap: '10px'
        }}
      >
        <VerticalBorder side={BorderSide.Top} />
        <HorizontalBorder side={BorderSide.Left} />
        <Board />
        <HorizontalBorder side={BorderSide.Right} />
        <VerticalBorder side={BorderSide.Bottom} />
      </div>
    </Container>
  );
};

export default BoardContainer;
