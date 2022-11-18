import { Board, Game, Tile, TileCoord } from 'chess-lib';
import { SetStateAction } from 'react';
import { SetState } from '../types/Context';

// const movePiece = (oldCoord: TileCoord, newCoord: TileCoord) => {
//   const oldRow = oldCoord.row();
//   const oldCol = oldCoord.col();
//   const newRow = newCoord.row();
//   const newCol = newCoord.col();

//   const piece = board.get_piece(oldCoord);
//   if (piece) {
//     // console.log(piece);
//     // board.clear_tile(row, col);
//     const isPieceMoved = board.move_piece(oldRow, oldCol, newRow, newCol);
//     // setTiles(board.tiles());
//     // console.log(board.tiles());
//     // clear new piece coord
//     // setNewPieceCoord(null);

//     // update tile from board state
//     // for re render of board
//     setTiles(board.tiles());
//   }
// };

// const tryMovePiece = () => {
//   if (selectedPieceCoord && newPieceCoord) {
//     const rSelectedPieceCoord = TileCoord.from_json(selectedPieceCoord);
//     const rNewPieceCoord = TileCoord.from_json(newPieceCoord);
//     movePiece(rSelectedPieceCoord, rNewPieceCoord);
//   }
// };

// useEffect(() => {
//   if (newPieceCoord) {
//     tryMovePiece();

//     // reset selected and new coord
//     board.clear_active_tiles();
//     setNewPieceCoord(null);
//     setSelectedPieceCoord(null);
//   }
// }, [newPieceCoord, selectedPieceCoord]);

// useEffect(() => {
//   // only set tile active if has piece
//   if (tile.piece()) {
//     if (active) {
//       // side effect, sets piece state to active if piece on tile
//       board.set_tile_state(tile.coord(), TileState.Active);

//       board.highlight_moves(tile.coord());
//       activeRef.current = true;
//     } else {
//       board.set_tile_state(tile.coord(), TileState.Inactive);
//       board.clear_highlights();

//       activeRef.current = false;
//     }

//     // set selected coord, to start move from
//     if (active && !selectedPieceCoord) {
//       setSelectedPieceCoord(tile.coord().to_json());
//     }
//   }

//   // set new piece coord to move to
//   if (active && selectedPieceCoord) {
//     setNewPieceCoord(tile.coord().to_json());

//     // remove active state to allow next click to
//     // set tile as active
//     setActive(false);
//   }

//   setTiles(board.tiles());
// }, [active]);

// useEffect(() => {
//   // re render tiles
//   // console.log('tiles', tile.to_json());
// }, [tile]);

// // register click listener to remove active state on
// // away from tile click
// useEffect(() => {
//   if (window) {
//     window.addEventListener('click', handleAwayClickListener);
//   }
//   return () => window.removeEventListener('click', handleAwayClickListener);
// }, []);

export const handleSelectedTileChange = (
  selectedTile: Tile,
  board: Board,
  game: Game,
  setTiles: SetState<Tile[]>
): boolean => {
  // check if current player turn

  // check if board has current active tile
  const curActiveCoord = board.get_selected_piece_coord();
  if (curActiveCoord) {
    // handle move piece
  }
  return false;
};
