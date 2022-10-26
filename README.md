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
