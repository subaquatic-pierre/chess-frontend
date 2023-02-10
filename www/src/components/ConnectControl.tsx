import React, { useState } from 'react';
import { Button, Col, FormControl, Row, Container } from 'react-bootstrap';

import { getApiConfig } from '../config/api';

import useConnectionContext from '../hooks/useConnectionContext';

import { MessageType, Message } from '../types/Message';

const ConnectControl = () => {
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');
  const { connected, connect, disconnect, username } = useConnectionContext();

  const handleDisconnect = () => {
    disconnect();
    window.sessionStorage.removeItem('savedUsername');
    window.location.reload();
  };

  // TODO:
  // Move method to utils
  const isAvailableUsername = async (): Promise<string> => {
    // check the username is available before connecting to Web socket
    const { hostName, httpProtocol, port } = getApiConfig(location);
    const uri = `${httpProtocol}//${hostName}:${port}/check-username/${inputText}`;
    const res = await fetch(uri);

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

  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleInputKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <div>
      {connected ? (
        <Row>
          <Col xs={8}>{/* <h5>Connected: {username}</h5> */}</Col>
          <Col xs={4}>
            <Button
              className="ml-2"
              variant="danger"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Col>
        </Row>
      ) : (
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
              css={{ width: '100%' }}
              variant="success"
              onClick={handleConnect}
            >
              Connect
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ConnectControl;
