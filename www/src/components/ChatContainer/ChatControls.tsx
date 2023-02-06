import React, { useState } from 'react';

import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import useChatContext from '../../hooks/useChatContext';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../models/message';
import ControlsContainer from '../ControlsContainer';

function makeId() {
  return Math.random().toString(36).slice(2, 7);
}

const ChatControls = () => {
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');
  const {
    connected,
    connect,
    disconnect,
    joinRoom,
    activeRoom,
    listRooms,
    msgs
  } = useConnectionContext();
  const { handleUpdateChat } = useChatContext();

  const handleNewGame = () => {};

  // const handleConnect = () => {
  //   connect();
  // };

  const handleDisconnect = () => {
    disconnect();
    window.sessionStorage.removeItem('savedUsername');
    window.location.reload();
  };

  const handleNewRoom = () => {
    const newRoom = makeId();
    joinRoom(newRoom);
  };

  const isAvailableUsername = async (): Promise<string> => {
    // check the username is available before connecting to Web socket
    const res = await fetch(
      `http://localhost:8080/check-username/${inputText}`
    );

    const bodyStr: string = await res.json();
    const body: Message = JSON.parse(bodyStr);

    if (body.msg_type === MessageType.Error) {
      return body.content;
    }

    return '';
  };

  const handleConnect = async () => {
    try {
      // expecting empty string is username is available
      const notAvailable = await isAvailableUsername();
      if (notAvailable) {
        setInputError(notAvailable);
      } else {
        connect(inputText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch(`http://localhost:8080/sessions`);

      const body = await res.json();

      console.log(body);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleInputKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <ControlsContainer>
      {!connected ? (
        <Row>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={8}>
                <FormControl
                  type="text"
                  id="textInput"
                  placeholder="Username"
                  onChange={handleInputChange}
                  onKeyUp={handleInputKeyUp}
                />
                {inputError && (
                  <p
                    style={{
                      marginLeft: 10,
                      color: 'red',
                      fontSize: '0.8rem'
                    }}
                  >
                    {inputError}
                  </p>
                )}
              </Col>
              <Col xs={4}>
                <Button
                  className="ml-2"
                  variant="success"
                  onClick={handleConnect}
                >
                  Connect
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <div css={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side of controls when connected */}
          <div css={{ display: 'flex' }}></div>

          {/* Right Side of controls when connected */}
          <div css={{ display: 'flex' }}>
            <Button variant="danger" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>

          {/* <Button variant="info" onClick={listRooms}>
              List Rooms
            </Button>
            <Button variant="warning" onClick={() => handleUpdateChat()}>
              Update Chat
            </Button> */}
          {/* {activeRoom !== 'main' && (
              <Button variant="info" onClick={() => joinRoom('main')}>
                Leave Room
              </Button>
            )} */}
          {/* <Button onClick={handleNewGame}>New Game</Button> */}
          {/* <Button onClick={handleNewRoom}>New Room</Button> */}
        </div>
      )}
    </ControlsContainer>
  );
};

export default ChatControls;
