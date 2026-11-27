# Battleship

A web Battleship game where you play as the commander of a warship's Combat Information Center (CIC). One large radar screen, one switch between the enemy waters and your own deck, and a computer opponent that hunts down your fleet.

**Live demo:** https://battleship-tau-tawny.vercel.app/

> **Status:** in development. Planning and design are complete, project tooling is set up (milestone M0), and the game engine is next (M1). The live demo currently shows the starter page.

## Concept

- **Command-center feel.** The battle screen is a single main display with a switch between **Enemy radar** and **Your deck**, instead of two boards side by side.
- **Two-step firing.** Click a cell to lock a target, then fire. No accidental shots.
- **Automatic view switching.** When the computer takes its turn, the view follows the action to your deck and returns afterwards.
- **Bilingual.** Indonesian and English, switchable at any time.
- **Accessible by design.** Hits, misses, and sunk ships are never distinguished by color alone, and the whole game is planned to be playable with a keyboard and with reduced motion.

## Planned MVP

- Player vs computer on a 10x10 board with the classic five-ship fleet
- Manual and random ship placement
- Computer opponent using a hunt/target strategy (no peeking at your ships)
- Missile, impact, and sinking animations
- Main menu, settings, how-to-play modal, and result screen

## Tech stack

| Area      | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Framework | React + TypeScript (strict) + Vite                        |
| State     | Zustand                                                   |
| Styling   | CSS Modules + CSS custom properties                       |
| Testing   | Vitest (coverage enforced on the engine)                  |
| Quality   | ESLint, Prettier, GitHub Actions CI                       |
| Hosting   | Vercel                                                    |

## Architecture in one paragraph

The game rules and the computer opponent live in `src/engine` as pure TypeScript with no React, DOM, timers, or global randomness. ESLint enforces this boundary. Because the engine is pure and its state is plain JSON, it is easy to test and can later run on a server for an online mode.

## Getting started

Requirements: Node.js 24 (used in development and CI) and npm.

```bash
git clone https://github.com/Leo-Ferdian/Battleship.git
cd Battleship
npm install
npm run dev
```

Then open the address printed in the terminal (usually http://localhost:5173).

## Scripts

| Command                 | What it does                                    |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start the development server                    |
| `npm run build`         | Type-check and build for production             |
| `npm run preview`       | Preview the production build locally            |
| `npm run lint`          | Run ESLint                                      |
| `npm run typecheck`     | Run the TypeScript compiler without emitting    |
| `npm run format`        | Format the code with Prettier                   |
| `npm run format:check`  | Check formatting without changing files         |
| `npm run test`          | Run the tests once                              |
| `npm run test:watch`    | Run the tests in watch mode                     |
| `npm run test:coverage` | Run the tests with coverage (thresholds apply)  |

## Documentation

The project was planned like a real product. The documents below (written in Indonesian) are in [`docs/`](docs/):

| Document                                                | Purpose                                               |
| ------------------------------------------------------- | ----------------------------------------------------- |
| [`PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)         | Entry point: status, decisions, next steps            |
| [`PRD.md`](docs/PRD.md)                                 | Product requirements and MVP scope                    |
| [`GAME_DESIGN.md`](docs/GAME_DESIGN.md)                 | Rules, computer opponent, ships, animations           |
| [`UX_FLOW.md`](docs/UX_FLOW.md)                         | Screens, wireframes, interaction details              |
| [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)             | Color tokens, typography, components                  |
| [`TECH_SPEC.md`](docs/TECH_SPEC.md)                     | Architecture, data model, testing, CI/CD              |
| [`IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) | Milestones M0 to M9                                   |

A standalone prototype of the ship artwork and animations is in [`docs/prototype-ships-animations.html`](docs/prototype-ships-animations.html). Open it in a browser.
