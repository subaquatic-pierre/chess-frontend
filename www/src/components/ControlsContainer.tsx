import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const ControlsContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <div
        className="py-3 my-2"
        css={{ height: '80px', '& button': { marginRight: '1rem' } }}
      >
        {children}
      </div>
    </Container>
  );
};

export default ControlsContainer;
