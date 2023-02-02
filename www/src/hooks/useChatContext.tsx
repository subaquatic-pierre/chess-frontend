import React from 'react';
import { ChatContext } from '../context/ChatContext';

const useChatContext = () => {
  return React.useContext(ChatContext);
};

export default useChatContext;
