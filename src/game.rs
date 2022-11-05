use wasm_bindgen::prelude::*;

use crate::board::Board;

#[wasm_bindgen]
pub enum GameState {
    Started,
    Ended,
}
#[wasm_bindgen]
pub struct Game {
    state: GameState,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen]
    pub fn new(_board: &Board) -> Self {
        Self {
            state: GameState::Started,
        }
    }

    pub fn update_state(&mut self, new_state: GameState) {
        self.state = new_state
    }
}
