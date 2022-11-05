import React, { useState, useCallback } from 'react';

const useForceUpdate = () => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({} as any), []);
  return forceUpdate;
};

export default useForceUpdate;
