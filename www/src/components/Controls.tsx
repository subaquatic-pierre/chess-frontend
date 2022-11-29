import React from 'react';

import { PieceColor } from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useBoardContext from '../hooks/useBoardContext';
import useForceUpdate from '../hooks/forceUpdate';
import useGameContext from '../hooks/useGameContext';

const Controls = () => {
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

    setTiles(board.tiles());
  };

  const handleShowCoords = () => {
    setShowCoords(!showCoords);
  };

  const handleReset = () => {
    resetAll();
    forceUpdate();
  };

  const checkShowPiece = () => {
    const moveWriter = board.get_move_writer();
    const jsPiece = moveWriter.get_js_piece(4, 4);
    if (jsPiece) {
      console.log(jsPiece);
    }
  };

  return (
    <Container>
      <div
        className="d-flex py-3 my-2"
        css={{ '& > button': { marginRight: '1rem' } }}
      >
        <Button onClick={changeBoardDirection}>Toggle Board Direction</Button>
        <Button onClick={handleReset}>Reset Game</Button>
        <Button onClick={handleShowCoords}>Toggle Show Coords</Button>
        <Button onClick={checkShowPiece}>Show Piece</Button>
      </div>
    </Container>
  );
};

export default Controls;
