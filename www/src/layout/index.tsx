import React from 'react';
import { ThemeProvider } from '@emotion/react';

import '../static/scss/main.scss';
import theme from '../theme';

import LoadingContextProvider from '../context/LoadingContext';
import ModalContextProvider from '../context/ModalContext';
import ConnectionContextProvider from '../context/ConnectionContext';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <LoadingContextProvider>
      <ConnectionContextProvider>
        <ModalContextProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <div css={{ minHeight: 'calc(100vh - 132px)' }}>{children}</div>
            <Footer />
          </ThemeProvider>
        </ModalContextProvider>
      </ConnectionContextProvider>
    </LoadingContextProvider>
  );
};

export default Layout;
