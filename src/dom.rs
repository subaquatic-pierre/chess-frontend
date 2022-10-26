use wasm_bindgen::prelude::*;

use crate::console_log;
use crate::util::random_number;

pub fn change_dom() -> Result<(), JsValue> {
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    let div = document.get_element_by_id("rust");

    match div {
        Some(el) => {
            // do something with element
            let num = random_number();
            el.set_inner_html(&format!("<p>Cool Life, random Number: 42{}</p>", num));
            console_log!("Element found");
        }
        None => {
            console_log!("Element not founD!!!!!!");
        }
    }

    Ok(())
}
