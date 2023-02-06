import React, { useEffect, useRef, useState } from 'react';

import { Col, Container, Row } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../models/message';

import LobbyControls from './LobbyControls';
import GameListBox from './GameListBox';
import InfoListBox from './InfoListBox';

const parseGames = (msgs: Message[], gameListType: MessageType): string[] => {
  for (const msg of msgs) {
    if (msg.msg_type === gameListType && msg.content) {
      return msg.content.split(',');
    }
  }
  return [];
};

const parseInfo = (msgs: Message[]): Message[] => {
  const _msgs = [];
  for (const msg of msgs) {
    if (msg.msg_type !== MessageType.ClientMessage) {
      _msgs.push(msg);
    }
  }

  return _msgs;
};

const LobbyContainer = () => {
  const { connected, updateApp, msgs } = useConnectionContext();

  const [flashUpdate, setFlashUpdate] = useState(false);

  const [allGames, setAllGames] = useState<string[]>([]);
  const [availableGames, setAvailableGames] = useState<string[]>([]);
  const [info, setInfo] = useState<Message[]>([]);

  const [intervalId, setIntervalId] = useState<any>();

  const handleUpdateLobby = () => {
    const allGames = parseGames(msgs, MessageType.AvailableGameList);
    const availableGames = parseGames(msgs, MessageType.AllGameList);
    const info = parseInfo(msgs);

    setAllGames(allGames);
    setAvailableGames(availableGames);
    setInfo(info);
  };

  // used as a interval to update UI
  // web socket session misses state update sometimes
  // it is needed to set up interval to poll for new messages
  // which have been pushed to global message list
  // react is unable to update state fast enough
  useEffect(() => {
    if (connected && !intervalId) {
      const id = setInterval(handleUpdateLobby, 500);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [connected]);

  useEffect(() => {
    handleUpdateLobby();
  }, [updateApp]);

  return (
    <>
      <LobbyControls />

      <Container>
        <Row>
          <Col xs={12} md={6}>
            <GameListBox allGames={allGames} availableGames={availableGames} />
          </Col>
          <Col xs={12} md={6}>
            <InfoListBox info={info} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LobbyContainer;
