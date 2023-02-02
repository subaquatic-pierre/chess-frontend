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
import useChatContext from '../../hooks/useChatContext';

import UserListItem from './UserListItem';
import ChatBoxHeading from './ChatBoxHeading';

const UserListBox: React.FC = () => {
  const { chatRooms, users, handleUpdateChat } = useChatContext();
  const { joinRoom, listRooms, listUsers, connected } = useConnectionContext();
  const roomListRef = useRef<HTMLDivElement>(null);
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleJoinClick = () => {
    joinRoom(selectedRoom);
    setSelectedRoom('');
  };

  const roomClickListener = (e: any) => {
    if (e.target.getAttribute('data-type') !== 'roomListItem') {
      setSelectedRoom('');
    }
  };

  useEffect(() => {
    window.addEventListener('click', roomClickListener);
    return () => window.removeEventListener('click', roomClickListener);
  }, []);

  useEffect(() => {
    if (connected) {
      listRooms();
    }
  }, [connected]);

  return (
    <div>
      <ChatBoxHeading title="Users" />
      <div
        id="roomList"
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid black',
          height: '545px',
          overflowY: 'scroll',
          borderRadius: '5px'
        }}
        className="my-2"
      >
        {connected && (
          <ListGroup ref={roomListRef} style={{ borderRadius: 0 }}>
            {users.map((item, idx) => (
              <UserListItem user={item} key={idx} />
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default UserListBox;
