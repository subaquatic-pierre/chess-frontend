use std::fmt::Display;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// use crate::console_log;
use crate::tile::TileCoord;

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq, Copy)]
pub enum PieceColor {
    White,
    Black,
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq, Copy)]
pub enum PieceType {
    Pawn,
    Rook,
    Knight,
    Bishop,
    King,
    Queen,
}

impl Display for PieceType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Pawn => write!(f, ""),
            Self::Rook => write!(f, "R"),
            Self::Knight => write!(f, "N"),
            Self::Bishop => write!(f, "B"),
            Self::King => write!(f, "K"),
            Self::Queen => write!(f, "Q"),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Piece {
    piece_type: PieceType,
    color: PieceColor,
    coord: TileCoord,
    state: PieceState,
}

#[wasm_bindgen]
impl Piece {
    pub fn new(piece_type: PieceType, color: PieceColor, coord: TileCoord) -> Self {
        Self {
            piece_type,
            color,
            coord,
            state: PieceState::Unselected,
        }
    }

    pub fn state(&self) -> PieceState {
        self.state.clone()
    }

    pub fn is_selected(&self) -> bool {
        if self.state == PieceState::Selected {
            return true;
        }
        false
    }

    pub fn piece_type(&self) -> PieceType {
        self.piece_type
    }

    pub fn color(&self) -> PieceColor {
        self.color
    }

    pub fn coord(&self) -> TileCoord {
        self.coord
    }

    pub fn set_state(&mut self, new_state: PieceState) {
        self.state = new_state;
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        bincode::serialize(&self).unwrap()
    }

    pub fn from_bytes(bytes: Vec<u8>) -> Piece {
        bincode::deserialize(&bytes).unwrap()
    }

    pub fn to_json(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }

    pub fn from_json(json: JsValue) -> Piece {
        serde_wasm_bindgen::from_value(json).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, PartialOrd, Ord, Eq)]
pub enum PieceState {
    Selected,
    Unselected,
}

impl From<char> for PieceType {
    fn from(string: char) -> Self {
        match string {
            'K' => PieceType::King,
            'Q' => PieceType::Queen,
            'R' => PieceType::Rook,
            'B' => PieceType::Bishop,
            'N' => PieceType::Knight,
            _ => PieceType::Pawn,
        }
    }
}
