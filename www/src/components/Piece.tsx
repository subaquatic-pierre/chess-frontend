import React from 'react';
import { Piece as IPiece, PieceType } from 'chess-lib';
import { getPieceImage } from '../util/piece';

interface Props {
  piece: IPiece;
  reverse: boolean;
}

const Piece: React.FC<Props> = ({ piece, reverse }) => {
  return (
    <div>
      <img src={getPieceImage(piece, reverse)} />
    </div>
  );
};

export default Piece;
