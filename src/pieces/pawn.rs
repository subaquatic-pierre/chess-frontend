// use crate::console_log;
use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::strategy::PieceMoveStrategy;
use crate::tile::{TileCoord, TileRank};

pub struct PawnMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *const Board,
}

impl PawnMoveStrategy {
    pub fn diagonal_moves(color: PieceColor, coord: TileCoord) -> Vec<TileCoord> {
        let mut vec = vec![];
        if color == PieceColor::White {
            let left_diag_coord = TileCoord::new(coord.row() + 1, coord.col() - 1);
            vec.push(left_diag_coord);

            let right_diag_coord = TileCoord::new(coord.row() + 1, coord.col() + 1);
            vec.push(right_diag_coord);
        } else {
            let left_diag_coord = TileCoord::new(coord.row() - 1, coord.col() + 1);
            vec.push(left_diag_coord);

            let right_diag_coord = TileCoord::new(coord.row() - 1, coord.col() - 1);

            vec.push(right_diag_coord);
        }

        vec
    }

    /// Checks if is en passant take possible
    pub fn is_en_passant_take(
        cur_coord: TileCoord,
        piece_color: PieceColor,
        new_coord: TileCoord,
        last_en_passant_coord: Option<TileCoord>,
    ) -> bool {
        if let Some(en_passant_coord) = last_en_passant_coord {
            if piece_color == PieceColor::White && cur_coord.rank() == TileRank::Rank5 {
                return en_passant_coord.row() + 1 == new_coord.row()
                    && en_passant_coord.col() == new_coord.col();
            }
            if piece_color == PieceColor::Black && cur_coord.rank() == TileRank::Rank4 {
                return en_passant_coord.row() - 1 == new_coord.row()
                    && en_passant_coord.col() == new_coord.col();
            }
            false
        } else {
            false
        }
    }

    fn board(&self) -> &Board {
        unsafe { self.board.as_ref().unwrap() }
    }
}

impl PieceMoveStrategy for PawnMoveStrategy {
    fn coord(&self) -> TileCoord {
        self.coord
    }

    fn piece_type(&self) -> PieceType {
        self.piece_type
    }

    fn color(&self) -> PieceColor {
        self.color
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut valid_moves = PawnMoveStrategy::diagonal_moves(self.color(), self.coord());

        // check if white pawn
        if self.color == PieceColor::White {
            // check if can take a piece diagonal
            // if coord is not valid, peak at tile method
            // will return None
            for coord in PawnMoveStrategy::diagonal_moves(self.color, self.coord) {
                let diag_piece = self.board().peek_tile(&coord);

                if diag_piece.is_some() {
                    valid_moves.push(coord)
                }
            }

            // check if white pawn on 2nd rank
            if self.coord.rank() == TileRank::Rank2 {
                let coord = TileCoord::new(TileRank::Rank4.into(), self.coord.col());
                valid_moves.push(coord);
            }

            // single square move
            let coord = TileCoord::new(self.coord.row() + 1, self.coord.col());
            valid_moves.push(coord);
        }

        // check if white pawn on 2nd rank, add 2 moves ahead as valid move
        if self.color == PieceColor::Black {
            // check if can take a piece diagonal
            // if coord is not valid, peak at tile method
            // will return None
            for coord in PawnMoveStrategy::diagonal_moves(self.color, self.coord) {
                let diag_piece = self.board().peek_tile(&coord);

                if diag_piece.is_some() {
                    valid_moves.push(coord)
                }
            }

            // double move on 7th rank
            if self.coord.rank() == TileRank::Rank7 {
                let coord = TileCoord::new(TileRank::Rank5.into(), self.coord.col());
                valid_moves.push(coord);
            }

            // single square move
            let coord = TileCoord::new(self.coord.row() - 1, self.coord.col());
            valid_moves.push(coord);
        }

        valid_moves
    }

    /// returns all tiles between current tile coord
    /// and new tile coord
    fn tiles_between(&self, new_coord: TileCoord) -> Vec<TileCoord> {
        let mut coords: Vec<TileCoord> = vec![];

        let (cur_row, cur_col) = (self.coord().row(), self.coord().col());

        // no tiles between if diagonal move
        if cur_col != new_coord.col() {
            return coords;
        }

        // difference greater than to, means double pawn move, ie. first move
        if cur_row.abs_diff(new_coord.row()) == 2 {
            // check if negative row move
            if (cur_row as i8 - new_coord.row() as i8) < 0 {
                let new_coord = TileCoord::new(cur_row + 1, cur_col);
                coords.push(new_coord);
            } else {
                let new_coord = TileCoord::new(cur_row - 1, cur_col);
                coords.push(new_coord);
            }
        }

        coords
    }
}
