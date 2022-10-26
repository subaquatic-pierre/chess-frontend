import React from 'react';

import { Button } from 'react-bootstrap';

interface Props {
  handleClick: () => void;
}

const AddCarButton: React.FC<Props> = ({ handleClick }) => {
  return (
    <Button onClick={handleClick} variant="primary">
      Primary
    </Button>
  );
};

export default AddCarButton;
