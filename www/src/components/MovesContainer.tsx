import React, { useEffect, useState } from 'react';
import { Moves } from 'chess-lib';

import { Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';

const MovesContainer = () => {
  const { game, updateGame } = useGameContext();
  const { board } = useBoardContext();
  const [moves, setMoves] = useState<Moves | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    // const moveParser = board.move_parser();
    // const moves = moveParser.parse_moves(game.print_moves());

    // setMoves(moves);
    console.log(game.print_moves());
    setContent(game.print_moves());
  }, [updateGame]);

  return (
    <Container>
      <Row>
        <Col xs={4}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {/* <ListGroup variant="flush">
            {moves && moves.white_moves(move)}
            <ListGroupItem>Cras justo odio</ListGroupItem>
          </ListGroup> */}
        </Col>
      </Row>
    </Container>
  );
};

export default MovesContainer;
