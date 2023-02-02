import React from 'react';

interface Props {
  title: string;
  content?: string;
}

const ChatBoxHeading: React.FC<Props> = ({ title, content }) => {
  return (
    <div
      style={{
        marginBottom: -10,
        marginTop: 10,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <p>
        {title} {content && `: ${content}`}
        {/* <span style={{ backgroundColor: connected ? 'green' : 'red' }}>
        {connected ? activeRoom : 'Disconnected'}
      </span> */}
      </p>
    </div>
  );
};

export default ChatBoxHeading;
