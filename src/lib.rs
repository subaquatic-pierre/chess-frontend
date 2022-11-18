#![allow(clippy::collapsible_else_if)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::from_over_into)]

use board::Board;
use wasm_bindgen::prelude::*;

mod board;
mod game;
mod js;
mod macros;
mod pieces;
mod player;
mod tile;
