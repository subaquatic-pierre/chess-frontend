import React, { useState, useEffect, SetStateAction } from 'react';

import { Piece as IPiece, PieceType, TileCoord } from 'chess-lib';

import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import useBoardContext from '../hooks/useBoardContext';
import { ModalContentProps } from '../types/Modal';
import Piece from './GameContainer/Piece';
import { LastMove, TileToPromote } from '../types/Board';
import { SetState } from '../types/Context';

interface Props {
  piece: IPiece;
  handlePieceClick: () => void;
}

const getPieces = (tileToPromote: LastMove): IPiece[] => {
  const pieces: IPiece[] = [];
  const pieceTypes = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
  ];

  pieceTypes.forEach((pieceType) => {
    const coord = TileCoord.new(
      tileToPromote.moveResult.to_coord.row() as number,
      tileToPromote.moveResult.to_coord.col() as number
    );
    const newPiece = IPiece.new(
      pieceType,
      tileToPromote.moveResult.piece_color,
      coord
    );
    pieces.push(newPiece);
  });

  console.log(pieces);
  return pieces;
};

const PieceContainer: React.FC<Props> = ({ piece, handlePieceClick }) => {
  return (
    <div
      css={{
        '&:hover': { cursor: 'pointer' },
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        backgroundColor: '#716d6d9f',
        borderRadius: '1rem'
      }}
      onClick={handlePieceClick}
    >
      <Piece modalPiece piece={piece} reverse={false} />
    </div>
  );
};

export const buildPromoteModal = (
  tileToPromote: LastMove,
  setPromotePiece: SetState<IPiece | null>
): React.FC<ModalContentProps> => {
  const PromotePieceModal: React.FC<ModalContentProps> = ({ handleClose }) => {
    const [pieces, setPieces] = useState<IPiece[]>([]);
    const {} = useBoardContext();

    const handleClick = (piece: IPiece) => {
      setPromotePiece(piece);
      handleClose();
    };

    useEffect(() => {
      if (tileToPromote) {
        const pieces = getPieces(tileToPromote);

        setPieces(pieces);
      }

      console.log('tileToPromote', tileToPromote);
      console.log('pieces', pieces);
    }, [tileToPromote]);

    return (
      <Modal.Body>
        <Container>
          <Row>
            {pieces.map((piece, idx) => {
              return (
                <Col xs="3" key={idx}>
                  <PieceContainer
                    piece={piece}
                    handlePieceClick={() => handleClick(piece)}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      </Modal.Body>
    );
  };

  return PromotePieceModal;
};
