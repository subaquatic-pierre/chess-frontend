import React from 'react';
import { ModalContext } from '../context/ModalContext';

const useModalContext = () => {
  return React.useContext(ModalContext);
};

export default useModalContext;
