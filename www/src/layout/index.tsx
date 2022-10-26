import React from 'react';
import { ThemeProvider } from '@emotion/react';

import '../static/scss/main.scss';
import theme from '../theme';
import Header from '../components/Header';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
        {children}
      </>
    </ThemeProvider>
  );
};

export default Layout;
