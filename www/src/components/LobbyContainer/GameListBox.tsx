import React, { useEffect, useRef, useState } from 'react';

import { Button, Col, Row, ListGroup } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';

import GameListItem from './GameListItem';
import ListBoxHeading from '../ListBoxHeading';
import { Message, MessageType } from '../../models/message';

interface Props {
  availableGames: string[];
  allGames: string[];
}

const GameListBox: React.FC<Props> = ({ availableGames, allGames }) => {
  const { connected, sendCommand } = useConnectionContext();

  const gameListRef = useRef<HTMLDivElement>(null);
  const [selectedGame, setSelectedGame] = useState('');

  const listGames = () => {
    sendCommand('/list-available-games');
    sendCommand('/list-all-games');
  };

  const handleJoinClick = () => {
    sendCommand(`/join-game ${selectedGame}`);
    setSelectedGame('');
  };

  const gameClickListener = (e: any) => {
    if (e.target.getAttribute('data-type') !== 'availableGameItem') {
      setSelectedGame('');
    }
  };

  useEffect(() => {
    window.addEventListener('click', gameClickListener);
    return () => window.removeEventListener('click', gameClickListener);
  }, []);

  useEffect(() => {
    if (connected) {
      listGames();
    }
  }, [connected]);

  return (
    <Row>
      {/* Available Games */}
      <Col xs={12} md={6}>
        <div>
          <ListBoxHeading title="Available Games" />
          <div
            id="availableGameList"
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid black',
              height: '545px',
              overflowY: 'scroll',
              borderRadius: '5px'
            }}
            className="my-2"
          >
            {connected && (
              <ListGroup ref={gameListRef} style={{ borderRadius: 0 }}>
                {availableGames.map((item, idx) => (
                  <GameListItem
                    selected={selectedGame === item}
                    handleRoomClick={setSelectedGame}
                    gameName={item}
                    availableGame
                    key={idx}
                  />
                ))}
              </ListGroup>
            )}
            {selectedGame && (
              <div style={{ marginTop: 'auto', display: 'flex' }}>
                <Button
                  onClick={handleJoinClick}
                  style={{ width: '100%', borderRadius: 0 }}
                >
                  Join
                </Button>
              </div>
            )}
          </div>
        </div>
      </Col>

      {/* All Games */}
      <Col xs={12} md={6}>
        <div>
          <ListBoxHeading title="All Games" />
          <div
            id="allGameList"
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid black',
              height: '545px',
              overflowY: 'scroll',
              borderRadius: '5px'
            }}
            className="my-2"
          >
            {connected && (
              <ListGroup style={{ borderRadius: 0 }}>
                {allGames.map((item, idx) => (
                  <GameListItem
                    handleRoomClick={setSelectedGame}
                    gameName={item}
                    key={idx}
                  />
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default GameListBox;
