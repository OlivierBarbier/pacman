# Pacman React

A modern Pacman implementation using React, TypeScript, and Vite.

## Architecture

- **Engine**: Custom game loop using `requestAnimationFrame`.
- **State Management**: Zustand for global game state (score, lives, level).
- **Events**: Custom Event Bus for decoupled game events.
- **Styling**: Tailwind CSS with custom neon theme.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Structure

- `src/components/`: UI and Game components.
- `src/engine/`: Game logic and loop.
- `src/hooks/`: Custom hooks (useGameLoop, useInput).
- `src/store/`: Zustand store.
- `src/types/`: TypeScript definitions.
- `src/utils/`: Helpers and Event Bus.
