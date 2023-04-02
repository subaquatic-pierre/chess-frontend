import { Game } from 'chess-lib';

export const saveGameMoves = (game: Game) => {
  // write moves to session storage
  // console.log('Saving game moves ...', game.print_moves());
  sessionStorage.setItem('gameMoves', game.print_moves());
  // console.log('Moves saved.');
};

export const clearSavedGameMoves = () => {
  sessionStorage.removeItem('gameMoves');
};

export const getSavedGameMoves = (): string => {
  const gameMovesStr = sessionStorage.getItem('gameMoves');
  if (gameMovesStr) {
    return gameMovesStr;
  }
  return '';
};
