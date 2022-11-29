import React, { useState, useEffect, useRef } from 'react';
import { SetState } from '../types/Context';
import { Game, GameState, PieceColor, MoveResult, PieceType } from 'chess-lib';
import { LastMove } from '../types/Board';

export interface IGameContext {
  setGame: SetState<Game>;
  game: Game;

  // checkmate state
  setCheckmate: SetState<PieceColor | null>;

  // player state, used to determine who moves next
  players: number;
  setPlayers: SetState<number>;

  // show coord state
  showCoords: boolean;
  setShowCoords: SetState<boolean>;

  // last move state, used to write moves to game
  lastMove: LastMove | null;
  setLastMove: SetState<LastMove | null>;
}

export const GameContext = React.createContext({} as IGameContext);

const firstGame = Game.new();

const GameContextProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  // loading state
  const [checkmate, setCheckmate] = useState<PieceColor | null>(null);
  const [showCoords, setShowCoords] = useState(false);
  const [game, setGame] = useState<Game>(firstGame);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [lastMoveIsPromote, setLastMoveIsPromote] = useState<MoveResult | null>(
    null
  );

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

      // TODO
      // clear game state from session
    }
  }, [checkmate]);

  useEffect(() => {
    if (game.state() !== GameState.Ended) {
      setCheckmate(null);
    }
  }, [game]);

  // TODO
  // load game from session if exists
  // useEffect(()=>{
  //   // get game from session
  //   // set game from session
  // },[])

  return (
    <GameContext.Provider
      value={{
        setGame,
        game,

        setCheckmate,

        players,
        setPlayers,

        // display coord state
        showCoords,
        setShowCoords,

        // last move used to write to the game
        lastMove,
        setLastMove
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
