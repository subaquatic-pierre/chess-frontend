import React from 'react';

interface Props {
  title: string;
  content?: string;
}

const ListBoxHeading: React.FC<Props> = ({ title, content }) => {
  return (
    <div
      style={{
        marginBottom: -10,
        marginTop: 10,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <h5 className="mb-4">
        {title} {content && `: ${content}`}
        {/* <span style={{ backgroundColor: connected ? 'green' : 'red' }}>
        {connected ? activeRoom : 'Disconnected'}
      </span> */}
      </h5>
    </div>
  );
};

export default ListBoxHeading;
