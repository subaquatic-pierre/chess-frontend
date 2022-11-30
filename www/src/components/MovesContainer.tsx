import React, { useEffect, useState } from 'react';

import { Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import useGameContext from '../hooks/useGameContext';

const MovesContainer = () => {
  const { game, updateGame } = useGameContext();
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    setMoves(game.moves_js_array());
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
      </Row>
    </Container>
  );
};

export default MovesContainer;
