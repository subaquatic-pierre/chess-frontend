import React, { useEffect, useState } from 'react';

import { Game, PieceColor } from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useBoardContext from '../../hooks/useBoardContext';
import useForceUpdate from '../../hooks/forceUpdate';
import useGameContext from '../../hooks/useGameContext';
import ControlsContainer from '../ControlsContainer';
import { navigate } from 'gatsby';
import { OnlineGameState } from '../../types/Game';

const GameControls = () => {
  const { setBoardDirection, boardDirection, resetAll, setTiles, board } =
    useBoardContext();
  const { setShowCoords, showCoords, onlineGameState, game } = useGameContext();
  const forceUpdate = useForceUpdate();

  const [onlineControls, setOnlineControls] = useState<boolean>(false);

  const changeBoardDirection = () => {
    if (boardDirection === PieceColor.White) {
      setBoardDirection(PieceColor.Black);
    } else {
      setBoardDirection(PieceColor.White);
    }

    setTiles(board.js_tiles());
  };

  const handleShowCoords = () => {
    setShowCoords(!showCoords);
  };

  const handleReset = () => {
    resetAll();
    forceUpdate();
  };

  const parseOnlineGameState = (
    onlineGameState: null | OnlineGameState,
    game: Game
  ): string => {
    switch (onlineGameState) {
      case 'joined':
        return 'Game Started';

      case 'winner':
        let winner = 'White';

        if (game.get_winner() === PieceColor.Black) {
          winner = 'Black';
        }

        console.log(game.get_winner());
        return `Winner - ${winner}!`;

      case 'resigned':
        return 'Opponent Resigned';
      case 'waiting':
        return 'Waiting for opponent...';

      default:
        return '';
    }
  };

  const getBackgroundColor = (onlineGameState: null | OnlineGameState) => {
    switch (onlineGameState) {
      case 'joined':
        return 'green';
      case 'winner':
        return 'purple';
      case 'resigned':
        return 'orange';
      case 'waiting':
        return 'blue';

      default:
        return 'grey';
    }
  };

  useEffect(() => {
    if (game.is_online()) {
      setOnlineControls(true);
    }
  }, [onlineGameState]);

  return (
    <ControlsContainer>
      {onlineControls ? (
        <div>
          <div css={{ display: 'flex', justifyContent: 'space-between' }}>
            <div css={{ display: 'flex' }}>
              <h5>
                Game State:{' '}
                <span
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    backgroundColor: getBackgroundColor(onlineGameState)
                  }}
                >
                  {parseOnlineGameState(onlineGameState, game)}
                </span>
              </h5>
            </div>
            <div css={{ display: 'flex' }}>
              <Button
                variant="info"
                className="hide-mobile"
                onClick={handleShowCoords}
              >
                {showCoords ? 'Hide Coords' : 'Show Coords'}
              </Button>
              <Button
                variant="danger"
                onClick={() => window.location.assign('/lobby')}
              >
                Leave Game
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div css={{ display: 'flex', justifyContent: 'space-between' }}>
          <div css={{ display: 'flex' }}>
            <h5>Local Game</h5>
          </div>
          <div css={{ display: 'flex' }}>
            <Button variant="secondary" onClick={changeBoardDirection}>
              Change Board Direction
            </Button>
            <Button
              variant="info"
              className="hide-mobile"
              onClick={handleShowCoords}
            >
              {showCoords ? 'Hide Coords' : 'Show Coords'}
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset Game
            </Button>
          </div>
        </div>
      )}
    </ControlsContainer>
  );
};

export default GameControls;
