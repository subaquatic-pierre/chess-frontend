import React, { useEffect, useState } from 'react';
import { MoveParser, MoveReader, MoveResult, TileCoord } from 'chess-lib';

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
import { handleMovePiece } from '../handlers/board';
import useBoardContext from '../hooks/useBoardContext';

import useGameContext from '../hooks/useGameContext';

const MovesContainer = () => {
  const { game, updateGame } = useGameContext();
  const { board, setTiles } = useBoardContext();
  const [moves, setMoves] = useState<string[]>([]);
  const [moveStr, setMoveStr] = useState('');
  const [savedMoves, setSavedMoves] = useState<MoveResult[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoveStr(event.target.value);
  };

  const handleMakeMoveClick = () => {};

  const saveMoves = () => {
    const moves = game.moves().str_array();

    // write moves to session storage
    sessionStorage.setItem('gameMoves', game.print_moves());

    console.log('Moves saved ...');
  };

  const getSavedMoves = () => {
    const gameMovesStr = sessionStorage.getItem('gameMoves');
    if (gameMovesStr) {
      console.log(gameMovesStr);
      // get moves from session storage
      const moveReader: MoveReader = new MoveReader();

      const moveResults = moveReader.parse_moves_to_js_arr(gameMovesStr);

      console.log(moveResults);

      setSavedMoves(moveResults);
    }
  };

  const playSavedMoves = () => {
    const moveReader: MoveReader = new MoveReader();

    const gameMovesStr: string | null = sessionStorage.getItem('gameMoves');

    const moveResults: MoveResult[] = moveReader.parse_moves_to_js_arr(
      gameMovesStr ? gameMovesStr : ''
    );

    moveResults.forEach((moveResult: MoveResult) => {
      if (moveResult && moveResult.to_coord && moveResult.from_coord) {
        const toCoord = TileCoord.from_json(moveResult.to_coord);
        const fromCoord = TileCoord.from_json(moveResult.from_coord);
        console.log(moveResult);
        handleMovePiece(fromCoord, toCoord, board, game);
      }
    });
  };

  // useEffect(() => {
  //   setMoves(game.moves().str_array());
  // }, [updateGame]);

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
                <Button onClick={saveMoves}>Save Moves</Button>
              </ListGroupItem>
              <ListGroupItem>
                <Button onClick={getSavedMoves}>Get Saved Moves</Button>
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
