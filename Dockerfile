FROM rust:1-buster as rust-builder

WORKDIR /app

COPY Cargo.toml /app/
COPY src/ /app/src

RUN pwd && ls -l

RUN cargo install wasm-pack
RUN wasm-pack build

FROM node:20-slim as node-builder

WORKDIR /app
RUN npm install gatsby-cli -g

COPY --from=rust-builder /app/pkg /app/pkg/
COPY . .

WORKDIR /app/www
RUN pwd && ls -l
RUN . ./.env.production
RUN npm install --force
RUN npm run build

FROM node:20-alpine
USER node
ENV GATSBY_TELEMETRY_DISABLED=1
COPY --from=node-builder --chown=node:node /app/ /app/
RUN rm -rf ./src
WORKDIR /app/www

EXPOSE 9000
CMD [ "node_modules/.bin/gatsby","serve","-H","0.0.0.0","-p","9000" ]




