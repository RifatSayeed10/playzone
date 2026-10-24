# PlayZone – Free Online Games Portal

A modern, responsive, high-performance browser gaming platform built for Web Engineering lab demonstration. PlayZone delivers zero-install, instant playable HTML5 Canvas games, real-time local leaderboards, an admin management dashboard, and Google AdSense-ready advertisement architecture.

---

## 🎮 Features Overview

### 1. Fully Playable Browser Games
- **Neon Snake Arena**: Responsive Canvas game with glowing trail graphics, particle effects on food collection, dynamic speed ramping, and mobile touch D-Pad.
- **Cyber Breakout**: Paddle and ball physics engine with multi-colored bricks, durable 2-hit blocks, particle shatter explosions, and lives tracking.
- **Neon Tic-Tac-Toe**: AI opponent powered by the **Minimax Algorithm** (Unbeatable), Casual AI mode, and local 2-Player pass-and-play.
- **Arcade Memory Matrix**: 4x4 card grid with 3D flip effects, gaming icon pairs, timer, move counter, and performance scoring.
- **15-Tile Quantum Slide**: Sliding tile puzzle with guaranteed solvable scramble logic, move tracker, stopwatch, and keyboard/touch navigation.
- **Turbo Nitro Velocity**: Arcade traffic racer with lane switching, nitro boost, and collision detection.
- **External Web Game Runner**: Sandboxed iframe runner (`allow-scripts allow-same-origin`) for third-party HTML5 games with fallback handling.

### 2. Audio & Visual Delight
- **Synthesized 8-Bit Web Audio**: Pure native browser sound effects using the Web Audio API (`AudioContext`) for clicks, coin chimes, ball bounces, and game over sounds—no external MP3 downloads required.
- **Theme Palette**: Deep Cyber Navy (`#0B1020`), Card Slate (`#172033`), Neon Purple (`#8B5CF6`), and Cyber Cyan (`#06B6D4`).
- **Confetti Victory Celebrations**: Dynamic canvas confetti bursts on high scores and game completion.

### 3. Complete Portal Pages
- **Home (`/`)**: Hero banner, category quick links, popular games, new games, AdSense placeholders, premium teaser, and leaderboard podium.
- **All Games (`/games`)**: Real-time search, category filtering, multi-parameter sorting (Popular, Newest, Rating, A-Z), and empty search states.
- **Game Details (`/game/:id`)**: Canvas play zone, fullscreen mode, live score tracking, personal bests, controls guide, instructions, related games, and Ad slot.
- **Leaderboards (`/leaderboard`)**: Hall of Fame podium (🥇 1st, 🥈 2nd, 🥉 3rd), filterable by game, with local storage persistence.
- **Admin Dashboard (`/admin`)**:
  - Live statistics: Total games, total plays, featured count, top game.
  - Game catalog CRUD: Add new game, edit existing game, delete game, toggle featured status.
  - Category manager: Add custom categories with game counts.
  - Restore Defaults button for lab grading.
- **About (`/about`)**: Architectural highlights and university lab project credits.
- **Contact (`/contact`)**: Form validation, feedback persistence, and interactive FAQ accordion.
- **Legal (`/privacy` & `/terms`)**: Comprehensive terms and privacy documentation.
- **PlayZone Premium (`/premium`)**: Ad-free membership showcase and VIP waitlist.
- **404 Not Found**: Cyber-themed error page with quick links back to the arcade.

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Technology Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Graphics**: HTML5 Canvas (60 FPS Game Loops)
- **Audio**: Web Audio API Sound Synthesizer
- **Storage**: Browser LocalStorage Engine with Custom Event Synchronization
