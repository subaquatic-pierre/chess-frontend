import React, { useEffect, useRef, useState } from 'react';

import { Col, Container, Row } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../models/message';

import LobbyControls from './LobbyControls';
import GameListBox from './GameListBox';
import InfoListBox from './InfoListBox';
import CommandInputRow from './CommandInputRow';

const parseInfo = (msgs: Message[]): Message[] => {
  const _msgs = [];
  for (const msg of msgs) {
    if (msg.msg_type !== MessageType.ClientMessage) {
      _msgs.push(msg);
    }
  }

  return _msgs;
};

const parseGames = (msgs: Message[], gameListType: MessageType): string[] => {
  for (let i = msgs.length - 1; i >= 0; i--) {
    const msg = msgs[i];
    if (msg.msg_type === gameListType && msg.content) {
      return msg.content.split(',');
    }
  }

  return [];
};

const LobbyContainer = () => {
  const [intervalId, setIntervalId] = useState<any>();

  const [allGames, setAllGames] = useState<string[]>([]);
  const [availableGames, setAvailableGames] = useState<string[]>([]);

  const { connected, sendCommand, updateApp, msgs } = useConnectionContext();

  const [info, setInfo] = useState<Message[]>([]);

  const handleUpdateLobby = () => {
    const info = parseInfo(msgs);
    const allGames = parseGames(msgs, MessageType.AllGameList);
    const availableGames = parseGames(msgs, MessageType.AvailableGameList);

    setAllGames(allGames);
    setAvailableGames(availableGames);
    setInfo(info);
  };

  useEffect(() => {
    handleUpdateLobby();
  }, [updateApp]);

  const listGames = () => {
    sendCommand('/list-available-games');
    sendCommand('/list-all-games');
  };

  // used as a interval to update UI
  // web socket session misses state update sometimes
  // it is needed to set up interval to poll for new messages
  // which have been pushed to global message list
  // react is unable to update state fast enough
  useEffect(() => {
    if (connected) {
      listGames();
    }

    if (connected && !intervalId) {
      const id = setInterval(handleUpdateLobby, 1000);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [connected]);

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
            <CommandInputRow />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LobbyContainer;
