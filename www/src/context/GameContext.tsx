import React, { useState, useEffect, useRef } from 'react';
import { SetState } from '../types/Context';
import { Game, GameState, PieceColor } from 'chess-lib';

export interface IGameContext {
  setGame: SetState<Game>;
  game: Game;

  // checkmate state
  setCheckmate: SetState<PieceColor | null>;

  // player state, used to determine who moves next
  players: number;
  setPlayers: SetState<number>;

  playerTurn: PieceColor;
  setPlayerTurn: SetState<PieceColor>;
}

export const GameContext = React.createContext({} as IGameContext);

const firstGame = Game.new();

const GameContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [playerTurn, setPlayerTurn] = useState<PieceColor>(PieceColor.White);
  const [checkmate, setCheckmate] = useState<PieceColor | null>(null);
  const [game, setGame] = useState<Game>(firstGame);

  // players
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    if (checkmate !== null) {
      if (checkmate === PieceColor.White) {
        alert(`Black Wins!, white is in checkmate`);
        game.update_state(GameState.Ended);
      } else if (checkmate === PieceColor.Black) {
        alert(`White Wins!, black is in checkmate`);
        game.update_state(GameState.Ended);
      }
    }
  }, [checkmate]);

  useEffect(() => {
    if (game.state() !== GameState.Ended) {
      setCheckmate(null);
    }
  }, [game]);

  return (
    <GameContext.Provider
      value={{
        setGame,
        game,

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
