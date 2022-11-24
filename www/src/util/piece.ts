import { PieceColor, Piece as IPiece, PieceType } from 'chess-lib';

export const getPieceImage = (piece: IPiece, reverse: boolean): string => {
  if (reverse) {
    switch (piece.piece_type()) {
      case PieceType.Pawn:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/pawnWhiteRev.svg';
        } else {
          return '/images/pieces/pawnBlackRev.svg';
        }
      case PieceType.Rook:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/rookWhiteRev.svg';
        } else {
          return '/images/pieces/rookBlackRev.svg';
        }
      case PieceType.Bishop:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/bishopWhiteRev.svg';
        } else {
          return '/images/pieces/bishopBlackRev.svg';
        }
      case PieceType.Knight:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/knightWhiteRev.svg';
        } else {
          return '/images/pieces/knightBlackRev.svg';
        }
      case PieceType.King:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/kingWhiteRev.svg';
        } else {
          return '/images/pieces/kingBlackRev.svg';
        }
      case PieceType.Queen:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/queenWhiteRev.svg';
        } else {
          return '/images/pieces/queenBlackRev.svg';
        }

      default:
        return '';
    }
  } else {
    switch (piece.piece_type()) {
      case PieceType.Pawn:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/pawnWhite.svg';
        } else {
          return '/images/pieces/pawnBlack.svg';
        }
      case PieceType.Rook:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/rookWhite.svg';
        } else {
          return '/images/pieces/rookBlack.svg';
        }
      case PieceType.Bishop:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/bishopWhite.svg';
        } else {
          return '/images/pieces/bishopBlack.svg';
        }
      case PieceType.Knight:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/knightWhite.svg';
        } else {
          return '/images/pieces/knightBlack.svg';
        }
      case PieceType.King:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/kingWhite.svg';
        } else {
          return '/images/pieces/kingBlack.svg';
        }
      case PieceType.Queen:
        if (piece.color() === PieceColor.White) {
          return '/images/pieces/queenWhite.svg';
        } else {
          return '/images/pieces/queenBlack.svg';
        }

      default:
        return '';
    }
  }
};

export const isPieceReverse = (
  boardDirection: PieceColor,
  pieceColor: PieceColor
): boolean => {
  if (boardDirection === PieceColor.White && pieceColor === PieceColor.White) {
    return false;
  } else if (
    boardDirection === PieceColor.Black &&
    pieceColor === PieceColor.Black
  ) {
    return false;
  } else {
    return true;
  }
};
