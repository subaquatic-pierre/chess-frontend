import React, { useState, useEffect, useRef } from 'react';

import { IModalContext } from '../types/Context';

export const ModalContext = React.createContext({} as IModalContext);

const ModalContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <ModalContext.Provider
      value={{
        loading,
        setLoading
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
