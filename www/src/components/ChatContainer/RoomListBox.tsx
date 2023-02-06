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

import RoomListItem from './RoomListItem';
import ListBoxHeading from '../ListBoxHeading';

const RoomListBox: React.FC = () => {
  const { chatRooms, handleUpdateChat } = useChatContext();
  const { joinRoom, listRooms, connected } = useConnectionContext();
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
      <ListBoxHeading title="Rooms" />
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
            {chatRooms.map((item, idx) => (
              <RoomListItem
                selected={selectedRoom === item}
                handleRoomClick={setSelectedRoom}
                chatRoom={item}
                key={idx}
              />
            ))}
          </ListGroup>
        )}
        {selectedRoom && (
          <div style={{ marginTop: 'auto', display: 'flex' }}>
            <Button
              onClick={handleJoinClick}
              style={{ width: '100%', borderRadius: 0 }}
            >
              Join
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListBox;
