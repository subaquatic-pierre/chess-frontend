use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;
use web_sys::window;

pub fn random_number() -> u8 {
    console_error_panic_hook::set_once();
    let mut bytes = [0u8; 1];
    let window = window().expect("no global `window` exists");
    let crypto = window.crypto().expect("no `crypto` exists");

    let buffer = crypto.get_random_values_with_u8_array(&mut bytes).unwrap();
    let arr = Uint8Array::new(&buffer);

    let bytes: Vec<u8> = arr.to_vec();

    let mut buf: [u8; 1] = [0u8; 1];

    for i in (0..4).rev() {
        match bytes.get(i) {
            Some(byte) => buf[i] = *byte,
            None => continue,
        }
    }

    u8::from_be_bytes(buf)
}
