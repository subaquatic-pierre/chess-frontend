import React from 'react';

import { PieceColor } from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useBoardContext from '../hooks/useBoardContext';
import useForceUpdate from '../hooks/forceUpdate';
import useGameContext from '../hooks/useGameContext';
import ControlsContainer from './ControlsContainer';

const GameControls = () => {
  const { setBoardDirection, boardDirection, resetAll, setTiles, board } =
    useBoardContext();
  const { setShowCoords, showCoords } = useGameContext();
  const forceUpdate = useForceUpdate();

  const changeBoardDirection = () => {
    if (boardDirection === PieceColor.White) {
      setBoardDirection(PieceColor.Black);
    } else {
      setBoardDirection(PieceColor.White);
    }

    setTiles(board.js_tiles());
  };

  const handleShowCoords = () => {
    setShowCoords(!showCoords);
  };

  const handleReset = () => {
    resetAll();
    forceUpdate();
  };

  return (
    <ControlsContainer>
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <div css={{ display: 'flex' }}>
          <Button onClick={changeBoardDirection}>Change Board Direction</Button>
          <Button className="hide-mobile" onClick={handleShowCoords}>
            {showCoords ? 'Hide Coords' : 'Show Coords'}
          </Button>
        </div>
        <div css={{ display: 'flex' }}>
          <Button onClick={handleReset}>Reset Game</Button>
        </div>
      </div>
    </ControlsContainer>
  );
};

export default GameControls;
