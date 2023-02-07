import React, { useEffect, useRef, useState } from 'react';

import { ListGroupItem } from 'react-bootstrap';
import useConnectionContext from '../../hooks/useConnectionContext';

const ACTIVE_ROOM = '#9fa3a34d';
const SELECTED_ROOM = '#72c4f04d';

import { INFO, STATUS } from '../../theme';

interface Props {
  gameName: string;
  handleGameClick?: (gameName: string) => void;
  selected?: boolean;
  availableGame?: boolean;
}

const GameListItem: React.FC<Props> = ({
  handleGameClick,
  selected,
  gameName,
  availableGame
}) => {
  const { username } = useConnectionContext();
  const styles = {};

  return (
    <ListGroupItem
      style={{
        backgroundColor: selected
          ? SELECTED_ROOM
          : username === gameName
          ? ACTIVE_ROOM
          : 'white'
      }}
      className={availableGame && username !== gameName ? 'hover-pointer' : ''}
      data-type={
        availableGame && username !== gameName ? 'availableGameItem' : ''
      }
      onClick={
        username !== gameName && handleGameClick
          ? () => handleGameClick(gameName)
          : undefined
      }
    >
      <div data-type={availableGame ? 'availableGameItem' : ''}>{gameName}</div>
    </ListGroupItem>
  );
};

export default GameListItem;
