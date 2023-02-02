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

import { INFO, STATUS } from '../../theme';

interface Props {
  user: string;
}

const UserListItem: React.FC<Props> = ({ user }) => {
  const { username } = useConnectionContext();

  return (
    <ListGroupItem
      style={{
        backgroundColor: username == user ? ACTIVE_ROOM : 'white'
      }}
      // className={activeRoom === chatRoom ? '' : 'hover-pointer'}
      data-type="userListItem"
      // onClick={
      //   activeRoom !== chatRoom ? () => handleRoomClick(chatRoom) : undefined
      // }
    >
      <div data-type="userListItem">{user}</div>
    </ListGroupItem>
  );
};

export default UserListItem;
