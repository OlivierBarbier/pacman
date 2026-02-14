import { create } from 'zustand';
import { GameStatus, Direction, Pacman, Ghost } from '../types';

interface GameStore {
  status: GameStatus;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  pacman: Pacman;
  ghosts: Ghost[];
  grid: number[][];
  
  setStatus: (status: GameStatus) => void;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  resetGame: () => void;
  updatePacmanPosition: (x: number, y: number) => void;
  setDirection: (direction: Direction) => void;
}

const INITIAL_STATE = {
  status: 'IDLE' as GameStatus,
  score: 0,
  highScore: 0,
  lives: 3,
  level: 1,
  pacman: {
    id: 'pacman',
    type: 'PACMAN' as const,
    position: { x: 1, y: 1 },
    direction: 'RIGHT' as Direction,
    speed: 0.1, // Grid units per frame
    isPoweredUp: false,
  },
  ghosts: [],
  grid: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ], // Placeholder grid
};

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_STATE,
  
  setStatus: (status) => set({ status }),
  setScore: (score) => set({ score }),
  setLives: (lives) => set({ lives }),
  resetGame: () => set({ ...INITIAL_STATE }),
  
  updatePacmanPosition: (x, y) => set((state) => ({
    pacman: { ...state.pacman, position: { x, y } }
  })),
  
  setDirection: (direction) => set((state) => ({
    pacman: { ...state.pacman, direction }
  })),
}));
