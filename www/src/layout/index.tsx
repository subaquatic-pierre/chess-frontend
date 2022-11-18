import React from 'react';
import { ThemeProvider } from '@emotion/react';

import '../static/scss/main.scss';
import theme from '../theme';
import Header from '../components/Header';
import GameContextProvider from '../context/GameContext';
import LoadingContextProvider from '../context/LoadingContext';
import ModalContextProvider from '../context/ModalContext';
import BoardContextProvider from '../context/BoardContext';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <LoadingContextProvider>
      <ModalContextProvider>
        <GameContextProvider>
          <BoardContextProvider>
            <ThemeProvider theme={theme}>
              <Header />
              {children}
            </ThemeProvider>
          </BoardContextProvider>
        </GameContextProvider>
      </ModalContextProvider>
    </LoadingContextProvider>
  );
};

export default Layout;
