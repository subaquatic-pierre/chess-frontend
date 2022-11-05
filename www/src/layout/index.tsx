import React from 'react';
import { ThemeProvider } from '@emotion/react';

import '../static/scss/main.scss';
import theme from '../theme';
import Header from '../components/Header';
import GameContextProvider from '../context/GameContext';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <GameContextProvider>
      <ThemeProvider theme={theme}>
        <>
          <Header />
          {children}
        </>
      </ThemeProvider>
    </GameContextProvider>
  );
};

export default Layout;
