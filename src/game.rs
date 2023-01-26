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
    moves: GameMoves,
    winner: Option<PieceColor>,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        Self {
            state: GameState::Started,
            player_turn: PieceColor::White,
            moves: GameMoves::default(),
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
    /// called automatically from the frontend in handleBoardPieceMove
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
        let GameMoves {
            white_moves,
            black_moves,
        } = self.moves.moves();

        let mut moves_str = "".to_string();

        for (i, _) in white_moves.iter().enumerate() {
            let white_move = &white_moves[i];
            let mut move_line_str = format!("{i}.{}", white_move.str());

            if let Some(black_move) = black_moves.get(i) {
                move_line_str.push_str(&format!(" {},", black_move.str()));
            }

            moves_str.push_str(&move_line_str)
        }

        moves_str
    }

    pub fn moves(&self) -> GameMoves {
        self.moves.moves()
    }

    pub fn add_move(&mut self, move_str: String, piece_color: PieceColor) {
        self.moves.insert(move_str, piece_color)
    }

    pub fn moves_len(&self) -> usize {
        self.moves.white_moves.len()
    }

    pub fn set_move(&mut self, index: usize, piece_color: PieceColor, new_move_str: &str) {
        let new_move = GameMove::new(index, new_move_str);
        match piece_color {
            PieceColor::White => self.moves.white_moves[index] = new_move,
            PieceColor::Black => self.moves.black_moves[index] = new_move,
        }
    }

    pub fn get_move(&mut self, index: usize, piece_color: PieceColor) -> GameMove {
        match piece_color {
            PieceColor::White => self.moves.white_moves[index].clone(),
            PieceColor::Black => self.moves.black_moves[index].clone(),
        }
    }
}

impl Default for Game {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Clone)]
#[wasm_bindgen]
pub struct GameMove {
    pub num: usize,
    _str: String,
}

#[wasm_bindgen]
impl GameMove {
    pub fn new(num: usize, move_str: &str) -> Self {
        Self {
            num,
            _str: move_str.to_string(),
        }
    }
    pub fn print(&self) -> String {
        self._str.to_string()
    }

    pub fn str(&self) -> String {
        self._str.clone()
    }
}

impl Display for GameMove {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}.{}", self.num, self._str)
    }
}

#[derive(Clone)]
#[wasm_bindgen]
pub struct GameMoves {
    white_moves: Vec<GameMove>,
    black_moves: Vec<GameMove>,
}

#[wasm_bindgen]
impl GameMoves {
    pub fn new() -> Self {
        Self {
            white_moves: vec![],
            black_moves: vec![],
        }
    }

    pub fn insert(&mut self, move_str: String, piece_color: PieceColor) {
        if piece_color == PieceColor::White {
            let num = self.white_moves.len();
            self.white_moves.push(GameMove::new(num, &move_str))
        } else {
            let num = self.black_moves.len();
            self.black_moves.push(GameMove::new(num, &move_str))
        }
    }

    pub fn moves(&self) -> GameMoves {
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
            let mut move_line_str = format!("{i}.{}", white_move.str());

            if let Some(black_move) = black_moves.get(i) {
                move_line_str.push_str(&format!(" {}", black_move.str()));
            }

            arr.set(i as u32, JsValue::from_str(&move_line_str))
        }

        arr
    }
}

#[wasm_bindgen]
impl GameMoves {
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
            arr.set(i as u32, JsValue::from_str(&move_str.str()));
        }

        arr
    }
}

impl GameMoves {
    pub fn white_moves(&self) -> Vec<GameMove> {
        self.white_moves.clone()
    }

    pub fn black_moves(&self) -> Vec<GameMove> {
        self.black_moves.clone()
    }
}

impl Default for GameMoves {
    fn default() -> Self {
        Self::new()
    }
}
