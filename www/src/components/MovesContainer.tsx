import React, { useEffect, useState } from 'react';
import {
  Board,
  MoveParser,
  Game,
  MoveResult,
  PieceColor,
  TileCoord
} from 'chess-lib';

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
import { handleBoardPieceMove } from '../handlers/board';
import { handleGameStringMove } from '../handlers/game';

import { getSavedGameMoves, saveGameMoves } from '../util/game';

import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';

const MovesContainer = () => {
  const { game, updateGame, moves, setMoves } = useGameContext();
  const { board, setTiles, resetAll } = useBoardContext();
  const [moveStr, setMoveStr] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoveStr(event.target.value);
  };

  const handleMakeMoveClick = () => {};

  const logSavedMoves = () => {
    const moves = getSavedGameMoves();
    console.log(moves);
  };

  const playSavedMoves = () => {
    const savedGameMoves = getSavedGameMoves();

    const movesSplit = MoveParser.split_all_moves(savedGameMoves);

    for (const moveStrSet of movesSplit) {
      const whiteMoveStr: string = moveStrSet[0];
      const blackMoveStr: string | undefined = moveStrSet[1];

      handleGameStringMove(whiteMoveStr, PieceColor.White, board, game);

      if (blackMoveStr) {
        handleGameStringMove(blackMoveStr, PieceColor.Black, board, game);
      }
    }

    // update move UI
    setMoves(game.moves().str_array());
  };

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
          <Form>
            <FormControl
              type="text"
              placeholder="Enter Move"
              onChange={handleInputChange}
            />
            <ListGroup css={{ marginTop: 10 }}>
              <ListGroupItem>
                <Button onClick={handleMakeMoveClick}>Make Move</Button>
              </ListGroupItem>
              <ListGroupItem>
                <Button onClick={() => saveGameMoves(game)}>Save Moves</Button>
              </ListGroupItem>
              <ListGroupItem>
                <Button onClick={logSavedMoves}>Log Saved Moves</Button>
              </ListGroupItem>
              <ListGroupItem>
                <Button onClick={playSavedMoves}>Play Saved Moves</Button>
              </ListGroupItem>
            </ListGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MovesContainer;
