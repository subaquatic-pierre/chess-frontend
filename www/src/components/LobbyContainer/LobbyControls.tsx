import React from 'react';

import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import useChatContext from '../../hooks/useChatContext';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../models/message';
import ControlsContainer from '../ControlsContainer';

const LobbyControls = () => {
  const { connected, disconnect, sendCommand } = useConnectionContext();

  const handleDisconnect = () => {
    disconnect();
  };

  const handleNewGame = () => {
    sendCommand('/new-game');
  };

  return (
    <ControlsContainer>
      {connected ? (
        <div css={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side of controls when connected */}
          <div css={{ display: 'flex' }}>
            <Button variant="success" onClick={handleNewGame}>
              New Game
            </Button>
            <Button
              variant="info"
              onClick={() => sendCommand('/list-all-games')}
            >
              List All Games
            </Button>
            <Button
              variant="info"
              onClick={() => sendCommand('/list-available-games')}
            >
              List Available Games
            </Button>
          </div>

          {/* Right Side of controls when connected */}
          <div css={{ display: 'flex' }}>
            <Button variant="danger" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div css={{ display: 'flex', justifyContent: 'space-between' }}>
          Please go to home page to connect!
        </div>
      )}
    </ControlsContainer>
  );
};

export default LobbyControls;
