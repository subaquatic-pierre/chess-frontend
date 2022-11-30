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
    moves: Moves,
    winner: Option<PieceColor>,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        Self {
            state: GameState::Started,
            player_turn: PieceColor::White,
            moves: Moves::default(),
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
        let Moves {
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

    pub fn moves(&self) -> Moves {
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
pub struct Move {
    pub num: usize,
    pub str: String,
}

impl Move {
    pub fn print(&self) -> String {
        self.str.to_string()
    }
}

impl Display for Move {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}.{}", self.num, self.str)
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Moves {
    white_moves: Vec<Move>,
    black_moves: Vec<Move>,
}

#[wasm_bindgen]
impl Moves {
    pub fn new() -> Self {
        Self {
            white_moves: vec![],
            black_moves: vec![],
        }
    }

    pub fn insert(&mut self, move_str: String, piece_color: PieceColor) {
        if piece_color == PieceColor::White {
            let num = self.white_moves.len();
            self.white_moves.push(Move { num, str: move_str })
        } else {
            let num = self.black_moves.len();
            self.black_moves.push(Move { num, str: move_str })
        }
    }

    pub fn moves(&self) -> Moves {
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

impl Default for Moves {
    fn default() -> Self {
        Self::new()
    }
}
