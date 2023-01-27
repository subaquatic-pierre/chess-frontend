// use crate::console_log;
use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::strategy::{PieceMoveStrategy, TilesBetween};
use crate::tile::TileCoord;

pub struct QueenMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *const Board,
}

impl PieceMoveStrategy for QueenMoveStrategy {
    fn tiles_between(&self, new_coord: TileCoord) -> Vec<TileCoord> {
        let (row, col) = self.coord().row_col();

        let direction = self.move_direction(new_coord);

        // check if straight or diagonal move
        if new_coord.row() == row || new_coord.col() == col {
            let straight_moves = self.row_col_intersect();
            straight_moves.tiles_between(direction, self.coord(), new_coord)
        } else {
            // is diagonal move
            let diag_moves = self.diag_intersect();
            diag_moves.tiles_between(direction, self.coord(), new_coord)
        }
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut moves_vec = vec![];

        let diag_moves = self.diag_intersect();
        let straight_moves = self.row_col_intersect();

        moves_vec.extend(diag_moves.left_diag);
        moves_vec.extend(diag_moves.right_diag);
        moves_vec.extend(straight_moves.col);
        moves_vec.extend(straight_moves.row);

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
