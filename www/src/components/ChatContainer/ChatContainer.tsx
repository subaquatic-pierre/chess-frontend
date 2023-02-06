import React, { useEffect, useRef, useState } from 'react';

import { Col, Container, Row } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';
import ChatInputRow from './ChatInputRow';

import RoomListBox from './RoomListBox';
import MainChatBox from './MainChatBox';

import { MessageType, Message } from '../../models/message';
import { buildOwnMsg } from '../../util/message';
import ChatControls from './ChatControls';
import useChatContext from '../../hooks/useChatContext';
import UserListBox from './UserListBox';

const ChatContainer = () => {
  const [intervalId, setIntervalId] = useState<any>();

  const { connected, activeRoom } = useConnectionContext();
  const { handleUpdateChat } = useChatContext();

  // used as a interval to update UI
  // web socket session misses state update sometimes
  // it is needed to set up interval to poll for new messages
  // which have been pushed to global message list
  // react is unable to update state fast enough
  useEffect(() => {
    if (connected && !intervalId) {
      const id = setInterval(handleUpdateChat, 500);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [connected]);

  return (
    <>
      <ChatControls />

      <Container>
        <Row>
          <Col
            style={{ height: '100%' }}
            xs={{ span: 12, order: 2 }}
            md={{ span: 2, order: 1 }}
          >
            <RoomListBox />
          </Col>
          <Col xs={{ span: 12, order: 1 }} md={{ span: 8, order: 2 }}>
            <MainChatBox />
            <ChatInputRow />
          </Col>
          <Col xs={{ span: 12, order: 3 }} md={{ span: 2, order: 3 }}>
            <UserListBox />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatContainer;
