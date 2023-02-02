import React, { useState } from 'react';

import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import useChatContext from '../../hooks/useChatContext';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../models/message';

function makeId() {
  return Math.random().toString(36).slice(2, 7);
}

const LobbyControls = () => {
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
    <Container>
      <div
        className="py-3 my-2"
        css={{ '& > button': { marginRight: '1rem' } }}
      >
        {!connected ? (
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col xs={8}>
                  <FormControl
                    type="text"
                    id="textInput"
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
          <div
            className="d-flex py-3 my-2"
            css={{ '& > button': { marginRight: '1rem' } }}
          >
            <Button variant="danger" onClick={handleDisconnect}>
              Disconnect
            </Button>
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
      </div>
      {/* <div className="mb-3" css={{ '& > button': { marginRight: '1rem' } }}>
        <Row>
          <Col xs={4}>
            <Button variant="info" onClick={checkSession}>
              Server Info
            </Button>
          </Col>
        </Row>
      </div> */}
    </Container>
  );
};

export default LobbyControls;