use regex::Regex;
use wasm_bindgen::prelude::*;

use crate::{
    board::{Board, MoveResult},
    game::Moves,
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
    pub fn write_move(&self, move_res: MoveResult, promote_piece: Option<PieceType>) -> String {
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
        if let Some(promote_piece) = promote_piece {
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
pub struct MoveReader {}

impl MoveReader {
    pub fn new() -> Self {
        Self {}
    }
    /// main method to parse move string into move a result
    /// it is the opposite of write_move method
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
            is_promote_piece: false,
        }
    }

    pub fn parse_moves(&self, all_moves_str: String) -> Moves {
        let mut moves = Moves::default();

        // get each pair of moves
        let move_pair: Vec<&str> = all_moves_str.split(',').collect();

        // get white and black moves from pair
        move_pair.iter().for_each(|&pair| {
            let move_split: Vec<&str> = pair.split(' ').collect();
            let white_move_str = move_split
                .first()
                .unwrap()
                .to_owned()
                .split('.')
                .collect::<Vec<&str>>()
                .get(1)
                .unwrap()
                .to_owned();

            moves.insert(white_move_str.to_string(), PieceColor::White);

            let black_move_str = move_split
                .get(1)
                .unwrap()
                .to_owned()
                .split('.')
                .collect::<Vec<&str>>()
                .get(1)
                .unwrap()
                .to_owned();

            moves.insert(black_move_str.to_string(), PieceColor::White);

            if move_split.len() == 2 {
            } else {
                let white_move_str = move_split
                    .first()
                    .unwrap()
                    .to_owned()
                    .split('.')
                    .collect::<Vec<&str>>()
                    .get(1)
                    .unwrap()
                    .to_owned();

                moves.insert(white_move_str.to_string(), PieceColor::White);
            }
        });

        moves
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

impl Default for MoveReader {
    fn default() -> Self {
        Self::new()
    }
}
