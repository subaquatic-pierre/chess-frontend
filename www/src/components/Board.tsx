import React, { useEffect, useState } from 'react';
import useGameContext from '../hooks/useGameContext';
import { Tile as ITile, PieceColor, TileCoord, GameState } from 'chess-lib';
import Tile from './Tile';
import { rotateBoard } from '../util/board';
import { TILE_SPACE } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';

import {
  handleMovePiece,
  handleHighlightMoves,
  checkTileToPromote
} from '../handlers/board';

import { handleWriteMoveToGame } from '../handlers/game';

import useModalContext from '../hooks/useModalContext';
import PromotePieceModal from './PromotePieceModal';

const Board = () => {
  const {
    tiles,
    board,
    selectedTile,
    boardDirection,
    setSelectedTile,
    setTiles,
    promotePiece,
    tileToPromote,
    setTileToPromote,
    setPromotePiece
  } = useBoardContext();
  const [localTiles, setLocalTiles] = useState<ITile[]>(tiles);
  const { setModalContent } = useModalContext();
  const { setCheckmate, game } = useGameContext();

  // handle move state
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
        const moveResult = handleMovePiece(selectedTile, board, game);
        if (moveResult) {
          const moveStr = handleWriteMoveToGame(moveResult, board, game);

          // TODO
          // make network request with new move notation

          // TODO
          // write game to client session
        }
      } else {
        handleHighlightMoves(selectedTile, board);
      }

      // clear selected tile from coord
      setSelectedTile(null);
      setTiles(board.tiles());
    }
  }, [selectedTile]);

  // handle piece promote sate
  useEffect(() => {
    if (tileToPromote) {
      setModalContent(PromotePieceModal);
    }
  }, [tileToPromote]);

  useEffect(() => {
    // clear promote piece after board update
    if (promotePiece && tileToPromote) {
      const coord = TileCoord.new(tileToPromote.row, tileToPromote.col);

      // update board with new piece
      board.set_new_tile(
        coord,
        promotePiece.piece_type(),
        promotePiece.color()
      );

      // clear promote piece state
      setPromotePiece(null);
      setTileToPromote(null);

      // update board ui
      setTiles(board.tiles());
    }
  }, [promotePiece]);

  // handle checkmate state
  useEffect(() => {
    const checkmateColor = board.is_checkmate();

    if (checkmateColor === PieceColor.White) {
      setCheckmate(PieceColor.White);
    } else if (checkmateColor === PieceColor.Black) {
      setCheckmate(PieceColor.Black);
    }

    // check tile to promote
    const promotableTile = checkTileToPromote(tiles);
    if (promotableTile) {
      setTileToPromote(promotableTile);
    }
  }, [tiles]);

  useEffect(() => {
    setLocalTiles(rotateBoard(board.tiles(), boardDirection));
  }, [tiles]);

  return (
    <div
      css={(theme) => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(8, minmax(10px, 1fr))',
        gridTemplateRows: 'repeat(8, minmax(10px, 1fr))',
        backgroundColor: theme.colors.board.background,
        padding: TILE_SPACE,
        gap: TILE_SPACE,
        width: '100%',
        maxWidth: '700px'
      })}
    >
      {/* {tiles.map((tile, idx) => ( */}
      {localTiles.map((tile, idx) => (
        <Tile key={idx} tile={tile} />
      ))}
    </div>
  );
};

export default Board;
