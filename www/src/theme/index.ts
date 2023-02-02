import { Theme } from '@emotion/react';

export const INFO = '#BFDB38';
export const SELF = '#1f418a';
export const OTHER = '#1f2527';
export const STATUS = '#38a974';
export const ERROR = '#fc0d00';

const theme: Theme = {
  colors: {
    board: {
      background: '#91AA9D',
      activeTile: '#FF6868',
      black: '#3E606F',
      white: '#D1DBBD',
      whiteGradient:
        'radial-gradient(circle, #d05151ab 15%, rgba(209,219,189,1) 45%)',
      blackGradient:
        'radial-gradient(circle, #d05151ab 15%, rgba(62,96,111,1) 45%)'
    }
  }
};

export default theme;
