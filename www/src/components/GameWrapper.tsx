import React, { useEffect } from 'react';
import useGameContext from '../hooks/useGameContext';

interface Props extends React.PropsWithChildren {}

const GameWrapper: React.FC<Props> = ({ children }) => {
  const { loading } = useGameContext();

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameWrapper;
