use js_sys::Array;
use regex::Regex;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::{
    board::Board,
    console_log,
    pieces::{
        king::KingCastleValidator,
        piece::{PieceColor, PieceType},
        strategy::{MoveValidator, StrategyBuilder},
    },
    tile::{TileCoord, TileFile, TileRank},
};

#[wasm_bindgen]
/// A wrapper struct to read and write MoveResults
/// it creates a default instance of each MoveReader or
/// MoveWriter struct when using either of the 2 main
/// static methods
pub struct MoveParser {}

#[wasm_bindgen]
impl MoveParser {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    pub fn move_result_to_str(move_result: &MoveResult, board: &Board) -> String {
        let move_writer = MoveWriter::default();
        move_writer.write_move(move_result, board)
    }

    pub fn str_to_move_result(move_str: &str, piece_color: PieceColor) -> MoveResult {
        let move_reader = MoveReader::default();
        move_reader.parse_move(move_str, piece_color)
    }

    pub fn split_all_moves(all_moves_str: String) -> Array {
        let move_reader = MoveReader::default();
        let (white_moves, black_moves) = move_reader.split_white_black_moves(all_moves_str);

        let moves_arr = Array::new_with_length(white_moves.len() as u32);

        for (i, white_move) in white_moves.iter().enumerate() {
            let move_arr = Array::new_with_length(2_u32);
            move_arr.set(0, white_move.into());

            if let Some(black_move) = black_moves.get(i) {
                move_arr.set(1, black_move.into());
            }

            moves_arr.set(i.try_into().unwrap(), move_arr.into());
        }

        moves_arr
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct MoveResult {
    pub piece_type: PieceType,
    pub piece_color: PieceColor,
    pub from_coord: TileCoord,
    pub to_coord: TileCoord,
    pub promote_piece_type: Option<PieceType>,
    pub is_promote_piece: bool,
    pub is_take: bool,
    pub is_short_castle: bool,
    pub is_long_castle: bool,
}

#[wasm_bindgen]
impl MoveResult {
    pub fn new(
        piece_type: PieceType,
        piece_color: PieceColor,
        from_coord: TileCoord,
        to_coord: TileCoord,
        promote_piece_type: Option<PieceType>,
        is_promote_piece: bool,
        is_take: bool,
        is_short_castle: bool,
        is_long_castle: bool,
    ) -> Self {
        Self {
            piece_type,
            piece_color,
            from_coord,
            to_coord,
            is_take,
            is_short_castle,
            is_long_castle,
            promote_piece_type,
            is_promote_piece,
        }
    }

    pub fn to_json(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }

    pub fn from_json(json: JsValue) -> Self {
        serde_wasm_bindgen::from_value(json).unwrap()
    }

    pub fn set_promote_piece(&mut self, piece_type: PieceType) {
        self.promote_piece_type = Some(piece_type)
    }

    // ---
    // Accessor methods
    // ---

    // pub fn piece_color(&self) -> PieceColor {
    //     self.piece_color
    // }
    // pub fn piece_type(&self) -> PieceType {
    //     self.piece_type
    // }
    // pub fn from_coord(&self) -> TileCoord {
    //     self.from_coord
    // }
    // pub fn to_coord(&self) -> TileCoord {
    //     self.to_coord
    // }
    // pub fn promote_piece_type(&self) -> Option<PieceType> {
    //     self.promote_piece_type
    // }
    // pub fn is_promote_piece(&self) -> bool {
    //     self.is_promote_piece
    // }
    // pub fn is_take(&self) -> bool {
    //     self.is_take
    // }
    // pub fn is_short_castle(&self) -> bool {
    //     self.is_short_castle
    // }
    // pub fn is_long_castle(&self) -> bool {
    //     self.is_long_castle
    // }
}

#[wasm_bindgen]
pub struct MoveWriter {}

#[wasm_bindgen]
impl MoveWriter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }
    /// main method used to write a move to string from a move result
    /// it is the opposite of parse_move method
    pub fn write_move(&self, move_res: &MoveResult, board: &Board) -> String {
        // SAFETY
        // board is always valid pointer
        // move writer is only ever created by the board
        // return early if long castle
        if move_res.is_long_castle {
            return "0-0-0".to_string();
        };

        // return early if short castle
        if move_res.is_short_castle {
            return "0-0".to_string();
        };

        // get from_coord string
        let from_coord_str = {
            let coord = move_res.from_coord;
            let file: TileFile = coord.col().into();
            let rank: TileRank = coord.row().into();
            format!("{}{}", file, rank)
        };

        // get to_coord string
        let to_coord_str = {
            let coord = move_res.to_coord;
            let file: TileFile = coord.col().into();
            let rank: TileRank = coord.row().into();
            format!("{}{}", file, rank)
        };

        // if move result is a take add 'x' to move string
        let take_str = if move_res.is_take {
            "x".to_string()
        } else {
            "".to_string()
        };

        // get piece type string
        let piece_str = move_res.piece_type.to_string();

        // add '+' to move string if check or '#' if checkmate
        let check_or_checkmate_str = if board.is_checkmate().is_some() {
            "#".to_string()
        } else {
            self.get_check_string(move_res, board)
        };

        // return promote piece string if promote piece
        if let Some(promote_piece) = move_res.promote_piece_type {
            return format!(
                "{}{}{}={}",
                from_coord_str, take_str, to_coord_str, promote_piece
            );
        }

        format!(
            "{}{}{}{}{}",
            piece_str, from_coord_str, take_str, to_coord_str, check_or_checkmate_str
        )
    }

    fn get_check_string(&self, move_res: &MoveResult, board: &Board) -> String {
        let new_coord = move_res.to_coord;

        // get opposite piece color
        let piece_color = if move_res.piece_color == PieceColor::White {
            PieceColor::Black
        } else {
            PieceColor::White
        };

        // build new king strategy to validate king in check
        let king_strategy =
            StrategyBuilder::new_piece_strategy(PieceType::King, new_coord, piece_color, board);

        // check if king is in check
        let is_check = MoveValidator::is_check(king_strategy.as_ref(), board);

        if is_check {
            "+".to_string()
        } else {
            "".to_string()
        }
    }
}

#[wasm_bindgen]
pub struct MoveReader {}

#[wasm_bindgen]
impl MoveReader {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    /// main method to parse move string into move a result
    /// it is the opposite of write_move method
    pub fn parse_move(&self, move_str: &str, piece_color: PieceColor) -> MoveResult {
        // pub fn parse_move(&self, move_str: &str, piece_color: PieceColor, board: Board) -> MoveResult {
        // check if is take
        let is_take = move_str.contains('x');

        MoveResult {
            piece_type: self.get_piece_type(move_str),
            piece_color,
            from_coord: self.get_from_coord(move_str, piece_color),
            to_coord: self.get_to_coord(move_str, piece_color),
            promote_piece_type: self.get_promote_piece_type(move_str),
            is_promote_piece: self.get_promote_piece_type(move_str).is_some(),
            is_take,
            is_short_castle: self.is_short_castle(move_str),
            is_long_castle: self.is_long_castle(move_str),
        }
    }

    fn get_to_coord(&self, move_str: &str, piece_color: PieceColor) -> TileCoord {
        // king castle possible
        // return king coord move position if castle move
        if self.is_long_castle(move_str) {
            return KingCastleValidator::long_castle_coord(piece_color);
        }

        if self.is_short_castle(move_str) {
            return KingCastleValidator::short_castle_coord(piece_color);
        }

        // remove last char if check or checkmate
        let mut str_copy = move_str.to_string();
        if self.is_check(move_str) || self.is_checkmate(move_str) {
            str_copy.pop();
        }

        // check if string contains promote piece on end
        // remove if exists
        let str_split = str_copy.split('=').collect::<Vec<&str>>();
        let str_copy = str_split[0];

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

        TileCoord::new(to_rank.into(), to_file.into())
    }

    fn get_from_coord(&self, move_str: &str, piece_color: PieceColor) -> TileCoord {
        // return none if castle move
        // king castle possible
        // return king coord move position if castle move
        if self.is_long_castle(move_str) || self.is_short_castle(move_str) {
            KingCastleValidator::king_start_coord(piece_color);
        }

        // remove last char if check or checkmate
        let mut str_copy = move_str.to_string();
        if self.is_check(move_str) || self.is_checkmate(move_str) {
            str_copy.pop();
        }

        // get starting index based on piece type
        // if piece type is pawn then starting index is 0 otherwise it is 1
        let start_index = usize::from(self.get_piece_type(move_str) != PieceType::Pawn);

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

        TileCoord::new(from_rank.into(), from_file.into())
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

    fn get_promote_piece_type(&self, move_str: &str) -> Option<PieceType> {
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
        if move_str.split('-').count() > 2 {
            return false;
        }
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

type WhiteBlackMovesSplit = (Vec<String>, Vec<String>);

impl MoveReader {
    pub fn split_white_black_moves(&self, all_moves_str: String) -> WhiteBlackMovesSplit {
        let mut black_moves = Vec::new();
        let mut white_moves = Vec::new();

        // get each pair of moves
        let move_pairs: Vec<&str> = all_moves_str.split(',').collect();

        for move_pair in move_pairs.iter() {
            // split pair by space
            let pair_split: Vec<&str> = move_pair.split(' ').collect();

            // remove number from beginning of string
            if let Some(&white_move_str_with_num) = pair_split.first() {
                let move_num_split: Vec<&str> = white_move_str_with_num.split('.').collect();

                // insert white move
                if let Some(&white_move_str) = move_num_split.get(1) {
                    white_moves.push(white_move_str.to_string());
                }
            }

            // check if black move exists
            if let Some(&black_move_str) = pair_split.get(1) {
                // insert black move
                black_moves.push(black_move_str.to_string());
            }
        }

        (white_moves, black_moves)
    }

    fn parse_moves(&self, all_moves_str: String) -> Vec<MoveResult> {
        let (white_moves, black_moves) = self.split_white_black_moves(all_moves_str);

        let mut move_results = vec![];

        for (i, move_str) in white_moves.iter().enumerate() {
            // add result to array
            move_results.push(self.parse_move(move_str, PieceColor::White));

            // check if there is a corresponding black move to add
            if let Some(black_move_str) = black_moves.get(i) {
                move_results.push(self.parse_move(black_move_str, PieceColor::Black));
            }
        }

        move_results
    }
}

impl Default for MoveWriter {
    fn default() -> Self {
        Self::new()
    }
}

impl Default for MoveParser {
    fn default() -> Self {
        Self::new()
    }
}

impl Default for MoveReader {
    fn default() -> Self {
        Self::new()
    }
}
