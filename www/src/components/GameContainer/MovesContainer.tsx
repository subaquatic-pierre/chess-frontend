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
import { handlePlaySavedMoves } from '../../handlers/game';

import { getSavedGameMoves, saveGameMoves } from '../../util/game';

import useBoardContext from '../../hooks/useBoardContext';
import useGameContext from '../../hooks/useGameContext';
import InfoListBox from '../InfoListBox';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../types/Message';
import CommandInputRow from '../LobbyContainer/CommandInputRow';

interface Props {
  info?: Message[];
}

const MovesContainer: React.FC<Props> = ({ info }) => {
  const [showMovesContainer, setShowMovesContainer] = useState(true);
  const { updateApp, msgs } = useConnectionContext();

  const {
    game,
    updateGame,
    onlineGameState,
    setOnlineGameState,
    moves,
    setMoves
  } = useGameContext();
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
    if (onlineGameState && onlineGameState !== 'started') {
      setShowMovesContainer(false);
    } else {
      setShowMovesContainer(true);
    }
  }, [onlineGameState]);

  return (
    <Container css={{ marginBottom: 50 }}>
      {showMovesContainer ? (
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
          {onlineGameState && (
            <Col xs={6}>
              <InfoListBox info={info ? info : []} />
              <CommandInputRow />
            </Col>
          )}
        </Row>
      ) : (
        <></>
      )}
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
