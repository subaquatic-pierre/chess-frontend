import React, { useEffect } from 'react';
import { PieceColor, TileCoord, GameState } from 'chess-lib';

import { Container } from 'react-bootstrap';

import Board from './Board';
import HorizontalBorder from './HorizontalBorder';
import VerticalBorder from './VerticalBorder';
import PromotePieceModal from './PromotePieceModal';

import useModalContext from '../hooks/useModalContext';
import { BorderSide, TILE_SPACE, LastMove } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';
import useGameContext from '../hooks/useGameContext';
import {
  handleMovePiece,
  handleHighlightMoves,
  isPlayerTurn
} from '../handlers/board';
import { handleWriteMoveToGame } from '../handlers/game';

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
  const { game, lastMove, setLastMove, setUpdateGame, updateGame } =
    useGameContext();

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
      if (!curActiveCoord && !isPlayerTurn(selectedTile, game)) {
        return;
      }

      if (curActiveCoord) {
        const moveResult = handleMovePiece(selectedTile, board, game);
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
    if (promotePiece && tileToPromote && tileToPromote.promoteTile) {
      const coord = TileCoord.new(
        tileToPromote.promoteTile.coord().row(),
        tileToPromote.promoteTile.coord().col()
      );

      // update board with new piece
      board.set_new_tile(
        coord,
        promotePiece.piece_type(),
        promotePiece.color()
      );

      // write move after piece promote
      setLastMove({
        moveResult: tileToPromote.moveResult,
        pieceToPromote: promotePiece.piece_type()
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
  // used to update global game state with updateGame toggle
  useEffect(() => {
    if (lastMove) {
      const checkmateColor = board.is_checkmate();

      if (checkmateColor === PieceColor.White) {
        game.set_winner(PieceColor.White);
      } else if (checkmateColor === PieceColor.Black) {
        game.set_winner(PieceColor.Black);
      }

      // write moves to game wasm object
      handleWriteMoveToGame(lastMove as LastMove, board, game);

      // update game state for any listeners to updateGame
      setUpdateGame(!updateGame);
    }
  }, [lastMove]);

  return (
    <Container className="justify-content-center d-flex my-5">
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
