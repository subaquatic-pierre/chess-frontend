import React from 'react';

import { Button, Container } from 'react-bootstrap';
import useConnectionContext from '../hooks/useConnectionContext';

const LobbyControls = () => {
  const { connected, connect, disconnect, listRooms } = useConnectionContext();

  const handleNewGame = () => {};

  const handleConnect = () => {
    connect();
  };
  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Container>
      <div
        className="d-flex py-3 my-2"
        css={{ '& > button': { marginRight: '1rem' } }}
      >
        {!connected ? (
          <Button variant="success" onClick={handleConnect}>
            Connect
          </Button>
        ) : (
          <>
            <Button variant="danger" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="info" onClick={() => listRooms()}>
              List Rooms
            </Button>
            <Button onClick={handleNewGame}>New Game</Button>
          </>
        )}
      </div>
      <div>
        <p>
          Status:{' '}
          <span style={{ backgroundColor: connected ? 'green' : 'red' }}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </p>
      </div>
    </Container>
  );
};

export default LobbyControls;
