use wasm_bindgen::prelude::*;

use crate::pieces::piece::PieceColor;

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
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen]
    pub fn new() -> Self {
        Self {
            state: GameState::Started,
            player_turn: PieceColor::White,
        }
    }

    pub fn state(&self) -> GameState {
        self.state
    }

    pub fn update_state(&mut self, new_state: GameState) {
        self.state = new_state
    }

    pub fn set_player_turn(&mut self, player_color: PieceColor) {
        self.player_turn = player_color
    }

    pub fn player_turn(&self) -> PieceColor {
        self.player_turn
    }
}

impl Default for Game {
    fn default() -> Self {
        Self::new()
    }
}
