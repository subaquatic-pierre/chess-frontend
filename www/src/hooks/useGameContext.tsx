import React from 'react';
import { GameContext } from '../context/GameContext';

const useGameContext = () => {
  return React.useContext(GameContext);
};

export default useGameContext;
