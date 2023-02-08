import React, { useEffect, useRef, useState } from 'react';

import { ListGroup } from 'react-bootstrap';

import { Message } from '../types/Message';

import useChatContext from '../hooks/useChatContext';
import useConnectionContext from '../hooks/useConnectionContext';

import InfoListItem from './InfoListItem';
import ListBoxHeading from './ListBoxHeading';

interface Props {
  info: Message[];
}

const InfoListBox: React.FC<Props> = ({ info }) => {
  const [msgCount, setMsgCount] = useState(0);
  const { updateApp } = useConnectionContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && msgCount < info.length) {
      containerRef.current.scrollTop += containerRef.current.scrollHeight;
      setMsgCount(info.length);
    }
  }, [info]);

  return (
    <div>
      <ListBoxHeading title="Info" />
      <div
        ref={containerRef}
        style={{
          border: '1px solid black',
          height: '545px',
          overflowY: 'scroll',
          borderRadius: '5px'
        }}
        className="my-2"
      >
        <ListGroup>
          {info.map((item, idx) => (
            <InfoListItem message={item} key={idx} />
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default InfoListBox;
