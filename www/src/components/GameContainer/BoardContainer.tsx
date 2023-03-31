import React, { useEffect } from 'react';
import { PieceColor, TileCoord, GameState, MoveParser } from 'chess-lib';

import { Container } from 'react-bootstrap';

import Board from './Board';
import HorizontalBorder from './HorizontalBorder';
import VerticalBorder from './VerticalBorder';
import { buildPromoteModal } from '../PromotePieceModal';

import useModalContext from '../../hooks/useModalContext';
import { BorderSide, TILE_SPACE, LastMove } from '../../types/Board';
import useBoardContext from '../../hooks/useBoardContext';
import useGameContext from '../../hooks/useGameContext';
import {
  handleBoardPieceMove,
  handleHighlightMoves
} from '../../handlers/board';
import { isPlayerTurn } from '../../util/board';

const BoardContainer = () => {
  const { showCoords } = useGameContext();

  const {
    board,
    selectedTile,
    setSelectedTile,
    setTiles,
    promotePiece,
    tileToPromote,
    setTileToPromote,
    setPromotePiece
  } = useBoardContext();
  const { setModalContent } = useModalContext();
  const { game, setLastMove, setUpdateGame } = useGameContext();

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
        const fromCoord = board.get_selected_piece_coord();

        if (fromCoord) {
          const moveResult = board.pre_move_result(
            fromCoord,
            selectedTile.coord()
          );

          if (moveResult) {
            // write move to game only if not promote piece
            // only write promote piece only piece is selected
            if (moveResult.is_promote_piece) {
              // here we set last move to promote to handle piece promotion
              // move is only written to game after new promotable
              // piece is selected
              setTileToPromote({ moveResult, promoteTile: selectedTile });
            } else {
              // or self last move to
              // write move to game
              setLastMove(moveResult);
            }
          }
        }
      } else {
        handleHighlightMoves(selectedTile, board);
      }

      // clear selected tile from coord
      setSelectedTile(null);
      handleHighlightMoves(selectedTile, board);
    }
    setTiles(board.js_tiles());
  }, [selectedTile]);

  // handle piece promote sate
  // check if tile is promotable
  // show modal if tile to promote is set
  useEffect(() => {
    if (tileToPromote) {
      console.log('tileToPromote', tileToPromote);

      setModalContent(buildPromoteModal(tileToPromote, setPromotePiece));
    }
  }, [tileToPromote]);

  // handle promote piece state, set new piece on coord
  useEffect(() => {
    // clear promote piece after board update
    if (promotePiece && tileToPromote && tileToPromote.promoteTile) {
      // update move result board with new tile
      tileToPromote.moveResult.set_promote_piece(promotePiece.piece_type());

      // write move after piece promote
      setLastMove(tileToPromote.moveResult);

      // clear promote piece state
      setPromotePiece(null);
      setTileToPromote(null);

      // update board ui
      setTiles(board.js_tiles());
    }
  }, [promotePiece]);

  return (
    <Container className="justify-content-center d-flex my-5 board-container">
      {showCoords ? (
        <div
          css={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3,auto)',
            gridGap: TILE_SPACE
          }}
        >
          <VerticalBorder side={BorderSide.Top} />
          <HorizontalBorder side={BorderSide.Left} />
          <Board />
          <HorizontalBorder side={BorderSide.Right} />
          <VerticalBorder side={BorderSide.Bottom} />
        </div>
      ) : (
        <div
          css={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Board />
        </div>
      )}
    </Container>
  );
};

export default BoardContainer;
