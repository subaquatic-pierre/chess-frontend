import React, { useState, useEffect, useRef } from 'react';
import { IGameContext } from '../types/Context';
import { Game, GameState, PieceColor } from 'chess-lib';

export const GameContext = React.createContext({} as IGameContext);

const GameContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [playerTurn, setPlayerTurn] = useState<PieceColor>(PieceColor.White);
  const [checkmate, setCheckmate] = useState<PieceColor | null>(null);

  // game state
  const gameRef = useRef<Game>({} as Game);

  // players
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    if (checkmate !== null) {
      if (checkmate === PieceColor.White) {
        alert(`Black Wins!, white is in checkmate`);
        gameRef.current.update_state(GameState.Ended);
      } else if (checkmate === PieceColor.Black) {
        alert(`White Wins!, black is in checkmate`);
        gameRef.current.update_state(GameState.Ended);
      }
    }
  }, [checkmate]);

  const initGame = () => {
    const game = new Game();
    // setPlayerTurn(game.player_turn());
    gameRef.current = game;
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <GameContext.Provider
      value={{
        game: gameRef.current,

        setCheckmate,

        players,
        setPlayers,

        playerTurn,
        setPlayerTurn
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
