use std::collections::HashSet;

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

use super::king::{KingCastleMoveResult, KingCastleValidator};

pub struct MoveHandler<'a> {
    new_coord: TileCoord,
    board: &'a mut Board,
}

impl<'a> MoveHandler<'a> {
    pub fn new(new_coord: TileCoord, board: &'a mut Board) -> Self {
        Self { new_coord, board }
    }

    pub fn handle_pawn_move(&mut self, piece_strategy: &dyn PieceMoveStrategy) {
        let diagonal_moves =
            PawnMoveStrategy::diagonal_moves(piece_strategy.color(), piece_strategy.coord());
        let is_diagonal = diagonal_moves.contains(&self.new_coord);

        // clear last en passant
        if self.board.last_en_passant().is_some() {
            self.board.set_last_en_passant(None);
        }

        // set last en passant
        let move_distance = piece_strategy.move_distance(self.new_coord.to_owned());
        if move_distance == 2 && !is_diagonal {
            let last_en_passant_coord = self.new_coord;
            self.board
                .set_last_en_passant(Some(last_en_passant_coord.to_owned()))
        }
    }

    pub fn handle_king_castle_move(
        &mut self,
        piece_strategy: &dyn PieceMoveStrategy,
    ) -> Option<KingCastleMoveResult> {
        let piece_color = piece_strategy.color();
        let rook_row = match piece_color {
            PieceColor::White => 0,
            PieceColor::Black => 7,
        };

        // get new rook coords
        // tuple with following layout
        // (old_col, new_col)
        let rook_col = if self.new_coord == KingCastleValidator::long_castle_coord(piece_color) {
            Some((0_u8, 3_u8))
        } else if self.new_coord == KingCastleValidator::short_castle_coord(piece_color) {
            Some((7_u8, 5_u8))
        } else {
            None
        };

        if let Some(col) = rook_col {
            // clear old rook coord
            self.board
                .set_new_tile(&TileCoord::new(rook_row, col.0), None, None);

            // set new rook coord
            self.board.set_new_tile(
                &TileCoord::new(rook_row, col.1),
                Some(PieceType::Rook),
                Some(piece_color),
            );

            // return whether it is a long castle or short castle
            if self.new_coord == KingCastleValidator::long_castle_coord(piece_color) {
                return Some(KingCastleMoveResult::LongCastle);
            }

            if self.new_coord == KingCastleValidator::short_castle_coord(piece_color) {
                return Some(KingCastleMoveResult::ShortCastle);
            }
        };

        // return no castling occurred
        None
    }

    // ---
    // static methods
    // ---

    /// get coords all all enemy pieces
    /// of current strategy color
    pub fn enemy_piece_coords(piece_color: PieceColor, board: &Board) -> Vec<TileCoord> {
        let mut enemy_piece_tile = vec![];
        // loop over all pieces
        for i in 0..board.num_tiles() {
            let coord: TileCoord = i.into();

            // ensure tile has piece
            if let Some(piece) = board.peek_tile(&coord) {
                // only get enemy piece coords
                if piece.color() != piece_color {
                    enemy_piece_tile.push(coord);
                }
            }
        }

        enemy_piece_tile
    }

    /// get the coords of all pieces
    /// of current strategy color
    pub fn own_piece_coords(piece_color: PieceColor, board: &Board) -> Vec<TileCoord> {
        let mut own_pieces = vec![];
        // loop over all pieces
        for i in 0..board.num_tiles() {
            let coord: TileCoord = i.into();

            // ensure tile has piece
            if let Some(piece) = board.peek_tile(&coord) {
                // only get enemy piece coords
                if piece.color() == piece_color {
                    own_pieces.push(coord);
                }
            }
        }

        own_pieces
    }
}

pub struct MoveValidator<'a> {
    new_coord: TileCoord,
    board: &'a Board,
}

impl<'a> MoveValidator<'a> {
    pub fn new(new_coord: TileCoord, board: &'a Board) -> Self {
        Self { new_coord, board }
    }

    /// main method to validate move
    /// ignore_check flag is used to move pieces ignoring if king is in check
    /// this is helpful in moving pieces to determine if the move
    /// would result in king being in check
    pub fn is_valid_move(
        &self,
        piece_strategy: &dyn PieceMoveStrategy,
        ignore_check: bool,
    ) -> bool {
        // if new coord not in bounds
        // is invalid move
        if !self.new_coord.in_bounds() {
            return false;
        }
        // get possible piece moves based on piece_strategy
        let possible_moves = piece_strategy.moves();

        // check if piece between cur_coord and new_coord
        if self.is_blocking_piece(&possible_moves, piece_strategy) {
            return false;
        }

        // pawn specific move validation
        if piece_strategy.piece_type() == PieceType::Pawn
            && !self.is_valid_pawn_move(piece_strategy)
        {
            return false;
        }

        // // king castle move validation
        if piece_strategy.piece_type() == PieceType::King
            && !self.is_valid_king_castle_move(piece_strategy)
        {
            return false;
        }

        // check if trying to move to same square as current
        if self.is_same_coord_move(piece_strategy) {
            return false;
        }

        // check if own piece take
        if self.is_own_piece_take(piece_strategy) {
            return false;
        }

        // handle rest piece moves
        if !possible_moves.contains(&self.new_coord) {
            return false;
        }

        // flag used to validate if king is in check,
        // possible move out of check
        // possible move into check
        if !ignore_check {
            // cant move into check
            if MoveValidator::is_possible_check(piece_strategy, self.board, self.new_coord) {
                return false;
            }

            // check if currently in check and possible move out of check
            if MoveValidator::is_check(piece_strategy.color(), self.board)
                && !MoveValidator::is_possible_check(piece_strategy, self.board, self.new_coord)
            {
                return true;
            }

            if MoveValidator::is_check(piece_strategy.color(), self.board) {
                return false;
            }
        }

        true
    }

    /// check if piece at new coord
    pub fn is_take(&self) -> bool {
        self.board.get_piece(&self.new_coord).is_some()
    }

    /// check if trying to take king
    /// cannot take king off the board
    pub fn is_king_take(&self) -> bool {
        let new_piece_at_coord = self.board.peek_tile(&self.new_coord);
        if let Some(piece) = new_piece_at_coord {
            if piece.piece_type() == PieceType::King {
                return true;
            }
        }
        false
    }

    // validate king castle move
    fn is_valid_king_castle_move(&self, piece_strategy: &dyn PieceMoveStrategy) -> bool {
        // `board.king_castle_state()` method returns clone of current state
        let board_king_castle_state = self.board.king_castle_state();
        let piece_color = piece_strategy.color();

        let king_castle_state = match piece_color {
            PieceColor::White => &board_king_castle_state.white_king,
            PieceColor::Black => &board_king_castle_state.black_king,
        };

        if self.new_coord == KingCastleValidator::short_castle_coord(piece_color)
            && (king_castle_state.is_king_moved
                || king_castle_state.h_file_rook_moved
                || king_castle_state.is_in_check)
        {
            return false;
        }
        if self.new_coord == KingCastleValidator::long_castle_coord(piece_color)
            && (king_castle_state.is_king_moved
                || king_castle_state.a_file_rook_moved
                || king_castle_state.is_in_check)
        {
            return false;
        }

        true
    }

    // validate pawn move
    fn is_valid_pawn_move(&self, piece_strategy: &dyn PieceMoveStrategy) -> bool {
        let diagonal_moves =
            PawnMoveStrategy::diagonal_moves(piece_strategy.color(), piece_strategy.coord());
        let is_diagonal = diagonal_moves.contains(&self.new_coord);

        // check if can take en passant
        if self.is_en_passant_take(piece_strategy) {
            return true;
        }

        if is_diagonal && !self.is_take() {
            return false;
        }

        // return not valid move if not diagonal and taking
        if !is_diagonal && self.is_take() {
            return false;
        }

        true
    }

    /// check if own piece at new coord
    /// cannot take own piece space
    fn is_own_piece_take(&self, piece_strategy: &dyn PieceMoveStrategy) -> bool {
        let new_piece_at_coord = self.board.peek_tile(&self.new_coord);
        if let Some(piece) = new_piece_at_coord {
            if piece.color() == piece_strategy.color() {
                return true;
            }
        }
        false
    }

    /// check if pawn can take with en passant move
    pub fn is_en_passant_take(&self, piece_strategy: &dyn PieceMoveStrategy) -> bool {
        let possible_moves = piece_strategy.moves();
        if possible_moves.contains(&self.new_coord)
            && piece_strategy.piece_type() == PieceType::Pawn
            && PawnMoveStrategy::is_en_passant_take(
                piece_strategy.coord(),
                piece_strategy.color(),
                self.new_coord,
                self.board.last_en_passant(),
            )
        {
            return true;
        }
        false
    }

    /// check if piece between cur_coord and new_coord
    /// return invalid move if piece exists
    /// Exception is PieceType::Knight
    fn is_blocking_piece(
        &self,
        possible_moves: &[TileCoord],
        piece_strategy: &dyn PieceMoveStrategy,
    ) -> bool {
        if possible_moves.contains(&self.new_coord)
            && piece_strategy.piece_type() != PieceType::Knight
        {
            let tiles_between = piece_strategy.tiles_between(self.new_coord);

            for tile_coord in tiles_between {
                if self.board.peek_tile(&tile_coord).is_some() {
                    return true;
                }
            }
        }
        false
    }

    fn is_same_coord_move(&self, piece_strategy: &dyn PieceMoveStrategy) -> bool {
        if piece_strategy.coord() == self.new_coord {
            return true;
        }
        false
    }

    // ---
    // static methods
    // ---

    /// main method to validate whether king is in check
    pub fn is_check(piece_color: PieceColor, board: &Board) -> bool {
        let enemy_piece_tiles = MoveHandler::enemy_piece_coords(piece_color, board);

        for coord in enemy_piece_tiles {
            // SAFETY:
            // tile has piece, confirmed in above loop
            let piece = board.peek_tile(&coord).unwrap();

            // build enemy piece strategy
            let enemy_piece_strategy = StrategyBuilder::new_piece_strategy(
                piece.piece_type(),
                coord,
                piece.color(),
                board,
            );

            for new_coord in enemy_piece_strategy.moves() {
                if new_coord.in_bounds() {
                    let move_validator = MoveValidator::new(new_coord, board);

                    // RECURSIVE ALGORITHM
                    // is_king_take() is the base case
                    // check if any valid move can take king
                    if move_validator.is_valid_move(enemy_piece_strategy.as_ref(), true)
                        && move_validator.is_king_take()
                    {
                        // return true if can take king
                        return true;
                    }
                }
            }
        }

        // no king check
        false
    }

    /// possibility of check, method used to determine if moving into check
    /// or possible move out of check
    pub fn is_possible_check(
        piece_strategy: &dyn PieceMoveStrategy,
        board: &Board,
        new_coord: TileCoord,
    ) -> bool {
        // copy board
        let mut board_copy = board.clone();

        // create new validator based on current board
        let validator = MoveValidator::new(new_coord, &board_copy);

        // ensure move is valid, ignoring king check
        if validator.is_valid_move(piece_strategy, true) {
            let (old_row, old_col) = piece_strategy.coord().row_col();
            let (new_row, new_col) = new_coord.row_col();

            // move piece ignoring check
            board_copy.move_piece_ignore_check(old_row, old_col, new_row, new_col);

            // check if king in check
            if MoveValidator::is_check(piece_strategy.color(), &board_copy) {
                return true;
            }
        }
        false
    }

    /// possibility of checkmate
    pub fn is_checkmate(piece_color: PieceColor, board: &Board) -> bool {
        let own_pieces = MoveHandler::own_piece_coords(piece_color, board);
        // create new validator based on current board

        for coord in own_pieces {
            // SAFETY:
            // tile has piece, confirmed in above loop
            let piece = board.peek_tile(&coord).unwrap();

            // // build enemy piece strategy
            let own_piece_strategy = StrategyBuilder::new_piece_strategy(
                piece.piece_type(),
                coord,
                piece.color(),
                board,
            );

            for new_coord in own_piece_strategy.moves() {
                if new_coord.in_bounds() {
                    let move_validator = MoveValidator::new(new_coord, board);

                    // check if any valid move and can move out of check
                    if move_validator.is_valid_move(own_piece_strategy.as_ref(), false) {
                        // return false, ie. not checkmate
                        return false;
                    }
                }
            }
        }

        // if not possible moves, then is checkmate
        true
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

    /// returns all tiles between current tile coord
    /// and new tile coord
    fn tiles_between(&self, _new_coord: TileCoord) -> Vec<TileCoord>;

    fn move_distance(&self, new_coord: TileCoord) -> usize {
        self.tiles_between(new_coord).len() + 1
    }

    fn move_direction(&self, new_coord: TileCoord) -> MoveDirection {
        let (cur_row, cur_col) = self.coord().row_col();
        let (new_row, new_col) = new_coord.row_col();

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

pub struct StrategyBuilder {}
impl StrategyBuilder {
    pub fn new_piece_strategy(
        piece_type: PieceType,
        coord: TileCoord,
        piece_color: PieceColor,
        board: *const Board,
    ) -> Box<dyn PieceMoveStrategy> {
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
