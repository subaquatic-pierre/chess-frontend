// use crate::board::{Board, BoardDirection};
use crate::pieces::piece::{Piece, PieceColor, PieceType};
use crate::tile::TileCoord;

pub fn get_piece_default(row: u8, col: u8) -> Option<Piece> {
    let coord = TileCoord::new(row, col);
    match (row, col) {
        // PieceType::Pawn
        (1, 0..=7) => Some(Piece::new(PieceType::Pawn, PieceColor::White, coord)),
        (6, 0..=7) => Some(Piece::new(PieceType::Pawn, PieceColor::Black, coord)),
        // PieceType::Rook
        (0, 0) => Some(Piece::new(PieceType::Rook, PieceColor::White, coord)),
        (0, 7) => Some(Piece::new(PieceType::Rook, PieceColor::White, coord)),
        (7, 0) => Some(Piece::new(PieceType::Rook, PieceColor::Black, coord)),
        (7, 7) => Some(Piece::new(PieceType::Rook, PieceColor::Black, coord)),
        // PieceType::Bishop
        (0, 2) => Some(Piece::new(PieceType::Bishop, PieceColor::White, coord)),
        (0, 5) => Some(Piece::new(PieceType::Bishop, PieceColor::White, coord)),
        (7, 2) => Some(Piece::new(PieceType::Bishop, PieceColor::Black, coord)),
        (7, 5) => Some(Piece::new(PieceType::Bishop, PieceColor::Black, coord)),
        // PieceType::Knight
        (0, 1) => Some(Piece::new(PieceType::Knight, PieceColor::White, coord)),
        (0, 6) => Some(Piece::new(PieceType::Knight, PieceColor::White, coord)),
        (7, 1) => Some(Piece::new(PieceType::Knight, PieceColor::Black, coord)),
        (7, 6) => Some(Piece::new(PieceType::Knight, PieceColor::Black, coord)),
        // PieceType::King
        (0, 4) => Some(Piece::new(PieceType::King, PieceColor::White, coord)),
        (7, 4) => Some(Piece::new(PieceType::King, PieceColor::Black, coord)),
        // PieceType::Queen
        (0, 3) => Some(Piece::new(PieceType::Queen, PieceColor::White, coord)),
        (7, 3) => Some(Piece::new(PieceType::Queen, PieceColor::Black, coord)),
        _ => None,
    }
}
