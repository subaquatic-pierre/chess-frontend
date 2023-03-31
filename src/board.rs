use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::console_log;
use crate::game::GameMove;
use crate::pieces::king::{KingCastleBoardState, KingCastleMoveResult};
// use crate::console_log;
use crate::parser::{MoveReader, MoveResult, MoveWriter};
use crate::pieces::piece::{Piece, PieceColor, PieceState, PieceType};
use crate::pieces::strategy::{MoveHandler, MoveValidator, PieceMoveStrategy, StrategyBuilder};
use crate::pieces::util::get_piece_default;
use crate::tile::{Tile, TileColor, TileCoord, TileRank, TileState};

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

    // JS methods

    /// Returns JS array cloned copy of current tiles
    /// Used to render tiles from current board state
    pub fn js_tiles(&self) -> Array {
        self.tiles.clone().into_iter().map(JsValue::from).collect()
    }

    /// return JS type of the piece
    /// mainly used for debugging purpose
    pub fn js_piece(&self, coord: &TileCoord) -> JsValue {
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
    pub fn king_castle_state(&self) -> KingCastleBoardState {
        self.king_castle_state.clone()
    }

    // tile methods

    pub fn set_new_tile(
        &mut self,
        coord: &TileCoord,
        piece_type: Option<PieceType>,
        piece_color: Option<PieceColor>,
    ) {
        // create new piece
        let piece = if piece_type.is_none() || piece_color.is_none() {
            None
        } else {
            Some(Piece::new(
                piece_type.unwrap(),
                piece_color.unwrap(),
                *coord,
            ))
        };

        // get tile idx
        let tile_idx = Board::tile_idx_from_coord(&coord.clone());

        // create new tile
        let new_tile = Tile::new(*coord, tile_idx as u8, TileState::Inactive, piece);

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
        self.set_new_tile(&coord, None, None);
    }

    // piece methods

    fn new_piece_strategy(&self, piece: Piece) -> Box<dyn PieceMoveStrategy> {
        StrategyBuilder::new_piece_strategy(piece.piece_type(), piece.coord(), piece.color(), self)
    }

    /// main public method used to get move result without updating board,
    /// updates board with new pieces
    pub fn pre_move_result(
        &mut self,
        old_coord: TileCoord,
        new_coord: TileCoord,
    ) -> Option<MoveResult> {
        // do not ignore check on main method to move pieces
        // board is NOT updated with new pieces after this method
        self.handle_move_piece(old_coord, new_coord, false, false)
    }

    /// main public method used to move pieces,
    /// updates board with new pieces
    pub fn move_piece(&mut self, old_coord: TileCoord, new_coord: TileCoord) -> Option<MoveResult> {
        // do not ignore check on main method to move pieces
        // board is updated with new pieces after this method
        let result = self.handle_move_piece(old_coord, new_coord, false, true);

        // update king castle state after move is completed
        self.king_castle_state.update_state(&*self);

        result
    }

    /// method used to move piece ignoring if king is in check
    /// used to check if possible to move in/out of check
    pub fn move_piece_ignore_check(&mut self, old_row: u8, old_col: u8, new_row: u8, new_col: u8) {
        let old_coord: TileCoord = TileCoord::new(old_row, old_col);
        let new_coord: TileCoord = TileCoord::new(new_row, new_col);
        // ignore check flag active
        // method used to check if king is in check
        self.handle_move_piece(old_coord, new_coord, true, true);
    }

    /// used as base move command to move pieces
    /// ignore check flag is used to perform all move operations
    /// ignoring if king is in check
    /// ignore flag is useful in validating moving into/out of check
    fn handle_move_piece(
        &mut self,
        old_coord: TileCoord,
        new_coord: TileCoord,
        ignore_check: bool,
        update_board: bool,
    ) -> Option<MoveResult> {
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

        // check if piece take
        let is_take = move_validator.is_take()
            | move_validator.is_en_passant_take(&piece_strategy.moves(), piece_strategy.as_ref());

        // check if king take
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
                self.set_new_tile(&last_en_passant_coord, None, None);
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

        let is_promote_piece = self.is_promote_piece(new_coord, piece.piece_type(), piece.color());

        // return early if NOT updated_board flag
        // used to validate if king in check or checkmate
        // or able to move out of check or checkmate
        if !update_board {
            let enemy_piece_color = PieceColor::opposite_color(piece_strategy.color());
            // make move to see if possible check or checkmate
            let mut board_copy = self.clone();
            board_copy.move_piece(old_coord, new_coord);

            return Some(MoveResult {
                piece_type: piece_strategy.piece_type(),
                piece_color: piece_strategy.color(),
                from_coord: old_coord,
                to_coord: new_coord,
                promote_piece_type: None,
                is_promote_piece,
                is_take,
                is_short_castle: king_castle_result == Some(KingCastleMoveResult::ShortCastle),
                is_long_castle: king_castle_result == Some(KingCastleMoveResult::LongCastle),
                is_check: MoveValidator::is_check(enemy_piece_color, &board_copy),
                is_checkmate: MoveValidator::is_checkmate(enemy_piece_color, &board_copy),
                is_from_remote: false,
            });
        }

        // only clear tiles if not king take, ie. cannot take king off board
        // update board
        if !is_king_take {
            // clear old tile
            self.clear_tile(old_coord.row(), old_coord.col());

            // set new tile
            self.set_new_tile(&new_coord, Some(piece.piece_type()), Some(piece.color()));

            console_log!("new_coord: {}", new_coord);

            return Some(MoveResult {
                piece_type: piece_strategy.piece_type(),
                piece_color: piece_strategy.color(),
                from_coord: old_coord,
                to_coord: new_coord,
                promote_piece_type: None,
                is_promote_piece,
                is_take,
                is_short_castle: king_castle_result == Some(KingCastleMoveResult::ShortCastle),
                is_long_castle: king_castle_result == Some(KingCastleMoveResult::LongCastle),
                // always false, can never move into check or checkmate
                is_check: false,
                is_checkmate: false,
                is_from_remote: false,
            });
        }

        // if no piece is moved
        // return None
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
        // check each color if is in checkmate
        for piece_color in [PieceColor::White, PieceColor::Black] {
            // SAFETY:
            // there is always a king on the board
            let king_coord = self.get_king_coord(piece_color);
            let king = self.get_piece(&king_coord).unwrap();

            let piece_strategy = self.new_piece_strategy(king);

            if MoveValidator::is_checkmate(piece_strategy.color(), self) {
                return Some(piece_color);
            }
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

    fn get_king_coord(&self, piece_color: PieceColor) -> TileCoord {
        for tile in &self.tiles {
            if let Some(piece) = tile.piece() {
                if piece.color() == piece_color && piece.piece_type() == PieceType::King {
                    return tile.coord();
                }
            }
        }

        // NOTE:
        // this is never reached
        // there is always a king on the board
        TileCoord::new(1, 1)
    }

    fn is_promote_piece(
        &self,
        new_coord: TileCoord,
        piece_type: PieceType,
        piece_color: PieceColor,
    ) -> bool {
        // check white pawn promote
        if piece_type == PieceType::Pawn
            && piece_color == PieceColor::White
            && new_coord.rank() == TileRank::Rank8
        {
            return true;
        }

        // check black pawn promote
        if piece_type == PieceType::Pawn
            && piece_color == PieceColor::Black
            && new_coord.rank() == TileRank::Rank1
        {
            return true;
        }

        false
    }
}

impl Default for Board {
    fn default() -> Self {
        Self::new()
    }
}
