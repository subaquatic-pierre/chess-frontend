import React, { useEffect, useRef, useState } from 'react';
import { navigate } from 'gatsby';

import { Button, Col, Row, ListGroup } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';

import GameListItem from './GameListItem';
import ListBoxHeading from '../ListBoxHeading';
import { Message, MessageType } from '../../types/Message';

interface Props {
  allGames: string[];
  availableGames: string[];
}

const GameListBox: React.FC<Props> = ({ allGames, availableGames }) => {
  const {
    connected,
    sendCommand,
    updateApp,
    msgs,
    joinGame,
    leaveGame,
    newGame
  } = useConnectionContext();

  const gameListRef = useRef<HTMLDivElement>(null);
  const [selectedGame, setSelectedGame] = useState('');

  const handleJoinClick = () => {
    joinGame(selectedGame);
    setSelectedGame('');
    window.sessionStorage.setItem('playerColor', 'black');
    navigate('/game');
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

  // useEffect(() => {
  //   if (connected && !intervalId) {
  //     const id = setInterval(handleUpdateGames, 1000);
  //     setIntervalId(id);
  //   }
  //   return () => clearInterval(intervalId);
  // }, [connected]);

  // // on first render if connected, call listGames command
  // useEffect(() => {
  //   if (connected) {
  //     listGames();
  //   }
  // }, [connected]);

  // useEffect(() => {
  // handleUpdateGames();
  // const allGames = parseGames(msgs, MessageType.AllGameList);
  // const availableGames = parseGames(msgs, MessageType.AvailableGameList);

  // console.log('allGames', allGames);
  // console.log('availableGames', availableGames);
  // }, [updateApp]);

  return (
    <Row>
      {/* Available Games */}
      {/* <Col xs={12} md={6}> */}
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
                  handleGameClick={setSelectedGame}
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
      {/* </Col> */}

      {/* All Games
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
                  <GameListItem gameName={item} key={idx} />
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </Col> */}
    </Row>
  );
};

export default GameListBox;
