# Flip7 Scorer

A lightweight score tracker for the [Flip7](https://officialgamerules.org/game-rules/flip-7-rules/) card game. Built with React and TypeScript, deployable to GitHub Pages, and installable as a Progressive Web App on mobile devices.

**Live site:** https://rafaelnferreira.github.io/flip7-scorer/

## Features

- Set up 2–10 players with custom names
- Enter numeric round scores (mobile numeric keyboard supported)
- Cumulative totals tracked automatically
- Game ends when any player reaches 200 points after a round
- Winner screen with Play Again or New Game options
- Progress saved in browser (survives refresh)
- All-time victory counts per player stored in localStorage
- **Scores** screen: flip between games (Flip7 by default), +/− win counters per player, total and per-game win badges
- Add custom games (e.g. Magic the Gathering); player roster shared from Play setup
- Installable PWA for offline use
- Compact Scores UI sized for a quarter of an iPad screen

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/flip7-scorer/ in your browser.

## Build & Preview

```bash
npm run build
npm run preview
```

## GitHub Pages Deployment

Pushes to `main` automatically deploy via GitHub Actions (`.github/workflows/deploy.yml`).

To enable GitHub Pages:

1. Go to **Settings → Pages**
2. Set source to **Deploy from branch**
3. Select branch **`gh-pages`** and folder **`/ (root)`**

## Install as PWA

On mobile (Chrome/Safari) or desktop Chrome, use **Add to Home Screen** or the install prompt to add Flip7 Scorer as a standalone app.

## How to Play

1. Enter the number of players and optional names
2. After each Flip7 round, type each player's score and tap **Finish Round**
3. Leave a field blank for a bust (0 points)
4. First player to reach 200 points wins
