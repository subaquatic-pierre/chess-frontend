# WASM Gatsby Starter

Starter code for developing WebAssembly using Rust

The main technologies rely on wasm-pack to bundle the WASM into the NPM distributable `pkg` directory.

## Installation

1. Clone the repo

```sh
git clone
```

2. install wasm-pack

```sh
cargo install wasm-pack
```

3. Run wasm-pack build first time

```sh
wasm-pack build
```

4. link WASM library with NPM

```sh
cd pkg
npm link
```

5. install frontend NPM deps

```sh
cd ../www
npm install
```

## Development

1. start wasm-pack with cargo watch

```sh
cargo watch -i .gitignore -i "pkg/*" -i "www/*" -s "wasm-pack build"
```

- **note: I would suggest creating alias in .bashrc config for this command.
  currently `wasm-pack` does not support watch mode for Development**

2. start gatsby development server with `npm-watch`, to watch for changes to `pkg`

```sh
cd www
npm run watch
```

### Notes:

- editing Rust files will cause wasm-pack to rebuild and bundle WASM in `pkg` directory,
  this will cause `gatsby` development server to restart. **_You may need to refresh browser if
  Gatsby developemnt server caches WASM_**

- editing React files will cause `gatsby` development server to hot-reload
  as usual.

- `gatsby` development server may throw error on WASM pack hot-reload. Just
  reload the browser to clear the error

## Tools

1. wasm-pack
2. Gatsby JS
3. `serde` crate

- note: Rust struct can be serialized and deserialized with `serde`
  an example usage is withing the `car.rs` module.

## Moves

0.e2e4 f7f5
1.Nb1c3 c7c5
2.Bf1b5 c5c4
3.b2b3 c4xb3
4.Bb5xd7+ Bc8xd7
5.g2g4 f5xg4
6.Nc3d5 g4g3
7.Qd1f3 a7a6
8.c2c4 b3b2
9.a2a3 b2b1=Q
10.e4e5 a6a5
11.Qb1f5 g7g6
12.Qf5f7#

## TODO:

1. Fix why move string not showing check after promote

## Improvements

1. Fix piece move logic in board container react component, ie. promote piece

- Should call is promote piece first
- if true, open modal
- then move move in game container
- should create get pre-move result on board, can be used to get move result before
  updating board

2. Encapsulate board logic in game proxy methods

- all board actions should be made through game proxy methods
- get rid of JS handler methods, use only wasm to handle game state

3. Split `board.handle_move_piece` method

- method is too long and complicated
- split method into smaller parts to be used around moving a piece

## Features

1. User profile create
2. Save game in backend storage
3. Add game timer
4. Chat box between players on same game
