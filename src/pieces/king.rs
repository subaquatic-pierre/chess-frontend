// use crate::console_log;
use serde::{Deserialize, Serialize};

use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::rook::RookFile;
use crate::pieces::strategy::PieceMoveStrategy;
use crate::tile::TileCoord;

pub struct KingMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *const Board,
}

impl PieceMoveStrategy for KingMoveStrategy {
    fn tiles_between(&self, _new_coord: TileCoord) -> Vec<TileCoord> {
        vec![]
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
    white_king: KingCastleState,
    black_king: KingCastleState,
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

    pub fn update_state(&mut self, board: *const Board, piece_color: PieceColor) {}

    // ---
    // private methods
    // ---

    fn handle_white_king_state(&self) {}

    fn handle_black_king_state(&self) {}

    fn is_king_moved(&self, piece_color: PieceColor) -> bool {
        true
    }

    fn is_rook_moved(&self, rook_file: RookFile, piece_color: PieceColor) -> bool {
        true
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct KingCastleState {
    is_king_moved: bool,
    a_file_rook_moved: bool,
    h_file_rook_moved: bool,
}

impl KingCastleState {
    pub fn new() -> Self {
        Self {
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

pub struct KingCastleMoveResult {
    is_possible_move: bool,
    new_king_coord: Option<TileCoord>,
    new_rook_coord: Option<TileCoord>,
}

pub struct KingCastleValidator {
    new_coord: TileCoord,
    piece_color: PieceColor,
    king_castle_state: KingCastleState,
}

impl KingCastleValidator {
    pub fn new(
        new_coord: TileCoord,
        piece_color: PieceColor,
        king_castle_state: KingCastleState,
    ) -> Self {
        Self {
            new_coord,
            piece_color,
            king_castle_state,
        }
    }

    pub fn validate_king_castle_moved(&self) -> KingCastleMoveResult {
        KingCastleMoveResult {
            is_possible_move: false,
            new_king_coord: None,
            new_rook_coord: None,
        }
    }
}
