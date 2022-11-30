import React, { useEffect, useState } from 'react';

import useLoadingContext from '../hooks/useLoadingContext';
import useGameContext from '../hooks/useGameContext';
import useBoardContext from '../hooks/useBoardContext';
import { handleCheckmate } from '../handlers/game';

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const { loading, setLoading } = useLoadingContext();
  const { game, updateGame } = useGameContext();

  // used as global effect to game change
  // updated each time board is updated
  useEffect(() => {
    handleCheckmate(game);

    // TODO
    // write moves to session

    // TODO
    // make network request with new move notation

    // TODO
    // set board with new tiles
  }, [updateGame]);

  // check user session for current game state
  // update board and game state from session
  // only set loading false after game is initialized
  const initGame = () => {
    // completed loading
    setTimeout(() => {
      setLoading(false);
    }, 10);
  };
  useEffect(() => {
    initGame();
  }, []);

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameContainer;
