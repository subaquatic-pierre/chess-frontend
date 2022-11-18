import React, { useEffect } from 'react';
import useGameContext from '../hooks/useGameContext';
import useLoadingContext from '../hooks/useLoadingContext';

interface Props extends React.PropsWithChildren {}

const GameWrapper: React.FC<Props> = ({ children }) => {
  const { loading } = useLoadingContext();

  return <>{loading ? <>Loading ...</> : <>{children}</>}</>;
};

export default GameWrapper;
