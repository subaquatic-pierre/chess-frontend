use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// use crate::console_log;
use crate::pieces::piece::{Piece, PieceColor, PieceState, PieceType};
use crate::pieces::strategy::{MoveStrategy, MoveValidator, PieceMoveStrategy, StrategyBuilder};
use crate::pieces::util::get_piece_default;
use crate::tile::{Tile, TileColor, TileCoord, TileState};

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Board {
    tiles: Vec<Tile>,
    board_direction: BoardDirection,
    last_en_passant: Option<TileCoord>,
}

#[wasm_bindgen]
impl Board {
    pub fn new() -> Self {
        let mut tiles = Vec::new();

        let mut board = Self {
            tiles: vec![],
            board_direction: BoardDirection::White,
            last_en_passant: None,
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

    /// Returns JS array cloned copy of current tiles
    /// Used to render tiles from current board state
    pub fn tiles(&mut self) -> Array {
        self.tiles.clone().into_iter().map(JsValue::from).collect()
    }

    pub fn board_direction(&self) -> BoardDirection {
        self.board_direction
    }

    pub fn set_board_direction(&mut self, direction: BoardDirection) {
        self.board_direction = direction
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
            if tile.state() == TileState::Active {
                tile.set_state(TileState::Inactive)
            }
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
            let piece_strategy = self.new_piece_strategy(piece, coord);

            for tile in piece_strategy.moves() {
                if tile.in_bounds() {
                    let new_coord = TileCoord::new(tile.row(), tile.col());

                    // new validator
                    let validator = MoveValidator::new(new_coord, self);

                    // validate move
                    if validator.is_valid_move(piece_strategy.as_ref()) {
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

    fn new_piece_strategy(&mut self, piece: Piece, coord: TileCoord) -> Box<dyn PieceMoveStrategy> {
        StrategyBuilder::new_piece_strategy(piece.piece_type(), coord, piece.color(), &mut *self)
    }

    pub fn move_piece(&mut self, old_row: u8, old_col: u8, new_row: u8, new_col: u8) {
        let old_coord: TileCoord = TileCoord::new(old_row, old_col);
        let new_coord: TileCoord = TileCoord::new(new_row, new_col);
        // get old tile
        let tile = self.get_tile(&old_coord);

        // handle empty tile case
        if tile.is_none() {
            return;
        };

        // handle empty piece case
        let piece = tile.unwrap().piece();
        if piece.is_none() {
            return;
        }

        // SAFETY:
        // can safely unwrap piece
        // both None tile and None piece case is handled above
        let piece = tile.unwrap().piece().unwrap();

        // create new piece strategy based on piece type
        let piece_strategy = self.new_piece_strategy(piece.clone(), old_coord);

        // validate move
        let mut move_strategy = MoveStrategy::new(new_coord, self);

        let valid_move = move_strategy.validate_move(piece_strategy.as_ref());

        // only continue if move is valid
        if !valid_move.is_valid {
            return;
        }

        // if en passant take clear en passant coord
        if let Some(en_passant_coord) = valid_move.en_passant_clear_coord {
            self.set_new_tile(en_passant_coord, None, None);
            // clear last en passant
            self.set_last_en_passant(None);
        }

        // clear old tile
        self.set_new_tile(old_coord, None, None);

        // set new tile
        self.set_new_tile(new_coord, Some(piece.piece_type()), Some(piece.color()));

        // TODO:
        // write move to game
        // ...

        // TODO:
        // update players pieces
        // ...
    }

    pub fn get_js_piece(&mut self, coord: &TileCoord) -> JsValue {
        let tile = self.get_tile(coord);
        match tile {
            Some(tile) => match tile.piece() {
                Some(piece) => piece.to_json(),
                None => false.into(),
            },
            None => false.into(),
        }
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
}

#[wasm_bindgen]
#[derive(Clone, Copy, Serialize, Deserialize, Debug)]
pub enum BoardDirection {
    White,
    Black,
}

impl Default for Board {
    fn default() -> Self {
        Self::new()
    }
}
