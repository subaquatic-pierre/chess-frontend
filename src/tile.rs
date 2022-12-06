use serde::{Deserialize, Serialize};
use std::fmt::Display;
use wasm_bindgen::prelude::*;

use crate::console_log;
use crate::pieces::piece::{Piece, PieceColor, PieceState, PieceType};

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Tile {
    state: TileState,
    coord: TileCoord,
    file: TileFile,
    rank: TileRank,
    index: u8,
    piece: Option<Piece>,
}

#[wasm_bindgen]
pub enum TileColor {
    White,
    Black,
}

#[wasm_bindgen]
impl Tile {
    #[wasm_bindgen(constructor)]
    pub fn new(coord: TileCoord, index: u8, state: TileState, piece: Option<Piece>) -> Self {
        let row = coord.row();
        let col = coord.col();

        Self {
            coord,
            index,
            state,
            file: col.into(),
            rank: row.into(),
            piece,
        }
    }

    pub fn render(&self) -> String {
        format!("{},{}", self.file, self.rank)
    }

    pub fn index(&self) -> u8 {
        self.index
    }

    pub fn color(&self) -> TileColor {
        self.get_tile_color()
    }

    pub fn set_state(&mut self, state: TileState) {
        // set piece state as selected if state is active
        if let Some(piece) = self.piece.as_mut() {
            if state == TileState::Active {
                piece.set_state(PieceState::Selected);
            } else {
                piece.set_state(PieceState::Unselected);
            }
        }

        self.state = state
    }

    /// Returns clone of tile piece
    pub fn piece(&self) -> Option<Piece> {
        self.piece.clone()
    }

    pub fn set_piece(&mut self, piece_type: PieceType, piece_color: PieceColor) {
        let new_piece = Piece::new(piece_type, piece_color, self.coord);
        self.piece = Some(new_piece);
    }

    pub fn set_piece_state(&mut self, piece_state: PieceState) {
        let piece = self.piece.as_mut().unwrap();
        piece.set_state(piece_state);
    }

    pub fn coord(&self) -> TileCoord {
        self.coord
    }

    pub fn state(&self) -> TileState {
        self.state
    }

    pub fn as_bytes(&self) -> Vec<u8> {
        bincode::serialize(&self).unwrap()
    }

    pub fn log(&self) {
        console_log!("{:?}", self);
    }

    pub fn to_json(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }

    pub fn from_json(json: JsValue) -> Tile {
        serde_wasm_bindgen::from_value(json).unwrap()
    }

    // ---
    // Private methods
    // ---

    fn get_tile_color(&self) -> TileColor {
        if (self.coord.col + self.coord.row) % 2 == 0 {
            TileColor::Black
        } else {
            TileColor::White
        }
    }

    // ---
    // static methods
    // ---
    pub fn from_bytes(bytes: Vec<u8>) -> Tile {
        bincode::deserialize(&bytes).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, Debug, Copy)]
pub enum TileState {
    Inactive,
    Active,
    Highlight,
    Unknown,
}

impl Display for TileState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Active => write!(f, "A"),
            Self::Inactive => write!(f, "I"),
            Self::Highlight => write!(f, "S"),
            _ => write!(f, "UNKNOWN"),
        }
    }
}

impl From<u8> for TileState {
    fn from(num: u8) -> Self {
        match num {
            0 => Self::Inactive,
            1 => Self::Active,
            2 => Self::Highlight,
            _ => Self::Unknown,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq)]
pub enum TileFile {
    FileA,
    FileB,
    FileC,
    FileD,
    FileE,
    FileF,
    FileG,
    FileH,
    Unknown,
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq)]
pub enum TileRank {
    Rank1,
    Rank2,
    Rank3,
    Rank4,
    Rank5,
    Rank6,
    Rank7,
    Rank8,
    Unknown,
}

impl Display for TileFile {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::FileA => write!(f, "a"),
            Self::FileB => write!(f, "b"),
            Self::FileC => write!(f, "c"),
            Self::FileD => write!(f, "d"),
            Self::FileE => write!(f, "e"),
            Self::FileF => write!(f, "f"),
            Self::FileG => write!(f, "g"),
            Self::FileH => write!(f, "h"),
            Self::Unknown => write!(f, "UNKNOWN"),
        }
    }
}
impl Display for TileRank {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Rank1 => write!(f, "1"),
            Self::Rank2 => write!(f, "2"),
            Self::Rank3 => write!(f, "3"),
            Self::Rank4 => write!(f, "4"),
            Self::Rank5 => write!(f, "5"),
            Self::Rank6 => write!(f, "6"),
            Self::Rank7 => write!(f, "7"),
            Self::Rank8 => write!(f, "8"),
            Self::Unknown => write!(f, "UNKNOWN"),
        }
    }
}

impl From<char> for TileFile {
    fn from(file_str: char) -> Self {
        match file_str {
            'a' => TileFile::FileA,
            'b' => TileFile::FileB,
            'c' => TileFile::FileC,
            'd' => TileFile::FileD,
            'e' => TileFile::FileE,
            'f' => TileFile::FileF,
            'g' => TileFile::FileG,
            'h' => TileFile::FileH,
            _ => TileFile::Unknown,
        }
    }
}

impl From<u8> for TileFile {
    fn from(num: u8) -> Self {
        match num {
            0 => Self::FileA,
            1 => Self::FileB,
            2 => Self::FileC,
            3 => Self::FileD,
            4 => Self::FileE,
            5 => Self::FileF,
            6 => Self::FileG,
            7 => Self::FileH,
            _ => Self::Unknown,
        }
    }
}

impl Into<u8> for TileFile {
    fn into(self) -> u8 {
        match self {
            Self::FileA => 0,
            Self::FileB => 1,
            Self::FileC => 2,
            Self::FileD => 3,
            Self::FileE => 4,
            Self::FileF => 5,
            Self::FileG => 6,
            Self::FileH => 7,
            Self::Unknown => 10,
        }
    }
}

impl From<char> for TileRank {
    fn from(rank_str: char) -> Self {
        match rank_str {
            '1' => Self::Rank1,
            '2' => Self::Rank2,
            '3' => Self::Rank3,
            '4' => Self::Rank4,
            '5' => Self::Rank5,
            '6' => Self::Rank6,
            '7' => Self::Rank7,
            '8' => Self::Rank8,
            _ => Self::Unknown,
        }
    }
}
impl From<u8> for TileRank {
    fn from(num: u8) -> Self {
        match num {
            0 => Self::Rank1,
            1 => Self::Rank2,
            2 => Self::Rank3,
            3 => Self::Rank4,
            4 => Self::Rank5,
            5 => Self::Rank6,
            6 => Self::Rank7,
            7 => Self::Rank8,
            _ => Self::Unknown,
        }
    }
}

impl Into<u8> for TileRank {
    fn into(self) -> u8 {
        match self {
            Self::Rank1 => 0,
            Self::Rank2 => 1,
            Self::Rank3 => 2,
            Self::Rank4 => 3,
            Self::Rank5 => 4,
            Self::Rank6 => 5,
            Self::Rank7 => 6,
            Self::Rank8 => 7,
            Self::Unknown => 10,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq, Copy, Hash)]
pub struct TileCoord {
    row: u8,
    col: u8,
}

#[wasm_bindgen]
impl TileCoord {
    pub fn new(row: u8, col: u8) -> Self {
        Self { col, row }
    }

    pub fn col(&self) -> u8 {
        self.col
    }

    pub fn row(&self) -> u8 {
        self.row
    }

    pub fn file(&self) -> TileFile {
        self.col.into()
    }

    pub fn rank(&self) -> TileRank {
        self.row.into()
    }

    pub fn in_bounds(&self) -> bool {
        (self.row <= 7) && (self.col <= 7)
    }

    pub fn to_json(self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }

    pub fn from_json(json: JsValue) -> Self {
        serde_wasm_bindgen::from_value(json).unwrap()
    }
}

impl From<usize> for TileCoord {
    fn from(index: usize) -> Self {
        let col = index as u8 % 8;
        let row = index as u8 / 8_u8;
        TileCoord { row, col }
    }
}

impl Display for TileCoord {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{},{}", self.col, self.row)
    }
}

#[cfg(test)]
mod test {
    use crate::tile::TileCoord;

    #[test]
    pub fn test_tile_coord_from_u8() {
        let coord: TileCoord = 19.into();
        assert_eq!((2, 3), (coord.row(), coord.col()));

        let coord: TileCoord = 37.into();
        assert_eq!((4, 5), (coord.row(), coord.col()));

        let coord: TileCoord = 63.into();
        assert_eq!((7, 7), (coord.row(), coord.col()));

        let coord: TileCoord = 0.into();
        assert_eq!((0, 0), (coord.row(), coord.col()));
    }
}
