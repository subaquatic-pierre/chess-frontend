// use crate::console_log;
use crate::console_log;
use serde::{Deserialize, Serialize};

use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::rook::RookFile;
use crate::pieces::strategy::{MoveHandler, MoveValidator, PieceMoveStrategy, StrategyBuilder};
use crate::tile::TileCoord;

pub struct KingMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *const Board,
}

impl PieceMoveStrategy for KingMoveStrategy {
    fn tiles_between(&self, new_coord: TileCoord) -> Vec<TileCoord> {
        let mut tiles: Vec<TileCoord> = vec![];

        match self.color {
            // white king
            PieceColor::White => {
                // long castle
                if new_coord.col() == 1 {
                    tiles.push(TileCoord::new(0, 2));
                    tiles.push(TileCoord::new(0, 3));
                }

                // short castle
                if new_coord.col() == 6 {
                    tiles.push(TileCoord::new(0, 5));
                }
            }

            // black king
            PieceColor::Black => {
                // long castle
                if new_coord.col() == 1 {
                    tiles.push(TileCoord::new(7, 2));
                    tiles.push(TileCoord::new(7, 3));
                }

                // short castle
                if new_coord.col() == 6 {
                    tiles.push(TileCoord::new(7, 5));
                }
            }
        }

        tiles
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut moves_vec = vec![];
        let (row, col) = self.row_col();

        let move_1 = TileCoord::new(row - 1, col);
        let move_2 = TileCoord::new(row + 1, col);
        let move_3 = TileCoord::new(row, col + 1);
        let move_4 = TileCoord::new(row, col - 1);

        let move_5 = TileCoord::new(row - 1, col + 1);
        let move_6 = TileCoord::new(row + 1, col - 1);
        let move_7 = TileCoord::new(row - 1, col - 1);
        let move_8 = TileCoord::new(row + 1, col + 1);

        if move_1.in_bounds() {
            moves_vec.push(move_1)
        }
        if move_2.in_bounds() {
            moves_vec.push(move_2)
        }
        if move_3.in_bounds() {
            moves_vec.push(move_3)
        }
        if move_4.in_bounds() {
            moves_vec.push(move_4)
        }
        if move_5.in_bounds() {
            moves_vec.push(move_5)
        }
        if move_6.in_bounds() {
            moves_vec.push(move_6)
        }
        if move_7.in_bounds() {
            moves_vec.push(move_7)
        }
        if move_8.in_bounds() {
            moves_vec.push(move_8)
        }

        // add king castle moves
        match self.color {
            PieceColor::White => {
                if self.coord.row() == 0 && self.coord.col() == 4 {
                    moves_vec.push(TileCoord::new(0, 1));
                    moves_vec.push(TileCoord::new(0, 6));
                }
            }
            PieceColor::Black => {
                if self.coord.row() == 7 && self.coord.col() == 4 {
                    moves_vec.push(TileCoord::new(7, 1));
                    moves_vec.push(TileCoord::new(7, 6));
                }
            }
        }

        moves_vec
    }

    fn coord(&self) -> TileCoord {
        self.coord
    }

    fn piece_type(&self) -> PieceType {
        self.piece_type
    }

    fn color(&self) -> PieceColor {
        self.color
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct KingCastleBoardState {
    pub white_king: KingCastleState,
    pub black_king: KingCastleState,
}

impl Default for KingCastleBoardState {
    fn default() -> Self {
        Self::new()
    }
}

impl KingCastleBoardState {
    pub fn new() -> Self {
        Self {
            white_king: KingCastleState::default(),
            black_king: KingCastleState::default(),
        }
    }

    pub fn update_state(&mut self, board: *const Board) {
        // SAFETY:
        // this struct is only ever used from within the board
        // struct, the board is always valid withing itself
        // the board always has 68 valid tiles from which to reference
        let board = unsafe { board.as_ref().unwrap() };

        for color in [PieceColor::White, PieceColor::Black] {
            let mut king = if color == PieceColor::White {
                &mut self.white_king
            } else {
                &mut self.black_king
            };

            if KingCastleBoardState::is_king_moved(color, board) {
                king.is_king_moved = true
            }

            // check a rook
            if KingCastleBoardState::is_rook_moved(RookFile::AFile, color, board) {
                king.a_file_rook_moved = true
            }

            // check h rook
            if KingCastleBoardState::is_rook_moved(RookFile::HFile, color, board) {
                king.h_file_rook_moved = true
            }

            if KingCastleBoardState::is_king_check(color, board) {
                king.is_in_check = true
            } else {
                king.is_in_check = false
            }
        }
    }

    // ---
    // Static Methods
    // ---

    fn is_king_moved(piece_color: PieceColor, board: &Board) -> bool {
        match piece_color {
            // check white king coord
            PieceColor::White => {
                if board.peek_tile(&TileCoord::new(0, 4)).is_none() {
                    return true;
                }
            }

            // check black king coord
            PieceColor::Black => {
                if board.peek_tile(&TileCoord::new(7, 4)).is_none() {
                    return true;
                }
            }
        }

        // return king not moved if none of above cases
        false
    }

    fn is_rook_moved(rook_file: RookFile, piece_color: PieceColor, board: &Board) -> bool {
        match piece_color {
            PieceColor::White => {
                // get rook coord
                let coord = match rook_file {
                    RookFile::AFile => TileCoord::new(0, 0),
                    RookFile::HFile => TileCoord::new(0, 7),
                };

                //rook moved
                if board.peek_tile(&coord).is_none() {
                    return true;
                }

                // rook taken
                if let Some(piece) = board.peek_tile(&coord) {
                    if piece.color() != piece_color {
                        return true;
                    }
                }
            }

            PieceColor::Black => {
                // get rook coord
                let coord = match rook_file {
                    RookFile::AFile => TileCoord::new(7, 0),
                    RookFile::HFile => TileCoord::new(7, 7),
                };

                //rook moved
                if board.peek_tile(&coord).is_none() {
                    return true;
                }

                // rook taken
                if let Some(piece) = board.peek_tile(&coord) {
                    if piece.color() != piece_color {
                        return true;
                    }
                }
            }
        }

        // return rook not moved if none of above cases
        false
    }

    fn is_king_check(piece_color: PieceColor, board: &Board) -> bool {
        let king_coord = if piece_color == PieceColor::White {
            TileCoord::new(0, 4)
        } else {
            TileCoord::new(7, 4)
        };

        let strategy =
            StrategyBuilder::new_piece_strategy(PieceType::King, king_coord, piece_color, board);

        if MoveValidator::is_check(strategy.as_ref(), board) {
            return true;
        }

        false
    }
}

#[derive(PartialEq, Eq, PartialOrd, Ord)]
pub enum KingCastleMoveResult {
    ShortCastle,
    LongCastle,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct KingCastleState {
    pub is_king_moved: bool,
    pub is_in_check: bool,
    pub a_file_rook_moved: bool,
    pub h_file_rook_moved: bool,
}

impl KingCastleState {
    pub fn new() -> Self {
        Self {
            is_in_check: false,
            is_king_moved: false,
            a_file_rook_moved: false,
            h_file_rook_moved: false,
        }
    }
}

impl Default for KingCastleState {
    fn default() -> Self {
        Self::new()
    }
}

pub struct KingCastleValidator {}

impl KingCastleValidator {
    pub fn long_castle_coord(piece_color: PieceColor) -> TileCoord {
        match piece_color {
            PieceColor::White => TileCoord::new(0, 1),
            PieceColor::Black => TileCoord::new(7, 1),
        }
    }

    pub fn short_castle_coord(piece_color: PieceColor) -> TileCoord {
        match piece_color {
            PieceColor::White => TileCoord::new(0, 6),
            PieceColor::Black => TileCoord::new(7, 6),
        }
    }
}
