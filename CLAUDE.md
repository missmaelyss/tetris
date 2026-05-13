# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # Vite dev server on port 3000 (proxies socket.io → 4001)
npm start            # Express server on port 4001 (serves the production build)
npm run build        # build the React client to /build (required before npm start)
npm test             # run the test suite in watch mode
npm run coverage     # run tests once with coverage report
```

**Development workflow (two terminals):**
```bash
# Terminal 1 — backend
npm start

# Terminal 2 — frontend with hot reload
npm run dev
# → open http://localhost:3000
```

**Production workflow (one terminal):**
```bash
npm run build && npm start
# → open http://localhost:4001
```

To run a single test file:
```bash
npm test -- --testPathPattern=Game
```

## Architecture

This is a **multiplayer browser Tetris** (RedTetris) using a React frontend and a Node/Socket.IO backend. There is no separate API — all real-time game communication goes through a single Socket.IO connection.

### Server (`src/server/`)

- `index.js` — Express + Socket.IO entry point. Maintains a `Games[]` array in memory. Each socket connection resolves to an existing `Game` or creates a new one, identified by `?room=` and `?name=` query params. All game events are handled here and dispatched to the appropriate `Game` instance.
- `objects/Game.js` — Room-level state machine. Holds a list of `Player` instances, manages game status (`waiting` → `started` → `ended`), runs the game loop (`setInterval` at 500ms), and broadcasts state via `sendToAll`. Only the creator (permission `2`) can start/reset/invite spectators.
- `objects/Player.js` — Per-player state: grid (flat `Array(200)`, 10×20), current piece, next piece, score, spectrum, pause, lines-to-add. Contains all collision detection (`checkPiece`, `checkBottom`), line clearing (`checkLines`), and the malus-lines mechanic (`addBottomLines`).
- `objects/Piece.js` — Piece definition with rotation. The `PiecePool` array (duplicated in `Player.js`) defines all 7 tetrominoes as rotation matrices. Pieces use numeric color IDs 1–7; 8 = dead grey; 9 = spectrum marker.

**Permission levels:** `0` = spectator, `1` = player, `2` = creator/owner.

**Grid encoding:** flat array of 200 integers. Index formula: `col + row * 10`. Color `0` = empty.

**Piece seeding:** uses `random-seed` keyed on the room ID so all players in a room receive the same piece sequence.

### Client (`src/client/`)

- `index.js` — Redux store setup + React render root (the Redux actions in `actions/index.js` are boilerplate stubs and not actually used by the game — all state is managed via local `useState` hooks and Socket.IO events).
- `components/App.js` — HashRouter with two routes: `/` → `Home`, `/:room[:username]` → `Game`.
- `components/Game.js` — Main game view. Creates the Socket.IO connection once (module-level `socket` variable). Listens to three server events: `gameStatus` (room phase), `players` (all grids), `me` (own grid + score + piece). Handles keyboard and touch input.
- `components/Lobby.js` — Pre-game UI shown during `waiting` and `ended` phases. Lets the creator configure spectrum mode and malus-lines mode (0 = none, 1 = destructible, 2 = indestructible) and emit `start`/`reset`/`switchSpectators`.
- `components/Grid.js` — Renders a player's 10×20 grid plus a 4×4 next-piece preview. Color index → CSS class name via `COLORS` array.
- `components/Tail.js` — Single cell; CSS class drives color.

### Tests (`test/`)

Uses Jest + Enzyme + Chai + Sinon. Tests cover server objects (`Game.spec.js`, `Grid.spec.js`, `Tail.spec.js`) and client components (`App.spec.js`, `Home.spec.js`, `Lobby.spec.js`). `setupTests.js` configures Enzyme and Sinon-Chai.

### Key data flows

1. Player joins → server creates/joins `Game`, sends `gameStatus` + `me`
2. Creator starts → `Game.startGame()` sets piece seed, calls `gameLoop()` (500ms tick)
3. Each tick → `gameTick()` advances all active players, detects losses, broadcasts `players` event with all grids
4. Player moves/rotates/drops → server `move()` mutates grid in-place, calls `player.sendMyInfo()` which emits `me` only to that player
5. Line clear → `addLinesExcept()` queues malus lines for all other players; applied next tick via `addBottomLines()`
