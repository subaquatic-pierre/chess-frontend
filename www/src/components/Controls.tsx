import React from 'react';

import { PieceColor } from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useBoardContext from '../hooks/useBoardContext';
import useForceUpdate from '../hooks/forceUpdate';

const Controls = () => {
  const { setBoardDirection, boardDirection, resetAll, setTiles, board } =
    useBoardContext();
  const forceUpdate = useForceUpdate();

  const changeBoardDirection = () => {
    if (boardDirection === PieceColor.White) {
      setBoardDirection(PieceColor.Black);
    } else {
      setBoardDirection(PieceColor.White);
    }

    setTiles(board.tiles());
  };

  const handleReset = () => {
    resetAll();
    forceUpdate();
  };

  return (
    <Container>
      <div
        className="d-flex py-3 my-2"
        css={{ '& > button': { marginRight: '1rem' } }}
      >
        <Button onClick={changeBoardDirection}>Toggle Board Direction</Button>
        <Button onClick={handleReset}>Reset Game</Button>
      </div>
    </Container>
  );
};

export default Controls;
