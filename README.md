# Snakes and Ladders 3D — Pokémon Edition

A 3D Snakes and Ladders game with a Pokémon theme. This repository contains a prototype/preview version using **Three.js** and **Vanilla JavaScript**, served by a simple Node.js server.

> **Note:** To view the full development plan for the React 19 and PixiJS version, please refer to [PLAN.md](PLAN.md).

## Requirements

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)

## How to run the project

This project utilises a minimalist static file server (`serve.js`) that requires no external dependencies (`npm install` is not necessary).

1. Open a terminal in the project folder.
2. Run the server:
   ```bash
   node serve.js
   ```
3. You will see a message indicating the server is running.
4. Open your web browser and visit:
   [http://localhost:3000/preview.html](http://localhost:3000/preview.html)

## Project Structure

- `preview.html`: Main entry point for the game (contains logic and Three.js rendering).
- `serve.js`: Simple HTTP server written in pure Node.js to serve the files.
- `models/`: 3D models (.obj, .mtl) for characters and game elements.
- `PLAN.md`: Design and planning document for the full version of the game.
- `*.mp3` / `*.ogg` / `*.jpg`: Audio resources and textures.

## Features (Preview)

- Interactive 3D board.
- Pokémon models.
- Sound effects (dice, movement, victory).
- Simple turn-based system.
