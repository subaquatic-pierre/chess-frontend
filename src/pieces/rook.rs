// use crate::console_log;
use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::strategy::{PieceMoveStrategy, TilesBetween, ValidMove};
use crate::tile::TileCoord;

pub struct RookMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *mut Board,
}

impl PieceMoveStrategy for RookMoveStrategy {
    fn tiles_between(&self, new_coord: TileCoord) -> Vec<TileCoord> {
        let moves = self.row_col_intersect();
        let direction = self.move_direction(new_coord);

        moves.tiles_between(direction, self.coord(), new_coord)
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut moves_vec = vec![];

        let moves = self.row_col_intersect();

        for coord in moves.row {
            moves_vec.push(coord);
        }

        for coord in moves.col {
            moves_vec.push(coord);
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
