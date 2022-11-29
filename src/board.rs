use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::console_log;
use crate::pieces::king::{KingCastleBoardState, KingCastleMoveResult};
// use crate::console_log;
use crate::pieces::piece::{Piece, PieceColor, PieceState, PieceType};
use crate::pieces::strategy::{MoveHandler, MoveValidator, PieceMoveStrategy, StrategyBuilder};
use crate::pieces::util::get_piece_default;
use crate::tile::{Tile, TileColor, TileCoord, TileRank, TileState};
use crate::translator::MoveWriter;

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Board {
    tiles: Vec<Tile>,
    last_en_passant: Option<TileCoord>,
    king_castle_state: KingCastleBoardState,
}

#[wasm_bindgen]
impl Board {
    pub fn new() -> Self {
        let mut tiles = Vec::new();

        let mut board = Self {
            tiles: vec![],
            last_en_passant: None,
            king_castle_state: KingCastleBoardState::default(),
        };

        let mut idx: u8 = 0;
        for row in 0..8 {
            for col in 0..8 {
                let coord = TileCoord::new(row, col);
                let piece = get_piece_default(coord.row(), coord.col());
                let tile = Tile::new(coord, idx, TileState::Inactive, piece);
                tiles.push(tile);
                idx += 1;
            }
        }

        board.set_tiles(tiles);
        board
    }

    /// return a new move writer
    /// with reference to current board state
    /// the move writer is used to write moves made
    /// on frontend and return moves as chess notation string
    /// to be written to the game
    pub fn move_writer(&self) -> MoveWriter {
        MoveWriter::new(self)
    }

    // JS methods

    /// Returns JS array cloned copy of current tiles
    /// Used to render tiles from current board state
    pub fn tiles(&self) -> Array {
        self.tiles.clone().into_iter().map(JsValue::from).collect()
    }

    /// return JS type of the piece
    /// mainly used for debugging purpose
    pub fn get_js_piece(&self, coord: &TileCoord) -> JsValue {
        let tile = self.get_tile(coord);
        match tile {
            Some(tile) => match tile.piece() {
                Some(piece) => piece.to_json(),
                None => false.into(),
            },
            None => false.into(),
        }
    }

    /// used to get current state of king castle moves
    /// used in move_piece method to check if valid
    /// king castle move can be made
    pub fn king_castle_state(&self) -> *const KingCastleBoardState {
        &self.king_castle_state
    }

    // tile methods

    pub fn set_new_tile(
        &mut self,
        coord: TileCoord,
        piece_type: Option<PieceType>,
        piece_color: Option<PieceColor>,
    ) {
        // create new piece
        let piece = if piece_type.is_none() || piece_color.is_none() {
            None
        } else {
            Some(Piece::new(piece_type.unwrap(), piece_color.unwrap(), coord))
        };

        // get tile idx
        let tile_idx = Board::tile_idx_from_coord(&coord.clone());

        // create new tile
        let new_tile = Tile::new(coord, tile_idx as u8, TileState::Inactive, piece);

        // write new tile to board array
        self.tiles[tile_idx] = new_tile;
    }

    pub fn set_tile_state(&mut self, coord: &TileCoord, state: TileState) {
        // set selected tile coord as selected
        let idx = Board::tile_idx_from_coord(coord);
        let tile = &mut self.tiles[idx];
        tile.set_state(state);
    }

    pub fn get_selected_piece_coord(&self) -> Option<TileCoord> {
        for tile in &self.tiles {
            if tile.state() == TileState::Active
                && tile.piece().is_some()
                && tile.piece().unwrap().state() == PieceState::Selected
            {
                return Some(tile.coord());
            }
        }
        None
    }

    pub fn clear_active_tiles(&mut self) {
        // clear all tile selected states
        for tile in self.tiles.iter_mut() {
            tile.set_state(TileState::Inactive)
        }
    }

    pub fn clear_highlights(&mut self) {
        // clear all highlighted tiles
        for tile in self.tiles.iter_mut() {
            tile.set_state(TileState::Inactive)
        }
    }

    pub fn highlight_moves(&mut self, coord: TileCoord) {
        if let Some(piece) = self.get_piece(&coord) {
            let mut valid_moves = vec![];
            // create new piece strategy based on piece type
            let piece_strategy = self.new_piece_strategy(piece);

            for tile in piece_strategy.moves() {
                if tile.in_bounds() {
                    let new_coord = TileCoord::new(tile.row(), tile.col());

                    // new validator
                    let validator = MoveValidator::new(new_coord, self);

                    // validate move
                    if validator.is_valid_move(piece_strategy.as_ref(), false)
                        && !validator.is_king_take()
                    {
                        valid_moves.push(new_coord)
                    }
                }
            }

            // update tile state to be highlighted
            for coord in valid_moves {
                self.tiles[Board::tile_idx_from_coord(&coord)].set_state(TileState::Highlight)
            }
        }
    }

    pub fn clear_tile(&mut self, row: u8, col: u8) {
        let coord = TileCoord::new(row, col);
        self.set_new_tile(coord, None, None);
    }

    // piece methods

    fn new_piece_strategy(&self, piece: Piece) -> Box<dyn PieceMoveStrategy> {
        StrategyBuilder::new_piece_strategy(piece.piece_type(), piece.coord(), piece.color(), self)
    }

    /// main public method used to move pieces,
    /// updates board with new pieces
    pub fn move_piece(
        &mut self,
        old_row: u8,
        old_col: u8,
        new_row: u8,
        new_col: u8,
    ) -> Option<MoveResult> {
        // do not ignore check on main method to move pieces
        // board is updated with new pieces after this method
        let result = self.handle_move_piece(old_row, old_col, new_row, new_col, false);

        // update king castle state after move is completed
        self.king_castle_state.update_state(&*self);

        result
    }

    /// method used to move piece ignoring if king is in check
    /// used to check if possible to move in/out of check
    pub fn move_piece_ignore_check(&mut self, old_row: u8, old_col: u8, new_row: u8, new_col: u8) {
        // ignore check flag active
        // method used to check if king is in check
        self.handle_move_piece(old_row, old_col, new_row, new_col, true);
    }

    /// used as base move command to move pieces
    /// ignore check flag is used to perform all move operations
    /// ignoring if king is in check
    /// ignore flag is useful in validating moving into/out of check
    fn handle_move_piece(
        &mut self,
        old_row: u8,
        old_col: u8,
        new_row: u8,
        new_col: u8,
        ignore_check: bool,
    ) -> Option<MoveResult> {
        let old_coord: TileCoord = TileCoord::new(old_row, old_col);
        let new_coord: TileCoord = TileCoord::new(new_row, new_col);
        // get old tile
        let tile = self.get_tile(&old_coord);

        // handle empty tile case
        // will return none if doesn't exist
        tile?;

        // handle empty piece case
        // will return none if doesn't exist
        // SAFETY:
        // can unwrap tile, empty case covered above
        let piece = tile.unwrap().piece();
        piece.as_ref()?;

        // SAFETY:
        // can safely unwrap piece
        // both None tile and None piece case is handled above
        let piece = tile.unwrap().piece().unwrap();

        // create new piece strategy based on piece type
        let piece_strategy = self.new_piece_strategy(piece.clone());

        // remove last en passant if not pawn move and last_en_passant is some
        if self.last_en_passant().is_some() && piece_strategy.piece_type() != PieceType::Pawn {
            self.set_last_en_passant(None);
        }

        // move validator
        let move_validator = MoveValidator::new(new_coord, self);

        // check if king take
        let is_take = move_validator.is_take();
        let is_king_take = move_validator.is_king_take();

        // only continue if move is valid
        if !move_validator.is_valid_move(piece_strategy.as_ref(), ignore_check) {
            return None;
        }

        // if en passant take clear en passant coord
        if move_validator.is_en_passant_take(&piece_strategy.moves(), piece_strategy.as_ref()) {
            if let Some(last_en_passant_coord) = self.last_en_passant() {
                // remove enemy piece pawn from their current coord
                // ie. where the last en passant coord was set
                // to be taken
                self.set_new_tile(last_en_passant_coord, None, None);
                // clear last en passant
                self.set_last_en_passant(None);
            }
        }

        let mut move_handler = MoveHandler::new(new_coord, self);
        // handle pawn move
        if piece_strategy.piece_type() == PieceType::Pawn {
            move_handler.handle_pawn_move(piece_strategy.as_ref());
        }

        let mut king_castle_result: Option<KingCastleMoveResult> = None;

        if piece_strategy.piece_type() == PieceType::King {
            king_castle_result = move_handler.handle_king_castle_move(piece_strategy.as_ref());
        }

        // only clear tiles if not king take, ie. cannot take king off board
        if !is_king_take {
            // clear old tile
            self.clear_tile(old_coord.row(), old_coord.col());

            // set new tile
            self.set_new_tile(new_coord, Some(piece.piece_type()), Some(piece.color()));

            // return true as piece is move
            return Some(MoveResult {
                piece_type: piece_strategy.piece_type(),
                piece_color: piece_strategy.color(),
                from_coord: Some(old_coord),
                to_coord: Some(new_coord),
                is_take,
                is_short_castle: king_castle_result == Some(KingCastleMoveResult::ShortCastle),
                is_long_castle: king_castle_result == Some(KingCastleMoveResult::LongCastle),
                is_promote_piece: self.is_promote_piece(),
            });
        }

        // if no piece if moved
        // return false
        None
    }

    pub fn get_piece(&self, coord: &TileCoord) -> Option<Piece> {
        let tile = self.get_tile(coord);
        match tile {
            Some(tile) => tile.piece(),
            None => None,
        }
    }

    pub fn set_piece_state(&mut self, coord: &TileCoord, piece_state: PieceState) {
        // set selected tile coord as selected
        let idx = Board::tile_idx_from_coord(coord);
        let tile = &mut self.tiles[idx];
        if tile.piece().is_some() {
            tile.set_piece_state(piece_state)
        };
    }

    pub fn peek_tile(&self, coord: &TileCoord) -> Option<Piece> {
        let piece = &self.get_piece(coord);
        if piece.is_some() {
            piece.clone()
        } else {
            None
        }
    }

    pub fn set_last_en_passant(&mut self, coord: Option<TileCoord>) {
        self.last_en_passant = coord;
    }

    pub fn last_en_passant(&self) -> Option<TileCoord> {
        self.last_en_passant
    }

    pub fn tile_at_index(&self, index: usize) -> Tile {
        self.tiles[index].clone()
    }

    pub fn num_tiles(&self) -> usize {
        self.tiles.len()
    }

    pub fn is_checkmate(&self) -> Option<PieceColor> {
        // SAFETY:
        // there is always a king on the board

        // check if white is in checkmate
        let king_coord = self.get_king_coord(PieceColor::White).unwrap();

        let king = self.get_piece(&king_coord).unwrap();

        let piece_strategy = self.new_piece_strategy(king);
        if MoveValidator::is_checkmate(piece_strategy.as_ref(), self) {
            return Some(PieceColor::White);
        }

        // check if black is in checkmate
        let king_coord = self.get_king_coord(PieceColor::Black).unwrap();

        let king = self.get_piece(&king_coord).unwrap();

        let piece_strategy = self.new_piece_strategy(king);
        if MoveValidator::is_checkmate(piece_strategy.as_ref(), self) {
            return Some(PieceColor::Black);
        }

        None
    }

    // ---
    // static methods
    // ---

    pub fn tile_color_from_coord(coord: TileCoord) -> TileColor {
        if (coord.col() + coord.row()) % 2 == 0 {
            TileColor::Black
        } else {
            TileColor::White
        }
    }

    pub fn tile_idx_from_coord(coord: &TileCoord) -> usize {
        (((coord.row() * 8) + (coord.col() + 1)) - 1) as usize
    }

    // ---
    // private methods
    // ---

    fn set_tiles(&mut self, tiles: Vec<Tile>) {
        self.tiles = tiles
    }

    fn get_tile(&self, coord: &TileCoord) -> Option<&Tile> {
        let idx = Board::tile_idx_from_coord(coord);

        // ensure idx is valid, ie. on the board
        if (0..64).contains(&idx) {
            Some(&self.tiles[idx])
        } else {
            None
        }
    }

    fn get_king_coord(&self, piece_color: PieceColor) -> Option<TileCoord> {
        for tile in &self.tiles {
            if let Some(piece) = tile.piece() {
                if piece.color() == piece_color && piece.piece_type() == PieceType::King {
                    return Some(tile.coord());
                }
            }
        }
        None
    }

    fn is_promote_piece(&self) -> bool {
        // check last rank for pawn
        for tile in &self.tiles {
            if let Some(piece) = tile.piece() {
                if piece.piece_type() == PieceType::Pawn && tile.coord().rank() == TileRank::Rank8 {
                    return true;
                }
            }
        }

        // check first rank for pawn
        for tile in &self.tiles {
            if let Some(piece) = tile.piece() {
                if piece.piece_type() == PieceType::Pawn && tile.coord().rank() == TileRank::Rank1 {
                    return true;
                }
            }
        }
        false
    }
}

impl Default for Board {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct MoveResult {
    pub piece_type: PieceType,
    pub piece_color: PieceColor,
    pub from_coord: Option<TileCoord>,
    pub to_coord: Option<TileCoord>,
    pub is_take: bool,
    pub is_short_castle: bool,
    pub is_long_castle: bool,
    pub is_promote_piece: bool,
}
