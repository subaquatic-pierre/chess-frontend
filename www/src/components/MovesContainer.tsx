import React, { useEffect, useRef, useState } from 'react';
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
import { handleGameStringMove, handlePlaySavedMoves } from '../handlers/game';

import { getSavedGameMoves, saveGameMoves } from '../util/game';

import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';
import InfoListBox from './LobbyContainer/InfoListBox';
import useConnectionContext from '../hooks/useConnectionContext';

import { MessageType, Message } from '../models/message';
import CommandInputRow from './LobbyContainer/CommandInputRow';

const parseInfo = (msgs: Message[]): Message[] => {
  const _msgs = [];
  for (const msg of msgs) {
    if (msg.msg_type !== MessageType.ClientMessage) {
      _msgs.push(msg);
    }
  }

  return _msgs;
};

const MovesContainer = () => {
  const { updateApp, msgs } = useConnectionContext();
  const [info, setInfo] = useState<Message[]>([]);

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
    handlePlaySavedMoves(board, game);

    // update move UI
    setMoves(game.moves().str_array());
  };

  useEffect(() => {
    const info = parseInfo(msgs);
    setInfo(info);
  }, [updateApp]);

  return (
    <Container css={{ marginBottom: 50 }}>
      <Row>
        <Col xs={4}>
          <h5 css={{ textAlign: 'center' }}>Game moves:</h5>
          <ListGroup variant="flush">
            {moves.map((moveStr, idx) => (
              <ListGroupItem key={idx}>{moveStr}</ListGroupItem>
            ))}
          </ListGroup>
        </Col>
        <Col xs={2}></Col>
        <Col xs={6}>
          <InfoListBox info={info} />
          <CommandInputRow />
        </Col>
      </Row>
    </Container>
  );
};

export default MovesContainer;

/**
<Col xs={4}>
<Form>
<FormControl
type="text"
placeholder="Enter Move"
onChange={handleInputChange}
/>
<ListGroup css={{ marginTop: 10 }}>
<ListGroupItem>
<Button onClick={() => joinRoom('new')}>Join "New" Room</Button>
</ListGroupItem>
<ListGroupItem>
<Button onClick={() => sendMsg('Test Text')}>
Send Message
</Button>
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
*/
