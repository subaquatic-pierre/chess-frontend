import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';

import Board from '../components/Board';
import HorizontalBorder from './HorizontalBorder';
import VerticalBorder from './VerticalBorder';
import { BorderSide } from '../types/Board';

const BoardContainer = () => {
  return (
    <Container className="justify-content-center d-flex my-5">
      <div
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
