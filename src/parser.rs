use js_sys::Array;
use regex::Regex;
use wasm_bindgen::prelude::*;

use crate::{
    board::{Board, MoveResult},
    game::MovesStr,
    pieces::{
        piece::{PieceColor, PieceType},
        strategy::{MoveValidator, StrategyBuilder},
    },
    tile::{TileCoord, TileFile, TileRank},
};

#[wasm_bindgen]
pub struct MoveWriter {
    board: *const Board,
}

impl MoveWriter {
    /// NOTE
    /// Move writer should only be instantiated from
    /// within the Board.move_writer() method
    pub fn new(board: &Board) -> Self {
        Self { board }
    }
}

#[wasm_bindgen]
impl MoveWriter {
    /// main method used to write a move to string from a move result
    /// it is the opposite of parse_move method
    pub fn write_move(&self, move_res: MoveResult) -> String {
        // SAFETY
        // board is always valid pointer
        // move writer is only ever created by the board
        let board = unsafe { self.board.as_ref().unwrap() };
        // return early if long castle
        if move_res.is_long_castle {
            return "0-0-0".to_string();
        };

        // return early if short castle
        if move_res.is_short_castle {
            return "0-0".to_string();
        };

        // get from coord string if exists
        let from_coord_str = match move_res.from_coord {
            Some(coord) => {
                let file: TileFile = coord.col().into();
                let rank: TileRank = coord.row().into();
                format!("{}{}", file, rank)
            }
            _ => "".to_string(),
        };

        // get to coord string if exists
        let to_coord_str = match move_res.to_coord {
            Some(coord) => {
                let file: TileFile = coord.col().into();
                let rank: TileRank = coord.row().into();
                format!("{}{}", file, rank)
            }
            _ => "".to_string(),
        };

        // if move result is a take add 'x' to move string
        let take_str = if move_res.is_take {
            "x".to_string()
        } else {
            "".to_string()
        };

        // get piece type string
        let piece_str = move_res.piece_type.to_string();

        let move_validator: Option<MoveValidator> = move_res
            .to_coord
            .map(|coord| MoveValidator::new(coord, board));

        // add '+' to move string if check or '#' if checkmate
        let check_or_checkmate_str = if board.is_checkmate().is_some() {
            "#".to_string()
        } else if move_validator.is_some() {
            let new_coord = move_res.to_coord.unwrap();

            // get opposite piece color
            let piece_color = if move_res.piece_color == PieceColor::White {
                PieceColor::Black
            } else {
                PieceColor::White
            };

            // build new king strategy to validate king in check
            let king_strategy = StrategyBuilder::new_piece_strategy(
                PieceType::King,
                new_coord,
                piece_color,
                self.board,
            );

            // check if king is in check
            let is_check = MoveValidator::is_check(king_strategy.as_ref(), board);

            if is_check {
                "+".to_string()
            } else {
                "".to_string()
            }
        } else {
            "".to_string()
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
}

#[wasm_bindgen]
pub struct MoveReader {
    board: *const Board,
}

impl MoveReader {
    /// NOTE
    /// Move reader should only be instantiated from
    /// within the Board.move_reader() method
    pub fn new(board: &Board) -> Self {
        Self { board }
    }
}

#[wasm_bindgen]
impl MoveReader {
    /// main method to parse move string into move a result
    /// it is the opposite of write_move method
    pub fn parse_move(&self, move_str: &str, piece_color: Option<PieceColor>) -> MoveResult {
        // check if is take
        let is_take = move_str.contains('x');

        let piece_color = match piece_color {
            Some(color) => color,
            _ => self.get_piece_color(move_str),
        };

        let board = unsafe { self.board.as_ref().unwrap().clone() };

        MoveResult::new(
            self.get_piece_type(move_str),
            piece_color,
            self.get_from_coord(move_str),
            self.get_to_coord(move_str),
            self.get_promote_piece_type(move_str),
            self.get_promote_piece_type(move_str).is_some(),
            self.is_short_castle(move_str),
            self.is_long_castle(move_str),
            is_take,
            board,
        )
    }

    pub fn parse_moves_to_js_arr(&self, all_moves_str: String) -> Array {
        // let moves_str = self.parse_moves_to_str(all_moves_str);

        // let white_moves = moves_str.white_moves();
        // let black_moves = moves_str.black_moves();

        // let mut all_moves = vec![];

        // for (i, move_str) in white_moves.iter().enumerate() {
        //     // add result to array
        //     all_moves.push(self.parse_move(&move_str.str, Some(PieceColor::White)));

        //     // check if there is a corresponding black move to add
        //     if let Some(black_move_str) = black_moves.get(i) {
        //         all_moves.push(self.parse_move(&black_move_str.str, Some(PieceColor::Black)))
        //     }
        //     // if let Some(str) = black_move_str.as_string() {};
        // }

        let all_moves = self.parse_moves(all_moves_str);

        let arr = Array::new_with_length(all_moves.len() as u32);

        for (i, _) in all_moves.iter().enumerate() {
            let move_res = &all_moves[i];
            arr.set(i as u32, move_res.to_json());
        }

        arr
    }

    pub fn parse_moves_to_str(&self, all_moves_str: String) -> MovesStr {
        let mut moves = MovesStr::default();

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
                    moves.insert(white_move_str.to_string(), PieceColor::White);
                }
            }

            // check if black move exists
            if let Some(&black_move_str) = pair_split.get(1) {
                // insert black move
                moves.insert(black_move_str.to_string(), PieceColor::Black);
            }
        }

        moves
    }

    // ---
    // private methods
    // ---

    fn get_piece_color(&self, move_str: &str) -> PieceColor {
        if let Some(from_coord) = self.get_from_coord(move_str) {
            let board = unsafe { self.board.as_ref().unwrap() };
            if let Some(piece) = board.peek_tile(&from_coord) {
                piece.color()
            } else {
                PieceColor::White
            }
        } else {
            PieceColor::White
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

    pub fn get_promote_piece_type(&self, move_str: &str) -> Option<PieceType> {
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

impl MoveReader {
    fn parse_moves(&self, all_moves_str: String) -> Vec<MoveResult> {
        let moves_str = self.parse_moves_to_str(all_moves_str);

        let white_moves = moves_str.white_moves();
        let black_moves = moves_str.black_moves();

        let mut move_results = vec![];

        for (i, move_str) in white_moves.iter().enumerate() {
            // add result to array
            move_results.push(self.parse_move(&move_str.str, Some(PieceColor::White)));

            // check if there is a corresponding black move to add
            if let Some(black_move_str) = black_moves.get(i) {
                move_results.push(self.parse_move(&black_move_str.str, Some(PieceColor::Black)));
            }
        }

        move_results
    }
}
