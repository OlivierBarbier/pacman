import { Position } from './Pathfinding';

export enum GhostType {
  BLINKY = 'BLINKY',
  PINKY = 'PINKY',
  INKY = 'INKY',
  CLYDE = 'CLYDE'
}

export enum GhostMode {
  CHASE = 'CHASE',
  SCATTER = 'SCATTER',
  FRIGHTENED = 'FRIGHTENED',
  EATEN = 'EATEN'
}

export interface GhostState {
  id: string;
  type: GhostType;
  position: Position;
  direction: Position; // Current movement vector
  mode: GhostMode;
  target: Position;
  speedMultiplier: number;
}

export class GhostAI {
  private static readonly SCATTER_CORNERS: Record<GhostType, Position> = {
    [GhostType.BLINKY]: { x: 25, y: -3 }, // Top Right (approx)
    [GhostType.PINKY]: { x: 2, y: -3 },   // Top Left
    [GhostType.INKY]: { x: 27, y: 32 },   // Bottom Right
    [GhostType.CLYDE]: { x: 0, y: 32 }    // Bottom Left
  };

  /**
   * Calculates the target position for a ghost based on its type, mode and game state.
   */
  public static calculateTarget(
    ghost: GhostState,
    pacman: { position: Position, direction: Position },
    blinkyPosition: Position | null, // Required for Inky
    _level: number = 1
  ): Position {
    // 1. Handle modes that override target logic
    if (ghost.mode === GhostMode.SCATTER) {
      // Clyde has a special check even in Scatter? No, Clyde's scatter is just his corner.
      // But Clyde's logic says "Si distance > 8: Chase, Sinon: Scatter". 
      // The prompt says: "d) CLYDE ... Alterne Chase/Scatter".
      // "Si distance à Pacman > 8 tuiles: Target = Pacman; Sinon: Target = coin... (Scatter)"
      // This logic usually applies in CHASE mode for Clyde (he acts like he is scattering when close).
      // But if the GLOBAL mode is Scatter, he should probably scatter to his corner regardless.
      // Standard Pacman rules: In Scatter, they go to corners.
      return GhostAI.SCATTER_CORNERS[ghost.type];
    }

    if (ghost.mode === GhostMode.FRIGHTENED) {
      // Target is random or handled by movement logic (pseudo-random turns)
      // Usually Frightened ghosts don't have a specific target, they turn random at intersections.
      // We can return a null or current position to indicate "no target".
      // But for A*, we might need a target.
      // Let's assume the Movement logic handles Frightened randomness.
      return ghost.position; 
    }

    if (ghost.mode === GhostMode.EATEN) {
      // Target is the ghost house (center of map)
      return { x: 13, y: 14 }; // Example coordinates of Ghost House
    }

    // 2. CHASE MODE Logic
    switch (ghost.type) {
      case GhostType.BLINKY:
        return pacman.position;

      case GhostType.PINKY:
        // Target = 4 tiles ahead of Pacman
        return {
          x: pacman.position.x + (pacman.direction.x * 4),
          y: pacman.position.y + (pacman.direction.y * 4)
        };

      case GhostType.INKY:
        if (!blinkyPosition) return pacman.position; // Fallback
        
        // 1. Point 2 tiles ahead of Pacman
        const pivotX = pacman.position.x + (pacman.direction.x * 2);
        const pivotY = pacman.position.y + (pacman.direction.y * 2);
        
        // 2. Vector from Blinky to Pivot
        const vectorX = pivotX - blinkyPosition.x;
        const vectorY = pivotY - blinkyPosition.y;
        
        // 3. Double the vector from Blinky
        return {
          x: blinkyPosition.x + (vectorX * 2),
          y: blinkyPosition.y + (vectorY * 2)
        };

      case GhostType.CLYDE:
        const dist = Math.sqrt(
          Math.pow(ghost.position.x - pacman.position.x, 2) + 
          Math.pow(ghost.position.y - pacman.position.y, 2)
        );
        
        if (dist > 8) {
          return pacman.position;
        } else {
          return GhostAI.SCATTER_CORNERS[GhostType.CLYDE];
        }
    }
  }
}

export class GhostModeScheduler {
  private _level: number;
  private currentPhaseIndex: number = 0;
  private timer: number = 0;
  private isPermanentChase: boolean = false;
  
  // Level 1 timings (approx)
  private readonly PHASES = [
    { mode: GhostMode.SCATTER, duration: 7000 },
    { mode: GhostMode.CHASE, duration: 20000 },
    { mode: GhostMode.SCATTER, duration: 7000 },
    { mode: GhostMode.CHASE, duration: 20000 },
    { mode: GhostMode.SCATTER, duration: 5000 },
    { mode: GhostMode.CHASE, duration: 20000 },
    { mode: GhostMode.SCATTER, duration: 5000 },
    { mode: GhostMode.CHASE, duration: -1 } // Permanent
  ];

  constructor(level: number) {
    this._level = level;
    // logic to adjust phases based on level could go here
    // Suppress unused variable warning - will be used for difficulty scaling
    void this._level;
  }

  public update(dt: number): GhostMode | null {
    if (this.isPermanentChase) return GhostMode.CHASE;

    this.timer += dt;
    const phase = this.PHASES[this.currentPhaseIndex];

    if (phase.duration !== -1 && this.timer >= phase.duration) {
      this.timer = 0;
      this.currentPhaseIndex++;
      
      if (this.currentPhaseIndex >= this.PHASES.length) {
        this.isPermanentChase = true;
        return GhostMode.CHASE;
      }
      
      return this.PHASES[this.currentPhaseIndex].mode;
    }
    
    // Return null if no change
    return null;
  }
  
  public getCurrentMode(): GhostMode {
      return this.isPermanentChase ? GhostMode.CHASE : this.PHASES[this.currentPhaseIndex].mode;
  }
  
  public reset() {
      this.currentPhaseIndex = 0;
      this.timer = 0;
      this.isPermanentChase = false;
  }
}
