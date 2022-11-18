import React, { useState, useEffect, useRef } from 'react';

import { ILoadingContext } from '../types/Context';

export const LoadingContext = React.createContext({} as ILoadingContext);

const LoadingContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
