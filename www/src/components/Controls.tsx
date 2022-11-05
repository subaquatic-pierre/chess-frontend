import React, { useEffect, useState } from 'react';
import { BoardDirection } from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useGameContext from '../hooks/useGameContext';
import useForceUpdate from '../hooks/forceUpdate';

const Controls = () => {
  const { players, setBoardDirection, setPlayers, boardDirection } =
    useGameContext();
  const [direction, setDirection] = useState(boardDirection);

  const changeBoardDirection = () => {
    if (boardDirection === BoardDirection.White) {
      setDirection(BoardDirection.Black);
    } else {
      setDirection(BoardDirection.White);
    }
  };

  useEffect(() => {
    setBoardDirection(direction);
  }, [direction]);

  return (
    <Container>
      <div className="d-flex py-3 my-2">
        <Button onClick={changeBoardDirection}>Toggle Board Direction</Button>
        <Button onClick={() => setPlayers(players + 1)}>Set Players</Button>
      </div>
      <div>num players: {players}</div>
    </Container>
  );
};

export default Controls;
