import { create } from 'zustand';
import { GameStatus, Pacman, Ghost, Pellet, Fruit } from '../engine/types';

interface GameState {
    status: GameStatus;
    score: number;
    highScore: number;
    level: number;
    lives: number;
    
    pelletsEaten: number;
    
    pacman: Pacman;
    ghosts: Ghost[];
    pellets: Pellet[];
    fruits: Fruit[];
    
    powerModeTimeLeft: number;
    comboMultiplier: number; // For eating ghosts in succession

    // Actions
    setStatus: (status: GameStatus) => void;
    addScore: (points: number) => void;
    setPowerMode: (active: boolean, duration?: number) => void;
    decrementPowerModeTime: (delta: number) => void;
    resetLevel: () => void;
    nextLevel: () => void;
    loseLife: () => void;
    resetGame: () => void;
    
    // Entity Updates (called by systems)
    updatePacman: (pacman: Partial<Pacman>) => void;
    updateGhost: (id: string, ghost: Partial<Ghost>) => void;
    removePellet: (id: string) => void;
    setGhosts: (ghosts: Ghost[]) => void;
    addFruit: (fruit: Fruit) => void;
    removeFruit: (type: string) => void;
}

const INITIAL_PACMAN: Pacman = {
    id: 'pacman',
    position: { x: 0, y: 0 }, // To be set by level loader
    velocity: { x: 0, y: 0 },
    direction: 'NONE',
    speed: 0,
    radius: 10,
    lives: 3,
    isPoweredUp: false
};

export const useGameStore = create<GameState>((set) => ({
    status: GameStatus.IDLE,
    score: 0,
    highScore: parseInt(localStorage.getItem('pacman_highscore') || '0'),
    level: 1,
    lives: 3,
    pelletsEaten: 0,
    
    pacman: { ...INITIAL_PACMAN },
    ghosts: [],
    pellets: [],
    fruits: [],
    
    powerModeTimeLeft: 0,
    comboMultiplier: 1,

    setStatus: (status) => set({ status }),
    
    addScore: (points) => set((state) => {
        const newScore = state.score + points;
        const newHighScore = Math.max(newScore, state.highScore);
        localStorage.setItem('pacman_highscore', newHighScore.toString());
        return { score: newScore, highScore: newHighScore };
    }),
    
    setPowerMode: (active, duration = 0) => set((state) => ({
        pacman: { ...state.pacman, isPoweredUp: active },
        powerModeTimeLeft: duration,
        comboMultiplier: active ? 1 : state.comboMultiplier,
        ghosts: state.ghosts.map(g => ({
            ...g,
            state: active ? 'FRIGHTENED' : 'SCATTER', // Simplified transition
            frightenedTimer: active ? duration : 0
        }))
    })),
    
    decrementPowerModeTime: (delta) => set((state) => {
        if (state.powerModeTimeLeft <= 0) return {};
        const newTime = Math.max(0, state.powerModeTimeLeft - delta);
        if (newTime === 0) {
            // End power mode
            return {
                powerModeTimeLeft: 0,
                pacman: { ...state.pacman, isPoweredUp: false },
                ghosts: state.ghosts.map(g => ({
                    ...g,
                    state: g.state === 'FRIGHTENED' ? 'CHASE' : g.state // Revert to previous logic ideally, but CHASE for now
                }))
            };
        }
        return { powerModeTimeLeft: newTime };
    }),

    resetLevel: () => set((_state) => ({
        // Reset positions would go here, driven by LevelSystem
        status: GameStatus.IDLE,
        pelletsEaten: 0,
        fruits: []
    })),

    nextLevel: () => set((state) => ({
        level: state.level + 1,
        status: GameStatus.IDLE,
        pelletsEaten: 0,
        fruits: []
    })),

    loseLife: () => set((state) => {
        const newLives = state.lives - 1;
        return {
            lives: newLives,
            status: newLives <= 0 ? GameStatus.GAME_OVER : GameStatus.IDLE
        };
    }),

    resetGame: () => set({
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.IDLE,
        pacman: { ...INITIAL_PACMAN },
        pelletsEaten: 0,
        fruits: []
    }),

    updatePacman: (updates) => set((state) => ({
        pacman: { ...state.pacman, ...updates }
    })),

    updateGhost: (id, updates) => set((state) => ({
        ghosts: state.ghosts.map(g => g.id === id ? { ...g, ...updates } : g)
    })),

    removePellet: (id) => set((state) => ({
        pellets: state.pellets.filter(p => p.id !== id),
        pelletsEaten: state.pelletsEaten + 1
    })),
    
    setGhosts: (ghosts) => set({ ghosts }),
    
    addFruit: (fruit) => set((state) => ({ fruits: [...state.fruits, fruit] })),
    
    removeFruit: (type) => set((state) => ({ fruits: state.fruits.filter(f => f.type !== type) }))
}));
