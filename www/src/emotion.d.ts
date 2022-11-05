import { ThemeProvider } from '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      board: {
        background: string;
        activeTile: string;
        white: string;
        black: string;
        whiteGradient: string;
        blackGradient: string;
      };
    };
  }

  export const ThemeProvider = ThemeProvider;
}
