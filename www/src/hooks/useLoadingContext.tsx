import React from 'react';
import { LoadingContext } from '../context/LoadingContext';

const useLoadingContext = () => {
  return React.useContext(LoadingContext);
};

export default useLoadingContext;
