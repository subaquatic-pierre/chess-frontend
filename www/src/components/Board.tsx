import React, { useEffect, useState } from 'react';
import useGameContext from '../hooks/useGameContext';
import {
  BoardDirection,
  Tile as ITile,
  Board as IBoard,
  TileState,
  PieceType,
  PieceColor,
  TileCoord,
  GameState
} from 'chess-lib';
import Tile from './Tile';
import { rotateBoard } from '../util/board';
import { TILE_SPACE } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';

import {
  handleMovePiece,
  handleHighlightMoves,
  isPlayerTurn
} from '../handlers/board';

const Board = () => {
  const {
    tiles,
    board,
    selectedTile,
    boardDirection,
    setSelectedTile,
    setTiles
  } = useBoardContext();
  const { setCheckmate, game } = useGameContext();

  useEffect(() => {
    // check if game is over
    // return early if game is over
    if (game.state() === GameState.Ended) {
      return;
    }

    if (selectedTile) {
      // ensure current player can move
      // get current player turn
      // return early if not player turn
      const curActiveCoord = board.get_selected_piece_coord();

      // TODO
      // uncomment to enable player turn capabilities
      // if (!curActiveCoord && !isPlayerTurn(selectedTile, game)) {
      //   return;
      // }

      if (curActiveCoord) {
        handleMovePiece(selectedTile, board, game);
      } else {
        handleHighlightMoves(selectedTile, board);
      }

      // clear selected tile from coord
      setSelectedTile(null);
      setTiles(board.tiles());
    }
  }, [selectedTile]);

  useEffect(() => {
    const checkmateColor = board.is_checkmate();

    if (checkmateColor === PieceColor.White) {
      setCheckmate(PieceColor.White);
    } else if (checkmateColor === PieceColor.Black) {
      setCheckmate(PieceColor.Black);
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
