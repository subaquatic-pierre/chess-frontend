import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Col,
  Container,
  Row,
  ListGroup,
  ListGroupItem,
  InputGroup,
  FormControl
} from 'react-bootstrap';

import useConnectionContext from '../../hooks/useConnectionContext';
import useChatContext from '../../hooks/useChatContext';

const ChatInputRow: React.FC = () => {
  const { setOwnLastMsg, chatRooms, chatMessages, handleUpdateChat } =
    useChatContext();

  const { sendTextMsg, username, connected } = useConnectionContext();
  const [inputText, setInputText] = useState('');

  const handleInputSubmit = () => {
    setOwnLastMsg(inputText);
    // submit input text
    sendTextMsg(inputText);

    // clear input field
    const textInput = document.getElementById('textInput') as HTMLInputElement;
    if (textInput) {
      textInput.value = '';
    }
  };

  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleInputKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      handleInputSubmit();
    }
  };

  return (
    <Row>
      <Col xs={12} md={8}>
        <InputGroup className="mb-3">
          {connected && (
            <InputGroup.Text id="basic-addon1">@{username}:</InputGroup.Text>
          )}
          <FormControl
            type="text"
            id="textInput"
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
            disabled={!connected}
          />
        </InputGroup>
      </Col>
      <Col xs={12} md={4}>
        <Button
          disabled={!connected}
          onClick={handleInputSubmit}
          style={{ width: '100%' }}
          variant="success"
        >
          Send
        </Button>
      </Col>
    </Row>
  );
};

export default ChatInputRow;
