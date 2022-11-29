use regex::Regex;
use wasm_bindgen::prelude::*;

use crate::{
    board::{Board, MoveResult},
    pieces::piece::{Piece, PieceColor, PieceType},
    tile::{TileCoord, TileFile, TileRank},
};

#[wasm_bindgen]
pub struct MoveWriter {
    board: *const Board,
}

#[wasm_bindgen]
impl MoveWriter {
    pub fn new(board: *const Board) -> Self {
        Self { board }
    }

    pub fn write_move(&self) -> String {
        "hello".to_string()
    }

    pub fn get_piece_at(&self, row: u8, col: u8) -> Option<Piece> {
        let board = unsafe { self.board.as_ref().unwrap() };

        board.peek_tile(&TileCoord::new(row, col))
    }
    pub fn get_js_piece(&self, row: u8, col: u8) -> JsValue {
        let board = unsafe { self.board.as_ref().unwrap() };

        board.get_js_piece(&TileCoord::new(row, col))
    }
}

#[wasm_bindgen]
impl MoveResult {
    pub fn to_json(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }
}

#[wasm_bindgen]
pub struct MoveParser {}

#[wasm_bindgen]
impl MoveParser {
    pub fn new() -> Self {
        Self {}
    }

    pub fn parse_move(&self, move_str: &str) -> MoveResult {
        // check if is take
        let is_take = move_str.contains('x');

        MoveResult {
            piece_type: self.get_piece_type(move_str),
            piece_color: PieceColor::White,
            from_coord: self.get_from_coord(move_str),
            to_coord: self.get_to_coord(move_str),
            is_short_castle: self.is_short_castle(move_str),
            is_long_castle: self.is_long_castle(move_str),
            is_take,
        }
    }

    fn get_to_coord(&self, move_str: &str) -> Option<TileCoord> {
        // return none if castle move
        if self.is_long_castle(move_str) || self.is_short_castle(move_str) {
            return None;
        }

        // remove last char if check or checkmate
        let mut str_copy = move_str.to_string();

        if self.is_check(move_str) || self.is_checkmate(move_str) {
            str_copy.pop();
        }

        // get to_coord
        let to_rank: TileRank = if let Some(rank_char) = str_copy.chars().rev().next() {
            rank_char.into()
        } else {
            TileRank::Unknown
        };
        let to_file = if let Some(file_char) = str_copy.chars().rev().nth(1) {
            file_char.into()
        } else {
            TileFile::Unknown
        };

        // return None if coord is unknown
        if to_file != TileFile::Unknown && to_rank != TileRank::Unknown {
            Some(TileCoord::new(to_rank.into(), to_file.into()))
        } else {
            None
        }
    }

    fn get_from_coord(&self, move_str: &str) -> Option<TileCoord> {
        // return none if castle move
        if self.is_long_castle(move_str) || self.is_short_castle(move_str) {
            return None;
        }

        // remove last char if check or checkmate
        let mut str_copy = move_str.to_string();

        if self.is_check(move_str) || self.is_checkmate(move_str) {
            str_copy.pop();
        }

        let start_index = if self.get_piece_type(move_str) == PieceType::Pawn {
            0_usize
        } else {
            1_usize
        };

        // get from coord
        let from_file = if let Some(file_char) = move_str.chars().nth(start_index) {
            file_char.into()
        } else {
            TileFile::Unknown
        };
        let from_rank = if let Some(rank_char) = move_str.chars().nth(start_index + 1) {
            rank_char.into()
        } else {
            TileRank::Unknown
        };

        // return None if coord is unknown
        if from_file != TileFile::Unknown && from_rank != TileRank::Unknown {
            Some(TileCoord::new(from_rank.into(), from_file.into()))
        } else {
            None
        }
    }

    fn get_piece_type(&self, move_str: &str) -> PieceType {
        // get piece type
        let piece_type = if let Some(piece_char) = move_str.chars().next() {
            if piece_char.is_uppercase() {
                piece_char.into()
            } else {
                PieceType::Pawn
            }
        } else {
            PieceType::Pawn
        };

        piece_type
    }

    pub fn get_piece_promote(&self, move_str: &str) -> Option<PieceType> {
        if move_str.contains('=') {
            if self.is_check(move_str) || self.is_checkmate(move_str) {
                // remove last char if check or checkmate
                let mut str_copy = move_str.to_string();
                str_copy.pop();
                return Some(str_copy.chars().last().unwrap().into());
            }
            return Some(move_str.chars().last().unwrap().into());
        } else {
            None
        }
    }

    fn is_long_castle(&self, move_str: &str) -> bool {
        // is long castle
        let re = Regex::new(r"0-0-0").unwrap();
        re.is_match(move_str)
    }

    fn is_short_castle(&self, move_str: &str) -> bool {
        // is short castle
        let re = Regex::new(r"0-0").unwrap();
        re.is_match(move_str)
    }

    fn is_check(&self, move_str: &str) -> bool {
        // is king in check
        move_str.ends_with('+')
    }

    fn is_checkmate(&self, move_str: &str) -> bool {
        // is checkmate
        move_str.ends_with('#')
    }
}

impl Default for MoveParser {
    fn default() -> Self {
        Self::new()
    }
}
