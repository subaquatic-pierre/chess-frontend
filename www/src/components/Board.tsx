import React, { useEffect, useState } from 'react';
import useGameContext from '../hooks/useGameContext';
import {
  Tile as ITile,
  PieceColor,
  TileCoord,
  GameState,
  MoveResult,
  PieceType
} from 'chess-lib';
import Tile from './Tile';
import { rotateBoard } from '../util/board';
import { LastMove, TILE_SPACE } from '../types/Board';
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
  const {
    setCheckmate,
    game,
    setLastMoveIsPromote,
    lastMoveIsPromote,
    lastMove,
    setLastMove
  } = useGameContext();

  // handle move state
  // set promotable tile if tile is promotable
  // set last promotable move if tile is promotable
  // set last move if no tile is promotable
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
          // write move to game only if not promote piece
          // only write promote piece only piece is selected
          if (moveResult.is_promote_piece) {
            // here we set last move to promote to handle piece promotion
            // move is only written to game after new promotable
            // piece is selected
            setTileToPromote(selectedTile);
            setLastMoveIsPromote(moveResult);
          } else {
            // or self last move to
            // write move to game
            setLastMove({ moveResult });
          }
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
  // check if tile is promotable
  // show modal if tile to promote is set
  useEffect(() => {
    if (tileToPromote) {
      setModalContent(PromotePieceModal);
    }
  }, [tileToPromote]);

  // handle promote piece state, set new piece on coord
  useEffect(() => {
    // clear promote piece after board update
    if (promotePiece && tileToPromote && lastMoveIsPromote) {
      const coord = TileCoord.new(tileToPromote.row, tileToPromote.col);

      // update board with new piece
      board.set_new_tile(
        coord,
        promotePiece.piece_type(),
        promotePiece.color()
      );

      // write move after piece promote
      setLastMove({
        moveResult: lastMoveIsPromote,
        promotePiece: promotePiece.piece_type()
      });

      // clear promote piece state
      setPromotePiece(null);
      setTileToPromote(null);

      // update board ui
      setTiles(board.tiles());
    }
  }, [promotePiece]);

  // last move state, used to write moves to game
  // used to check if game is over
  useEffect(() => {
    if (lastMove) {
      const checkmateColor = board.is_checkmate();

      if (checkmateColor === PieceColor.White) {
        setCheckmate(PieceColor.White);
      } else if (checkmateColor === PieceColor.Black) {
        setCheckmate(PieceColor.Black);
      }

      const moveStr = handleWriteMoveToGame(lastMove as LastMove, board, game);
      console.log(moveStr);
    }

    // TODO
    // make network request with new move notation

    // TODO
    // write game to client session
  }, [lastMove]);

  // local tiles used to keep state fresh
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
