use wasm_bindgen::prelude::*;

mod board;
mod car;
mod dom;
mod js;
mod macros;
mod util;

use dom::change_dom;

#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    change_dom()?;
    Ok(())
}
