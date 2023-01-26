import React, { useState } from 'react';
import { SetState } from '../types/Context';
import { Game, MoveResult, PieceColor } from 'chess-lib';
import { LastMove } from '../types/Board';

export interface IGameContext {
  setGame: SetState<Game>;
  game: Game;

  moves: string[];
  setMoves: SetState<string[]>;

  // player state, used to determine who moves next
  players: number;
  setPlayers: SetState<number>;

  // show coord state
  showCoords: boolean;
  setShowCoords: SetState<boolean>;

  // last move state, used to write moves to game
  lastMove: MoveResult | null;
  setLastMove: SetState<MoveResult | null>;

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
  const [lastMove, setLastMove] = useState<MoveResult | null>(null);
  const [updateGame, setUpdateGame] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);

  // players
  const [players, setPlayers] = useState(0);

  return (
    <GameContext.Provider
      value={{
        setGame,
        game,

        players,
        setPlayers,

        // used to display moves played
        moves,
        setMoves,

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
