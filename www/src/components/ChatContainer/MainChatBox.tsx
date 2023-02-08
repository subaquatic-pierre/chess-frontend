import React, { useEffect, useRef, useState } from 'react';

import { ListGroup } from 'react-bootstrap';

import { Message } from '../../types/Message';
import MainChatItem from './MainChatItem';
import useChatContext from '../../hooks/useChatContext';
import useConnectionContext from '../../hooks/useConnectionContext';

import ListBoxHeading from '../ListBoxHeading';

const MainChatBox: React.FC = () => {
  const [msgCount, setMsgCount] = useState(0);
  const { activeRoom } = useConnectionContext();
  const { chatMessages } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgCount < chatMessages.length) {
      if (containerRef.current) {
        containerRef.current.scrollTop += 1000;
      }

      setMsgCount(chatMessages.length);
    }
  }, [chatMessages]);

  return (
    <div>
      <ListBoxHeading
        title="Active Room"
        content={activeRoom ? activeRoom : 'Not Connected'}
      />
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
          {chatMessages.map((item, idx) => (
            <MainChatItem chatMessage={item} key={idx} />
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default MainChatBox;
