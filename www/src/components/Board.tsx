import React, { useEffect, useState } from 'react';
import useGameContext from '../hooks/useGameContext';
import {
  BoardDirection,
  Tile as ITile,
  Board as IBoard,
  TileState,
  PieceType,
  PieceColor,
  TileCoord
} from 'chess-lib';
import Tile from './Tile';
import { rotateBoard } from '../util/board';
import { TILE_SPACE } from '../types/Board';

const Board = () => {
  const {
    tiles,
    newPieceCoord,
    selectedPieceCoord,
    setNewPieceCoord,
    board,
    setSelectedPieceCoord,
    boardDirection,
    setTiles
  } = useGameContext();

  const movePiece = (oldCoord: TileCoord, newCoord: TileCoord) => {
    const oldRow = oldCoord.row();
    const oldCol = oldCoord.col();
    const newRow = newCoord.row();
    const newCol = newCoord.col();

    const piece = board.get_piece(oldCoord);
    if (piece) {
      // console.log(piece);
      // board.clear_tile(row, col);
      board.move_piece(oldRow, oldCol, newRow, newCol);
      // setTiles(board.tiles());
      // console.log(board.tiles());
      // clear new piece coord
      // setNewPieceCoord(null);
      setTiles(board.tiles());
    }
  };

  const tryMovePiece = () => {
    if (selectedPieceCoord && newPieceCoord) {
      const rSelectedPieceCoord = TileCoord.from_json(selectedPieceCoord);
      const rNewPieceCoord = TileCoord.from_json(newPieceCoord);
      movePiece(rSelectedPieceCoord, rNewPieceCoord);
    }
  };

  useEffect(() => {
    if (newPieceCoord) {
      tryMovePiece();

      // reset selected and new coord
      board.clear_active_tiles();
      setNewPieceCoord(null);
      setSelectedPieceCoord(null);
    }
  }, [newPieceCoord, selectedPieceCoord]);

  useEffect(() => {
    const white_mate = board.is_checkmate(PieceColor.White);
    const black_mate = board.is_checkmate(PieceColor.Black);

    if (white_mate) {
      alert(`Black Wins!, white is in checkmate`);
    }

    if (black_mate) {
      alert(`White Wins!, black is in checkmate`);
    }
  }, [tiles]);

  return (
    <div
      css={(theme) => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(8, auto)',
        backgroundColor: theme.colors.board.background,
        padding: TILE_SPACE,
        gap: TILE_SPACE,
        width: '100%'
      })}
    >
      {/* {tiles.map((tile, idx) => ( */}
      {rotateBoard(tiles, boardDirection).map((tile, idx) => (
        <Tile key={idx} tile={tile} />
      ))}
    </div>
  );
};

export default Board;
