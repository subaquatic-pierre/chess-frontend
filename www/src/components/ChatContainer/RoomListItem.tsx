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

interface RoomListItemProp {
  chatRoom: string;
  selected: boolean;
  handleRoomClick: (roomName: string) => void;
}

const RoomListItem: React.FC<RoomListItemProp> = ({
  handleRoomClick,
  selected,
  chatRoom
}) => {
  const { activeRoom } = useConnectionContext();
  const styles = {};

  return (
    <ListGroupItem
      style={{
        backgroundColor: selected
          ? SELECTED_ROOM
          : activeRoom === chatRoom
          ? ACTIVE_ROOM
          : 'white'
      }}
      className={activeRoom === chatRoom ? '' : 'hover-pointer'}
      data-type="roomListItem"
      onClick={
        activeRoom !== chatRoom ? () => handleRoomClick(chatRoom) : undefined
      }
    >
      <div data-type="roomListItem">{chatRoom}</div>
    </ListGroupItem>
  );
};

export default RoomListItem;
