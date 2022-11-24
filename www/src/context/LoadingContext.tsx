import React, { useState, useEffect, useRef } from 'react';

import { SetState } from '../types/Context';

export interface ILoadingContext {
  loading: boolean;
  setLoading: SetState<boolean>;
}

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
