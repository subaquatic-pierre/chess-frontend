import React from 'react';
import { ConnectionContext } from '../context/ConnectionContext';

const useConnectionContext = () => {
  return React.useContext(ConnectionContext);
};

export default useConnectionContext;
