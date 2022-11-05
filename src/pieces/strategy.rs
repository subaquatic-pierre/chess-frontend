use std::collections::HashSet;
use wasm_bindgen::prelude::*;

use crate::board::Board;
// use crate::console_log;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::tile::TileCoord;

use crate::pieces::bishop::BishopMoveStrategy;
use crate::pieces::king::KingMoveStrategy;
use crate::pieces::knight::KnightMoveStrategy;
use crate::pieces::pawn::PawnMoveStrategy;
use crate::pieces::queen::QueenMoveStrategy;
use crate::pieces::rook::RookMoveStrategy;

pub struct MoveStrategy<'a> {
    new_coord: TileCoord,
    board: &'a mut Board,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct ValidMove {
    pub is_take: bool,
    pub is_valid: bool,
    pub en_passant_clear_coord: Option<TileCoord>,
}

impl<'a> MoveStrategy<'a> {
    pub fn new(new_coord: TileCoord, board: &'a mut Board) -> Self {
        Self { new_coord, board }
    }

    pub fn validate_move(&mut self, piece_strategy: &dyn PieceMoveStrategy) -> ValidMove {
        // get possible piece moves based on piece_strategy
        let possible_moves = piece_strategy.moves();
        // check if new_coord contains enemy piece
        let is_take = self.is_take();

        // cannot take king off board
        if let Some(invalid_move) = self.check_king_take() {
            return invalid_move;
        }

        // check if trying to move to same square as current
        if let Some(invalid_move) = self.check_same_coord(piece_strategy) {
            return invalid_move;
        }

        // check if own piece take
        if let Some(invalid_move) = self.check_own_piece_take(piece_strategy) {
            return invalid_move;
        }

        // check if can take en passant
        if let Some(invalid_move) = self.check_en_passant_take(&possible_moves, piece_strategy) {
            return invalid_move;
        }

        // check if piece between cur_coord and new_coord
        if let Some(invalid_move) = self.check_blocking_piece(&possible_moves, piece_strategy) {
            return invalid_move;
        }

        // TODO
        // check king in check

        // handle rest piece moves
        if possible_moves.contains(&self.new_coord) {
            if let Some(valid_move) = piece_strategy.handle_move(&self.new_coord, is_take) {
                return valid_move;
            }
        }

        ValidMove {
            is_take,
            is_valid: false,
            en_passant_clear_coord: None,
        }
    }

    /// check if piece at new coord
    fn is_take(&self) -> bool {
        self.board.get_piece(&self.new_coord).is_some()
    }

    /// check if trying to take king
    /// cannot take king off the board
    fn check_king_take(&self) -> Option<ValidMove> {
        let new_piece_at_coord = self.board.peek_tile(&self.new_coord);
        match new_piece_at_coord {
            Some(piece) => {
                if piece.piece_type() == PieceType::King {
                    return Some(ValidMove {
                        is_take: false,
                        is_valid: false,
                        en_passant_clear_coord: None,
                    });
                }
            }
            None => (),
        }
        None
    }

    /// check if own piece at new coord
    /// cannot take own piece space
    fn check_own_piece_take(&self, piece_strategy: &dyn PieceMoveStrategy) -> Option<ValidMove> {
        let new_piece_at_coord = self.board.peek_tile(&self.new_coord);
        match new_piece_at_coord {
            Some(piece) => {
                if piece.color() == piece_strategy.color() {
                    return Some(ValidMove {
                        is_take: false,
                        is_valid: false,
                        en_passant_clear_coord: None,
                    });
                }
            }
            None => (),
        }
        None
    }

    /// check if pawn can take with en passant move
    fn check_en_passant_take(
        &self,
        possible_moves: &[TileCoord],
        piece_strategy: &dyn PieceMoveStrategy,
    ) -> Option<ValidMove> {
        if possible_moves.contains(&self.new_coord)
            && piece_strategy.piece_type() == PieceType::Pawn
            && PawnMoveStrategy::is_en_passant_take(
                piece_strategy.coord(),
                piece_strategy.color(),
                self.new_coord,
                self.board.last_en_passant(),
            )
        {
            return Some(ValidMove {
                is_take: true,
                is_valid: true,
                en_passant_clear_coord: self.board.last_en_passant(),
            });
        }
        None
    }

    /// check if piece between cur_coord and new_coord
    /// return invalid move if piece exists
    /// Exception is PieceType::Knight
    fn check_blocking_piece(
        &self,
        possible_moves: &[TileCoord],
        piece_strategy: &dyn PieceMoveStrategy,
    ) -> Option<ValidMove> {
        if possible_moves.contains(&self.new_coord)
            && piece_strategy.piece_type() != PieceType::Knight
        {
            let tiles_between = piece_strategy.tiles_between(self.new_coord);

            for tile_coord in tiles_between {
                if self.board.peek_tile(&tile_coord).is_some() {
                    return Some(ValidMove {
                        is_take: false,
                        is_valid: false,
                        en_passant_clear_coord: None,
                    });
                }
            }
        }
        None
    }

    fn check_same_coord(&self, piece_strategy: &dyn PieceMoveStrategy) -> Option<ValidMove> {
        if piece_strategy.coord() == self.new_coord {
            return Some(ValidMove {
                is_take: self.is_take(),
                is_valid: false,
                en_passant_clear_coord: None,
            });
        }
        None
    }

    // ---
    // static methods
    // ---

    pub fn new_piece_strategy(
        piece_type: PieceType,
        coord: TileCoord,
        piece_color: PieceColor,
        board: *mut Board,
    ) -> Box<dyn PieceMoveStrategy> {
        // TODO:
        // check is king is in check
        match piece_type {
            PieceType::Pawn => Box::new(PawnMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
            PieceType::Rook => Box::new(RookMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
            PieceType::Bishop => Box::new(BishopMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
            PieceType::Knight => Box::new(KnightMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
            PieceType::King => Box::new(KingMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
            PieceType::Queen => Box::new(QueenMoveStrategy {
                color: piece_color,
                piece_type,
                coord,
                board,
            }),
        }
    }
}

pub trait PieceMoveStrategy {
    /// Returns all possible moves a piece can make
    /// Does not check if any pieces in the way
    /// or if king is in check
    fn moves(&self) -> Vec<TileCoord>;
    fn color(&self) -> PieceColor;
    fn coord(&self) -> TileCoord;
    fn piece_type(&self) -> PieceType;
    fn handle_move(&self, new_coord: &TileCoord, is_take: bool) -> Option<ValidMove>;

    /// returns all tiles between current tile coord
    /// and new tile coord
    fn tiles_between(&self, _new_coord: TileCoord) -> Vec<TileCoord>;

    fn move_distance(&self, new_coord: TileCoord) -> usize {
        self.tiles_between(new_coord).len() + 1
    }

    fn row_col(&self) -> (u8, u8) {
        (self.coord().row(), self.coord().col())
    }

    fn move_direction(&self, new_coord: TileCoord) -> MoveDirection {
        let (cur_row, cur_col) = self.row_col();
        let (new_row, new_col) = (new_coord.row(), new_coord.col());

        if new_row > cur_row {
            return MoveDirection::Up;
        }

        if new_row < cur_row {
            return MoveDirection::Down;
        }

        if new_col > cur_col {
            return MoveDirection::Right;
        }

        if new_col < cur_col {
            return MoveDirection::Left;
        }

        MoveDirection::None
    }

    fn all_rows(&self) -> Vec<Vec<TileCoord>> {
        let mut all_rows = vec![];
        for row in 0..8 {
            let rows: Vec<TileCoord> = (0..8).map(|col| TileCoord::new(row, col)).collect();
            all_rows.push(rows);
        }
        all_rows
    }

    fn all_cols(&self) -> Vec<Vec<TileCoord>> {
        let mut all_cols = vec![];

        for col in 0..8 {
            let cols: Vec<TileCoord> = (0..8).map(|row| TileCoord::new(row, col)).collect();
            all_cols.push(cols);
        }

        all_cols
    }

    fn all_left_diag(&self) -> Vec<Vec<TileCoord>> {
        let mut all_left_diags: Vec<Vec<TileCoord>> = vec![];

        for d in 0..16 {
            let mut cur_diag = vec![];
            // 0 if d < M else d - M + 1
            let mut row = if d < 8 { 0 } else { d - 8 + 1 };

            // d if d < M else M - 1
            let mut col = if d < 8 { d } else { 7 };

            // while r < N and c > -1:
            // intermediate.append(matrix[r][c])
            // r += 1
            // c -= 1
            while row < 8 && col as i8 > -1 {
                cur_diag.push(TileCoord::new(row, col));
                row += 1;
                col -= 1;
            }
            all_left_diags.push(cur_diag);
        }

        all_left_diags
    }

    fn all_right_diag(&self) -> Vec<Vec<TileCoord>> {
        let mut all_right_diags: Vec<Vec<TileCoord>> = vec![];

        for d in 0..16 {
            let mut cur_diag = vec![];
            // 0 if d < M else d - M + 1
            let mut row = if d < 8 { 7 } else { 7 - (d - 7) };

            // d if d < M else M - 1
            let mut col = if d < 8 { d } else { 7 };

            // while r < N and c > -1:
            // intermediate.append(matrix[r][c])
            // r += 1
            // c -= 1
            while row as i8 > -1 && col as i8 > -1 {
                cur_diag.push(TileCoord::new(row, col));
                row -= 1;
                col -= 1;
            }
            all_right_diags.push(cur_diag);
        }

        all_right_diags
    }

    fn row_intersect(&self) -> Vec<TileCoord> {
        // loop over all rows on board
        for _row in self.all_rows() {
            let mut row_moves: HashSet<TileCoord> = HashSet::new();

            // check if current coord in row
            if _row.contains(&self.coord()) {
                for tile in _row {
                    row_moves.insert(tile);
                }

                // remove self from possible moves
                row_moves.remove(&self.coord());

                return row_moves.into_iter().collect();
            }
        }

        // is empty
        vec![]
    }

    fn col_intersect(&self) -> Vec<TileCoord> {
        // loop over all cols on board
        for _col in self.all_cols() {
            let mut col_moves: HashSet<TileCoord> = HashSet::new();

            // if current coord in col
            if _col.contains(&self.coord()) {
                // add possible moves
                for tile in _col {
                    col_moves.insert(tile);
                }

                // remove self
                col_moves.remove(&self.coord());

                return col_moves.into_iter().collect();
            }
        }

        // is empty
        vec![]
    }

    fn left_diag_intersect(&self) -> Vec<TileCoord> {
        for diag in self.all_left_diag() {
            let mut diag_moves: HashSet<TileCoord> = HashSet::new();

            if diag.contains(&self.coord()) {
                for tile in diag {
                    diag_moves.insert(tile);
                }

                // remove self
                diag_moves.remove(&self.coord());

                return diag_moves.into_iter().collect();
            }
        }

        // is empty
        vec![]
    }

    fn right_diag_intersect(&self) -> Vec<TileCoord> {
        for diag in self.all_right_diag() {
            let mut diag_moves: HashSet<TileCoord> = HashSet::new();

            if diag.contains(&self.coord()) {
                for tile in diag {
                    diag_moves.insert(tile);
                }

                // remove self
                diag_moves.remove(&self.coord());

                return diag_moves.into_iter().collect();
            }
        }

        // is empty
        vec![]
    }

    fn row_col_intersect(&self) -> StraightMoves {
        StraightMoves {
            row: self.row_intersect(),
            col: self.col_intersect(),
        }
    }

    fn diag_intersect(&self) -> DiagMoves {
        DiagMoves {
            left_diag: self.left_diag_intersect(),
            right_diag: self.right_diag_intersect(),
        }
    }
}

#[derive(Debug)]
pub enum MoveDirection {
    Up,
    Down,
    Left,
    Right,
    None,
}

pub trait TilesBetween {
    /// returns all tiles between current tile coord
    /// and new tile coord
    fn tiles_between(
        &self,
        direction: MoveDirection,
        cur_coord: TileCoord,
        new_coord: TileCoord,
    ) -> Vec<TileCoord>;
}

#[derive(Debug)]
pub struct DiagMoves {
    pub left_diag: Vec<TileCoord>,
    pub right_diag: Vec<TileCoord>,
}

impl TilesBetween for DiagMoves {
    fn tiles_between(
        &self,
        direction: MoveDirection,
        cur_coord: TileCoord,
        new_coord: TileCoord,
    ) -> Vec<TileCoord> {
        let mut coords: Vec<TileCoord> = vec![];
        let (cur_row, cur_col) = (cur_coord.row(), cur_coord.col());
        let (new_row, new_col) = (new_coord.row(), new_coord.col());

        match direction {
            MoveDirection::Up => {
                // use right diags
                if new_col > cur_col {
                    for coord in &self.right_diag {
                        // only add higher rows to tiles between
                        if coord.row() > cur_row && coord.row() < new_row {
                            coords.push(*coord);
                        }
                    }
                } else {
                    // use left diags
                    for coord in &self.left_diag {
                        // only add higher rows to tiles between
                        if coord.row() > cur_row && coord.row() < new_row {
                            coords.push(*coord);
                        }
                    }
                }
            }
            MoveDirection::Down => {
                // use left diags
                if new_col > cur_col {
                    for coord in &self.left_diag {
                        // only add higher rows to tiles between
                        if coord.row() < cur_row && coord.row() > new_row {
                            coords.push(*coord);
                        }
                    }
                } else {
                    // use right diags
                    for coord in &self.right_diag {
                        // only add higher rows to tiles between
                        if coord.row() < cur_row && coord.row() > new_row {
                            coords.push(*coord);
                        }
                    }
                }
            }
            _ => (),
        }

        coords
    }
}

#[derive(Debug)]
pub struct StraightMoves {
    pub row: Vec<TileCoord>,
    pub col: Vec<TileCoord>,
}

impl TilesBetween for StraightMoves {
    fn tiles_between(
        &self,
        direction: MoveDirection,
        cur_coord: TileCoord,
        new_coord: TileCoord,
    ) -> Vec<TileCoord> {
        let mut coords: Vec<TileCoord> = vec![];
        let (cur_row, cur_col) = (cur_coord.row(), cur_coord.col());
        let (new_row, new_col) = (new_coord.row(), new_coord.col());

        match direction {
            MoveDirection::Up => {
                for coord in &self.col {
                    // only add higher rows to tiles between
                    if coord.row() > cur_row && coord.row() < new_row {
                        coords.push(*coord);
                    }
                }
            }
            MoveDirection::Right => {
                for coord in &self.row {
                    // only add higher cols to tiles between
                    if coord.col() > cur_col && coord.col() < new_col {
                        coords.push(*coord);
                    }
                }
            }
            MoveDirection::Down => {
                for coord in &self.col {
                    // only add lower rows to tiles between
                    if coord.row() < cur_row && coord.row() > new_row {
                        coords.push(*coord);
                    }
                }
            }
            MoveDirection::Left => {
                for coord in &self.row {
                    // only add lower cols to tiles between
                    if coord.col() < cur_col && coord.col() > new_col {
                        coords.push(*coord);
                    }
                }
            }
            MoveDirection::None => (),
        }

        coords
    }
}
