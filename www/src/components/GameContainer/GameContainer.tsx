import React, { useEffect, useState, useRef } from 'react';
import {
  MoveReader,
  MoveResult,
  TileCoord,
  Game,
  MoveParser,
  PieceColor,
  GameState
} from 'chess-lib';

import useLoadingContext from '../../hooks/useLoadingContext';
import useGameContext from '../../hooks/useGameContext';
import useBoardContext from '../../hooks/useBoardContext';
import {
  handleCheckmate,
  handleGameStringMove,
  handlePlaySavedMoves
} from '../../handlers/game';

import { LastMove } from '../../types/Board';
import { handleBoardPieceMove } from '../../handlers/board';
import { clearSavedGameMoves, saveGameMoves } from '../../util/game';
import useConnectionContext from '../../hooks/useConnectionContext';

import { Message, MessageType } from '../../types/Message';

import BoardContainer from './BoardContainer';
import GameControls from './GameControls';
import MovesContainer from './MovesContainer';

import GameContextProvider from '../../context/GameContext';
import BoardContextProvider from '../../context/BoardContext';

const getLastMoveFromMsgs = (msgs: Message[]): Message | null => {
  for (let i = msgs.length - 1; i >= 0; i--) {
    let msg = msgs[i];
    if (msg.msg_type === MessageType.GameMove) {
      return msg;
    }
  }

  return null;
};

interface Props extends React.PropsWithChildren {}

const GameContainer: React.FC<Props> = ({ children }) => {
  const [gameInfo, setGameInfo] = useState<Message[]>([]);

  const { sendMoveMsg, updateApp, msgs } = useConnectionContext();

  const { loading, setLoading } = useLoadingContext();
  const { board, setTiles, tiles, setBoardDirection, resetAll } =
    useBoardContext();
  const {
    game,
    lastMove,
    setMoves,
    setLastMove,
    onlineGameState,
    setOnlineGameState
  } = useGameContext();

  // used as global effect to game change
  // updated each time board is updated
  // used to write move to game
  // used to make network request with move result
  useEffect(() => {
    if (lastMove) {
      // board will have been updated with new tile positions
      // after move is made ie. lastMove is the result returned from the
      // updated board
      // console.log('lastMove', lastMove.to_json());
      const moveStr = MoveParser.move_result_to_str(lastMove);

      const playerTurn = game.player_turn();

      // add last move to game
      handleGameStringMove(moveStr, playerTurn, board, game);

      // save moves to local session
      if (!onlineGameState) {
        saveGameMoves(game);
      }

      // make network request with new move notation
      if (!lastMove.is_from_remote) {
        sendMoveMsg(moveStr);
      }

      // set moves on UI
      setMoves(game.moves().str_array());
      setTiles(board.js_tiles());
      handleCheckmate(game, board, setOnlineGameState);
    }
  }, [lastMove]);

  useEffect(() => {
    if (onlineGameState && onlineGameState === 'winner') {
      if (game.get_winner() === PieceColor.White) {
        alert(`White Wins!, black is in checkmate`);
      } else if (game.get_winner() === PieceColor.Black) {
        alert(`Black Wins!, white is in checkmate`);
      }
    }
  }, [onlineGameState]);

  // check user session for current game state
  // update board and game state from session
  // only set loading false after game is initialized
  const initLoading = () => {
    const playerColor = window.sessionStorage.getItem('playerColor');
    if (playerColor) {
      resetAll();
    }

    // completed loading
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  // initialized game from session
  useEffect(() => {
    initLoading();

    // remove player color if page is refreshed
    // `playerColor` storage state is used to determine
    // if currently in online game
    window.onbeforeunload = function () {
      sessionStorage.removeItem('playerColor');
    };

    return () => {
      window.sessionStorage.removeItem('playerColor');
    };
  }, []);

  // effect used to initialize game state after loading
  // is completed
  useEffect(() => {
    const playerColor = window.sessionStorage.getItem('playerColor');
    if (!loading) {
      if (playerColor) {
        // window.sessionStorage.removeItem('gameMoves');
        game.set_online(true);
        if (playerColor === 'black') {
          game.set_player_color(PieceColor.Black);
          setOnlineGameState('started');
          setBoardDirection(PieceColor.Black);
        } else {
          game.set_player_color(PieceColor.White);
          setOnlineGameState('waiting');
          setBoardDirection(PieceColor.White);
        }
      } else {
        if (!playerColor) {
          handlePlaySavedMoves(board, game);
          // set moves on UI
          setMoves(game.moves().str_array());
        }
      }
    }
  }, [loading]);

  const parseGameRemoteServerInfo = (msgs: Message[]): Message[] => {
    const _msgs: Message[] = [];
    for (const msg of msgs) {
      switch (msg.msg_type) {
        case MessageType.GameJoin:
          setOnlineGameState('started');
          _msgs.push(msg);
          continue;
        case MessageType.GameLeave:
          if (game.state() !== GameState.Ended) setOnlineGameState('resigned');
          _msgs.push(msg);
          continue;
        case MessageType.GameChat:
          _msgs.push(msg);
          continue;

        default:
          _msgs.push(msg);
          continue;
      }
    }

    return _msgs;
  };

  // main effect used to receive message from remote server
  useEffect(() => {
    // get last move from msg stream in ConnectionContext
    const maybeLastMoveMsg = getLastMoveFromMsgs(msgs);

    if (onlineGameState && maybeLastMoveMsg) {
      // get player turn and parse string to
      // move result
      const playerTurn = game.player_turn();
      const moveRes = MoveParser.str_to_move_result(
        maybeLastMoveMsg.content,
        playerTurn
      );

      // update is_from_remote
      // flag used to prevent local from
      // resending move to server
      moveRes.set_is_from_remote(true);

      setLastMove(moveRes);
    }

    const info = parseGameRemoteServerInfo(msgs);
    setGameInfo(info);
  }, [updateApp]);

  return (
    <>
      {loading ? (
        <>Loading ...</>
      ) : (
        <>
          <GameControls />
          <BoardContainer />
          <MovesContainer info={gameInfo} />
        </>
      )}
    </>
  );
};

export default GameContainer;
