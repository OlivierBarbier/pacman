export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export interface Position {
    x: number;
    y: number;
}

export interface Entity {
    id: string;
    position: Position;
    velocity: Position;
    direction: Direction;
    speed: number;
    radius: number;
}

export interface Pacman extends Entity {
    lives: number;
    isPoweredUp: boolean;
}

export type GhostState = 'SCATTER' | 'CHASE' | 'FRIGHTENED' | 'EATEN';

export interface Ghost extends Entity {
    type: 'BLINKY' | 'PINKY' | 'INKY' | 'CLYDE';
    state: GhostState;
    frightenedTimer: number;
    targetPosition: Position;
}

export interface Pellet {
    id: string;
    position: Position;
    isPowerPellet: boolean;
    isEaten: boolean;
}

export interface Fruit {
    type: 'CHERRY' | 'STRAWBERRY' | 'ORANGE';
    position: Position;
    points: number;
    active: boolean;
    timer: number;
}

export enum GameStatus {
    IDLE = 'IDLE',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
    LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}
