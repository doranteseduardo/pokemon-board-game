<div align="center">

# Snakes and Ladders 3D

**A Pokémon-themed 3D board game**

[![Three.js](https://img.shields.io/badge/Three.js-r3f-black?style=flat-square&logo=threedotjs)](https://threejs.org/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-static%20server-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)](LICENSE)

Interactive 3D Snakes & Ladders with Pokémon 3D models, audio effects, and a turn-based multiplayer system. This repository is a prototype built with Three.js and Vanilla JS. A full React 19 + PixiJS version is planned in `PLAN.md`.

</div>

---

## What it does

| Feature | Description |
|---|---|
| **3D Board** | Interactive three-dimensional game board rendered with Three.js |
| **Pokémon Models** | 3D .obj/.mtl models — Articuno, Piplup, Torchic, Mewtwo as player pieces |
| **Turn-based system** | Multi-player turns with dice roll mechanics |
| **Audio** | Sound effects for dice, snake, ladder, jump, victory, and background music |

---

## Stack

| Layer | Technology |
|---|---|
| Renderer | Three.js |
| Logic | Vanilla JavaScript |
| Server | Node.js static file server (no dependencies) |
| Assets | .obj / .mtl 3D models · .mp3 / .ogg audio |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 14+

```bash
# No npm install required — zero external dependencies
node serve.js
```

Open `http://localhost:3000/preview.html` in your browser.

---

## Architecture

```
SerpientesEscaleras/
├── preview.html          # Game entrypoint — Three.js rendering + game logic
├── serve.js              # Zero-dependency static HTTP server
├── models/               # 3D character models (.obj, .mtl)
│   ├── articuno/
│   ├── piplup/
│   ├── torchic/
│   └── mewtwo/
├── *.mp3 / *.ogg         # Sound effects and BGM
├── *.jpg                 # Textures
└── PLAN.md               # Design doc for full React 19 + PixiJS version
```

---

## Roadmap

```
[x] 3D board with Three.js
[x] Pokémon .obj model rendering
[x] Dice roll mechanics
[x] Turn-based multiplayer (local)
[x] Sound effects and BGM
[ ] React 19 + PixiJS rewrite (see PLAN.md)
[ ] Online multiplayer
[ ] Mobile touch support
[ ] Animated piece movement
```

---

<div align="center">
  <sub>Fan project · Not affiliated with Nintendo, Game Freak, or The Pokémon Company · MIT License</sub>
</div>
