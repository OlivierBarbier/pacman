export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETE';

export interface Entity {
  id: string;
  type: 'PACMAN' | 'GHOST' | 'PELLET' | 'POWER_PELLET' | 'WALL';
  position: Position;
  direction: Direction;
  speed: number;
}

export interface Pacman extends Entity {
  type: 'PACMAN';
  isPoweredUp: boolean;
}

export type GhostState = 'CHASE' | 'SCATTER' | 'FRIGHTENED' | 'EATEN';

export type GhostColor = 'RED' | 'PINK' | 'CYAN' | 'ORANGE';

export interface Ghost extends Entity {
  type: 'GHOST';
  color: GhostColor;
  state: GhostState;
  targetPosition: Position;
}

export interface GameConfig {
  gridSize: number; // Size of one cell in pixels
  rows: number;
  cols: number;
  baseSpeed: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  pacman: Pacman;
  ghosts: Ghost[];
  grid: number[][]; // 0: empty, 1: wall, 2: pellet, 3: power pellet
}
