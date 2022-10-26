use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::board::{Direction, Position};

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Car {
    color: String,
    brand: String,
    car_type: CarType,
    wheels: u8,
    position: Position,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub enum CarType {
    OffRoad,
    Racing,
    Speeder,
}

#[wasm_bindgen]
impl Car {
    #[wasm_bindgen(constructor)]
    pub fn new(color: &str, brand: &str, car_type: CarType, wheels: u8) -> Car {
        Self {
            color: color.to_string(),
            brand: brand.to_string(),
            car_type,
            wheels,
            position: Position { x: 1, y: 1 },
        }
    }

    pub fn drive(&mut self, direction: Direction, distance: u8) {
        let (new_x, new_y) = match direction {
            Direction::North => (self.position.x - (distance as i32), self.position.y),
            Direction::East => (self.position.x, self.position.y + (distance as i32)),
            Direction::South => (self.position.x + (distance as i32), self.position.y),
            Direction::West => (self.position.x, self.position.y - (distance as i32)),
        };

        self.set_position(new_x, new_y);
    }

    pub fn set_position(&mut self, x: i32, y: i32) {
        self.position.x = x;
        self.position.y = y;
    }

    pub fn to_json(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }

    pub fn from_json(json: JsValue) -> Self {
        let car: Self = serde_wasm_bindgen::from_value(json).unwrap();
        car
    }
}

// trait Json {
//     fn to_json(&self) -> JsValue;
//     fn from_json(json: JsValue) -> Self;
// }

// impl Json for Car {
//     fn to_json(&self) -> JsValue {
//         serde_wasm_bindgen::to_value(&self).unwrap()
//     }

//     fn from_json(json: JsValue) -> Self {
//         let car: Self = serde_wasm_bindgen::from_value(json).unwrap();
//         car
//     }
// }
