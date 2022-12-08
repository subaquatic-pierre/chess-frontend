import { Game } from 'chess-lib';

export const saveMovesToSession = (game: Game) => {
  sessionStorage.setItem('gameMoves', game.print_moves());
};
export const getMovesFromSession = (): string | null => {
  return sessionStorage.getItem('gameMoves');
};

export const clearMovesFromSession = () => {
  sessionStorage.removeItem('gameMoves');
};
