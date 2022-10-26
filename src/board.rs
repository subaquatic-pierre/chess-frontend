use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[wasm_bindgen]
pub enum Direction {
    North,
    East,
    South,
    West,
}
