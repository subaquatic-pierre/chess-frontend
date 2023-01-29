import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Col,
  Container,
  Row,
  ListGroup,
  ListGroupItem,
  FormText,
  FormControl
} from 'react-bootstrap';
import useConnectionContext from '../hooks/useConnectionContext';

interface ChatRoomItemProp {
  chatRoom: string;
}

const ChatRoomItem: React.FC<ChatRoomItemProp> = ({ chatRoom }) => {
  const styles = {};
  return (
    <ListGroupItem>
      <p style={styles}>{chatRoom}</p>;
    </ListGroupItem>
  );
};

interface ChatTextItemProps {
  textItem: string;
}
const ChatTextItem: React.FC<ChatTextItemProps> = ({ textItem }) => {
  const styles = {
    borderRadius: '0'
  };
  return <ListGroupItem style={styles}>{textItem}</ListGroupItem>;
};

interface MainChatAreaProps {
  textItems: string[];
}
const MainChatArea: React.FC<MainChatAreaProps> = ({ textItems }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop += 1000;
    }
  }, [textItems]);

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid black',
        height: '500px',
        overflowY: 'scroll',
        borderRadius: '5px'
      }}
      className="my-2"
    >
      <ListGroup>
        {textItems.map((item, idx) => (
          <ChatTextItem textItem={item} key={idx} />
        ))}
      </ListGroup>
    </div>
  );
};

interface ChatRoomProps {
  chatRooms: string[];
}

const ChatRooms: React.FC<ChatRoomProps> = ({ chatRooms }) => {
  return (
    <div
      style={{
        border: '1px solid black',
        height: '500px',
        overflowY: 'scroll',
        borderRadius: '5px'
      }}
      className="p-2 my-2"
    >
      {chatRooms.map((item, idx) => (
        <ChatRoomItem chatRoom={item} key={idx} />
      ))}
    </div>
  );
};

const ChatContainer = () => {
  const { sendTextMsg } = useConnectionContext();
  const [inputText, setInputText] = useState('');

  const handleInputSubmit = () => {
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

  const { textItems, chatRooms } = useConnectionContext();
  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <MainChatArea textItems={textItems} />
        </Col>
        <Col xs={12} md={4}>
          <ChatRooms chatRooms={chatRooms} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={8}>
          <FormControl
            type="text"
            id="textInput"
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
          />
        </Col>
        <Col xs={12} md={4}>
          <Button
            onClick={handleInputSubmit}
            style={{ width: '100%' }}
            variant="success"
          >
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatContainer;
