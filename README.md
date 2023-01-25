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

1. Fix short castle on MoveResult when long castle string passed to MoveParser (showing true, should be false)
2. Fix to_coord on MoveResult on piece promote when string passed to MoveParser (showing undefined)
