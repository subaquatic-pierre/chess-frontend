use std::fmt::Display;

use js_sys::Array;
use wasm_bindgen::prelude::*;

use crate::{console_log, pieces::piece::PieceColor};

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameState {
    Started,
    Ended,
}

#[wasm_bindgen]
pub struct Game {
    state: GameState,
    player_turn: PieceColor,
    moves: MovesStr,
    winner: Option<PieceColor>,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        Self {
            state: GameState::Started,
            player_turn: PieceColor::White,
            moves: MovesStr::default(),
            winner: None,
        }
    }

    /// get game state
    pub fn state(&self) -> GameState {
        self.state
    }

    /// update game state with new state
    pub fn update_state(&mut self, new_state: GameState) {
        self.state = new_state
    }

    /// set winner of the game
    /// side effect is to set the game state
    /// to GameState::Ended
    pub fn set_winner(&mut self, piece_color: PieceColor) {
        self.winner = Some(piece_color);
        self.update_state(GameState::Ended)
    }

    /// if the game.state == GameState::Ended
    /// will return PieceColor of the winner
    /// otherwise returns None
    pub fn get_winner(&self) -> Option<PieceColor> {
        self.winner
    }

    /// used to set new player turn once move is complete
    /// called automatically from the frontend in handleMovePiece
    /// in handlers/board
    pub fn set_player_turn(&mut self, player_color: PieceColor) {
        self.player_turn = player_color
    }

    /// get current players turn
    pub fn player_turn(&self) -> PieceColor {
        self.player_turn
    }

    /// returns continuous string of moves
    /// separated by ','
    pub fn print_moves(&self) -> String {
        let MovesStr {
            white_moves,
            black_moves,
        } = self.moves.moves();

        let mut moves_str = "".to_string();

        for (i, _) in white_moves.iter().enumerate() {
            let white_move = &white_moves[i];
            let mut move_line_str = format!("{i}.{}", white_move.str);

            if let Some(black_move) = black_moves.get(i) {
                move_line_str.push_str(&format!(" {},", black_move.str));
            }

            moves_str.push_str(&move_line_str)
        }

        moves_str
    }

    pub fn moves(&self) -> MovesStr {
        self.moves.moves()
    }

    pub fn add_move(&mut self, move_str: String, piece_color: PieceColor) {
        self.moves.insert(move_str, piece_color)
    }
}

impl Default for Game {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Clone)]
pub struct MoveStr {
    pub num: usize,
    pub str: String,
}

impl MoveStr {
    pub fn print(&self) -> String {
        self.str.to_string()
    }
}

impl Display for MoveStr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}.{}", self.num, self.str)
    }
}

#[derive(Clone)]
#[wasm_bindgen]
pub struct MovesStr {
    white_moves: Vec<MoveStr>,
    black_moves: Vec<MoveStr>,
}

#[wasm_bindgen]
impl MovesStr {
    pub fn new() -> Self {
        Self {
            white_moves: vec![],
            black_moves: vec![],
        }
    }

    pub fn insert(&mut self, move_str: String, piece_color: PieceColor) {
        if piece_color == PieceColor::White {
            let num = self.white_moves.len();
            self.white_moves.push(MoveStr { num, str: move_str })
        } else {
            let num = self.black_moves.len();
            self.black_moves.push(MoveStr { num, str: move_str })
        }
    }

    pub fn moves(&self) -> MovesStr {
        self.clone()
    }

    /// returns JS format of string array
    /// used to return current game moves to
    /// frontend
    pub fn str_array(&self) -> Array {
        let white_moves = &self.white_moves;
        let black_moves = &self.black_moves;

        let arr = Array::new_with_length(white_moves.len() as u32);

        for (i, _) in white_moves.iter().enumerate() {
            let white_move = &white_moves[i];
            let mut move_line_str = format!("{i}.{}", white_move.str);

            if let Some(black_move) = black_moves.get(i) {
                move_line_str.push_str(&format!(" {}", black_move.str));
            }

            arr.set(i as u32, JsValue::from_str(&move_line_str))
        }

        arr
    }
}

#[wasm_bindgen]
impl MovesStr {
    pub fn white_moves_js(&self) -> Array {
        self.js_array(PieceColor::White)
    }

    pub fn black_moves_js(&self) -> Array {
        self.js_array(PieceColor::Black)
    }

    fn js_array(&self, color: PieceColor) -> Array {
        let (len, moves) = match color {
            PieceColor::White => (self.white_moves.len() as u32, &self.white_moves),
            PieceColor::Black => (self.black_moves.len() as u32, &self.black_moves),
        };

        let arr = Array::new_with_length(len);

        for (i, _) in moves.iter().enumerate() {
            let move_str = &moves[i];
            arr.set(i as u32, JsValue::from_str(&move_str.str));
        }

        arr
    }
}

impl MovesStr {
    pub fn white_moves(&self) -> Vec<MoveStr> {
        self.white_moves.clone()
    }

    pub fn black_moves(&self) -> Vec<MoveStr> {
        self.black_moves.clone()
    }
}

impl Default for MovesStr {
    fn default() -> Self {
        Self::new()
    }
}
