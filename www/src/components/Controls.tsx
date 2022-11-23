import React, { useEffect, useState } from 'react';
import {
  BoardDirection,
  Piece,
  PieceColor,
  PieceType,
  TileCoord
} from 'chess-lib';
import { Button, Container } from 'react-bootstrap';
import useGameContext from '../hooks/useGameContext';
import useForceUpdate from '../hooks/forceUpdate';
import useBoardContext from '../hooks/useBoardContext';
import useModalContext from '../hooks/useModalContext';
import PromotePieceModal from './PromotePieceModal';
import { TileToPromote } from '../types/Board';

const Controls = () => {
  const { setModalContent } = useModalContext();
  const { setBoardDirection, boardDirection, setTileToPromote } =
    useBoardContext();
  const [direction, setDirection] = useState(boardDirection);

  const changeBoardDirection = () => {
    if (boardDirection === BoardDirection.White) {
      setDirection(BoardDirection.Black);
    } else {
      setDirection(BoardDirection.White);
    }
  };

  const handleShowModal = () => {
    const tileToPromote: TileToPromote = {
      row: 4,
      col: 4,
      pieceColor: PieceColor.White
    };
    setTileToPromote(tileToPromote);
  };

  useEffect(() => {
    setBoardDirection(direction);
  }, [direction]);

  return (
    <Container>
      <div className="d-flex py-3 my-2">
        <Button onClick={changeBoardDirection}>Toggle Board Direction</Button>
        <Button onClick={handleShowModal}>ShowModal</Button>
      </div>
    </Container>
  );
};

export default Controls;
