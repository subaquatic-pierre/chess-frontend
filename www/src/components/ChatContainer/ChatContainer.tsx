import React, { useEffect, useRef, useState } from 'react';

import { Col, Container, Row } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';
import ChatInputRow from './ChatInputRow';

import RoomListBox from './RoomListBox';
import MainChatBox from './MainChatBox';

import { MessageType, Message } from '../../models/message';
import { buildOwnMsg } from '../../util/message';
import LobbyControls from './LobbyControls';
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
      <LobbyControls />

      <Container>
        <Row>
          <Col
            order={{ xs: 2, md: 1 }}
            style={{ height: '100%' }}
            xs={12}
            md={2}
          >
            <RoomListBox />
          </Col>
          <Col order={{ xs: 1, md: 2 }} xs={12} md={10}>
            <Row>
              <Col xs={12} md={9}>
                <MainChatBox />
              </Col>
              <Col xs={12} md={3}>
                <UserListBox />
              </Col>
            </Row>
            <ChatInputRow />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatContainer;
