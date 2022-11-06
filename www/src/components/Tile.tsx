import React, { useRef, useState } from 'react';
import {
  Piece as IPiece,
  PieceColor,
  Tile as ITile,
  TileCoord,
  TileState
} from 'chess-lib';
import { useEffect } from 'react';
import useGameContext from '../hooks/useGameContext';
import Piece from './Piece';
import { isPieceReverse } from '../util/piece';
import { TILE_HEIGHT } from '../types/Board';
import { parseTileColor, parseTileFilter } from '../util/tile';

interface Props {
  tile: ITile;
}

const Tile: React.FC<Props> = ({ tile }) => {
  const {
    boardDirection,
    board,
    setTiles,
    selectedPieceCoord,
    setNewPieceCoord,
    setSelectedPieceCoord
  } = useGameContext();
  const ref = useRef<HTMLElement | null>(null);
  const activeRef = useRef(tile.state() === TileState.Active);
  const [active, setActive] = useState(tile.state() === TileState.Active);

  // handle active state toggle on click
  const handleTileClick = () => {
    if (!active) {
      setActive(true);
    }
  };

  // handle away from tile click,
  // mark as inactive if not clicked on tile
  const handleAwayClickListener = (e: any) => {
    const el = ref.current;
    if (el) {
      if (activeRef.current) {
        if (!el.contains(e.target)) {
          tile.set_state(TileState.Inactive);
          setActive(false);
        }
      }
    }
  };

  useEffect(() => {
    // only set tile active if has piece
    if (tile.piece()) {
      if (active) {
        // side effect, sets piece state to active if piece on tile
        board.set_tile_state(tile.coord(), TileState.Active);

        board.highlight_moves(tile.coord());
        activeRef.current = true;
      } else {
        board.set_tile_state(tile.coord(), TileState.Inactive);
        board.clear_highlights();

        activeRef.current = false;
      }

      // set selected coord, to start move from
      if (active && !selectedPieceCoord) {
        setSelectedPieceCoord(tile.coord().to_json());
      }
    }

    // set new piece coord to move to
    if (active && selectedPieceCoord) {
      setNewPieceCoord(tile.coord().to_json());

      // remove active state to allow next click to
      // set tile as active
      setActive(false);
    }

    setTiles(board.tiles());
  }, [active]);

  useEffect(() => {
    // re render tiles
    // console.log('tiles', tile.to_json());
  }, [tile]);

  // register click listener to remove active state on
  // away from tile click
  useEffect(() => {
    if (window) {
      window.addEventListener('click', handleAwayClickListener);
    }
    return () => window.removeEventListener('click', handleAwayClickListener);
  }, []);

  return (
    <div
      ref={ref as any}
      onClick={handleTileClick}
      css={(theme) => ({
        background: parseTileColor(tile, theme),
        filter: parseTileFilter(tile),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: TILE_HEIGHT,
        width: TILE_HEIGHT
      })}
    >
      {/* {tile.render()} */}
      {tile.piece() && (
        <Piece
          piece={tile.piece() as IPiece}
          reverse={isPieceReverse(
            boardDirection,
            tile.piece()?.color() as PieceColor
          )}
        />
      )}
    </div>
  );
};

export default Tile;
