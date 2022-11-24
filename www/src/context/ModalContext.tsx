import React, { useState } from 'react';

import { Modal } from 'react-bootstrap';

import { ModalContentProps } from '../types/Modal';

export interface IModalContext {
  setModalContent: (component: React.FC<ModalContentProps>) => void;
}

export const ModalContext = React.createContext({} as IModalContext);

const ModalContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState(<></>);

  // const setContent = () => setShow(false);
  const handleClose = () => setShow(false);

  const setModalContent = (Component: React.FC<ModalContentProps>) => {
    setContent(<Component handleClose={handleClose} />);
    setShow(true);
  };

  return (
    <ModalContext.Provider
      value={{
        setModalContent
      }}
    >
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        keyboard={false}
      >
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
