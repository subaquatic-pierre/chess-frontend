// use crate::console_log;
use crate::board::Board;
use crate::pieces::piece::{PieceColor, PieceType};
use crate::pieces::strategy::{PieceMoveStrategy, TilesBetween, ValidMove};
use crate::tile::TileCoord;

pub struct BishopMoveStrategy {
    pub color: PieceColor,
    pub coord: TileCoord,
    pub piece_type: PieceType,
    pub board: *mut Board,
}

impl PieceMoveStrategy for BishopMoveStrategy {
    fn tiles_between(&self, new_coord: TileCoord) -> Vec<TileCoord> {
        let moves = self.diag_intersect();
        let direction = self.move_direction(new_coord);

        let coords = moves.tiles_between(direction, self.coord(), new_coord);

        coords
    }

    fn moves(&self) -> Vec<TileCoord> {
        let mut moves_vec = vec![];

        let moves = self.diag_intersect();

        for coord in moves.left_diag {
            moves_vec.push(coord);
        }

        for coord in moves.right_diag {
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
