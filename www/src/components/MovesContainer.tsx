import React, { useEffect, useState } from 'react';

import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  ListGroup,
  ListGroupItem,
  Row
} from 'react-bootstrap';

import useGameContext from '../hooks/useGameContext';

const MovesContainer = () => {
  const { game, updateGame } = useGameContext();
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    setMoves(game.moves().str_array());
  }, [updateGame]);

  return (
    <Container css={{ marginBottom: 50 }}>
      <Row>
        <Col xs={4}>
          <ListGroup variant="flush">
            {moves.map((moveStr, idx) => (
              <ListGroupItem key={idx}>{moveStr}</ListGroupItem>
            ))}
          </ListGroup>
        </Col>
        <Col xs={4}>
          {/* <ListGroup css={{ marginTop: 10 }}>
            <ListGroupItem>
              <Button onClick={playSavedMoves}>Play Saved Moves</Button>
            </ListGroupItem>
          </ListGroup> */}
        </Col>
      </Row>
    </Container>
  );
};

export default MovesContainer;
