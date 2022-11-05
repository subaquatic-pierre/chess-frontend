#! /bin/bash

cargo watch -i .gitignore -i "pkg/*" -i "www/*" -s "wasm-pack build" && \\
cd www && \\
npm watch
