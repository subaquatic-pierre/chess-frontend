import React, { useState } from 'react';
import { SetState } from '../types/Context';
import { Game, PieceColor } from 'chess-lib';
import { LastMove } from '../types/Board';

export interface IGameContext {
  setGame: SetState<Game>;
  game: Game;

  // player state, used to determine who moves next
  players: number;
  setPlayers: SetState<number>;

  // show coord state
  showCoords: boolean;
  setShowCoords: SetState<boolean>;

  // last move state, used to write moves to game
  lastMove: LastMove | null;
  setLastMove: SetState<LastMove | null>;

  // update game state toggle,
  // used as global toggle to update game state
  updateGame: boolean;
  setUpdateGame: SetState<boolean>;
}

export const GameContext = React.createContext({} as IGameContext);

const firstGame = Game.new();

const GameContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [showCoords, setShowCoords] = useState(false);
  const [game, setGame] = useState<Game>(firstGame);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [updateGame, setUpdateGame] = useState(false);

  // players
  const [players, setPlayers] = useState(0);

  return (
    <GameContext.Provider
      value={{
        setGame,
        game,

        players,
        setPlayers,

        // display coord state
        showCoords,
        setShowCoords,

        // last move used to write to the game
        lastMove,
        setLastMove,

        updateGame,
        setUpdateGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
