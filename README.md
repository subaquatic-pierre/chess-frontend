# Chess Frontend

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

1. Fix king able to move to either of king castle square if castle option is no longer valid

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

4. Use single component in frontend for controls

5. Currently server does not support maintaining socket sessions
   across multiple tabs or between page refreshes

   - Save session profile in server, check last heartbeat on interval for each session
     if heartbeat is over time, clear session from server. This will allow clients to
     continue session between page reloads, which terminate session connection by protocol.

6. Separate GameManager from ChatServer, create RoomManager
   to handle room logic and GameManager to handle game logic, both
   can be contained by ChatServer

7. Better way to update received messages from the server

- currently an interval is set on the components to query a message list
  which i a ref object on the ConnectionContext. This is needed because React
  fails to update DOM on each socket message received. If messages are received
  in quick succession the state is not updated effectively.

8. Update active room and game join logic on frontend. Currently the room or game
   is changed before confirmation from the server.

## Features

1. User profile create
2. Save game in backend storage
3. Add game timer
4. Chat box between players on same game
