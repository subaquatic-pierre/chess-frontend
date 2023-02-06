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
import useConnectionContext from '../../hooks/useConnectionContext';

const ACTIVE_ROOM = '#9fa3a34d';
const SELECTED_ROOM = '#72c4f04d';

import { INFO, STATUS } from '../../theme';

interface Props {
  gameName: string;
  handleRoomClick: (roomName: string) => void;
  selected?: boolean;
  availableGame?: boolean;
}

const GameListItem: React.FC<Props> = ({
  handleRoomClick,
  selected,
  gameName,
  availableGame
}) => {
  const styles = {};

  return (
    <ListGroupItem
      style={{
        backgroundColor: selected ? SELECTED_ROOM : 'white'
      }}
      className={availableGame ? 'hover-pointer' : ''}
      data-type={availableGame ? 'roomListItem' : ''}
      onClick={availableGame ? () => handleRoomClick(gameName) : undefined}
    >
      <div data-type={availableGame ? 'roomListItem' : ''}>{gameName}</div>
    </ListGroupItem>
  );
};

export default GameListItem;
