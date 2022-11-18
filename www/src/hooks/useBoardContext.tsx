import React from 'react';
import { BoardContext } from '../context/BoardContext';

const useBoardContext = () => {
  return React.useContext(BoardContext);
};

export default useBoardContext;
