// use crate::console_log;
use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::strategy::PieceMoveStrategy;
use crate::tile::TileCoord;

pub struct KnightMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *const Board,
}

impl PieceMoveStrategy for KnightMoveStrategy {
    fn tiles_between(&self, _new_coord: TileCoord) -> Vec<TileCoord> {
        vec![]
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut moves_vec = vec![];
        let (row, col) = self.coord().row_col();

        let move_1 = TileCoord::new(row - 2, col - 1);
        let move_2 = TileCoord::new(row - 1, col - 2);
        let move_3 = TileCoord::new(row + 1, col - 2);
        let move_4 = TileCoord::new(row + 2, col - 1);
        let move_5 = TileCoord::new(row + 2, col + 1);
        let move_6 = TileCoord::new(row + 1, col + 2);
        let move_7 = TileCoord::new(row - 1, col + 2);
        let move_8 = TileCoord::new(row - 2, col + 1);

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
