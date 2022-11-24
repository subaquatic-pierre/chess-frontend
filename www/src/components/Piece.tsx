import React from 'react';
import { Piece as IPiece, PieceType } from 'chess-lib';
import { getPieceImage } from '../util/piece';

interface Props {
  piece: IPiece;
  reverse: boolean;
  modalPiece?: boolean;
}

const Piece: React.FC<Props> = ({ modalPiece, piece, reverse }) => {
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <img
        css={{
          width: modalPiece ? '100%' : '60%',
          height: modalPiece ? '100%' : '60%'
        }}
        src={getPieceImage(piece, reverse)}
      />
    </div>
  );
};

export default Piece;
