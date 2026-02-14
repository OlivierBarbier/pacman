import { useGameStore } from '../store/gameStore';
import { GameStatus } from './types';

interface LevelConfig {
    pacmanSpeed: number;
    ghostSpeed: number;
    powerPelletDuration: number;
    fruitType: 'CHERRY' | 'STRAWBERRY' | 'ORANGE';
    // Map layout could be here too
}

export class LevelSystem {
    private levels: Record<number, LevelConfig> = {
        1: {
            pacmanSpeed: 100, // Pixels per second?
            ghostSpeed: 75,
            powerPelletDuration: 6000,
            fruitType: 'CHERRY'
        },
        2: {
            pacmanSpeed: 105,
            ghostSpeed: 85,
            powerPelletDuration: 5000,
            fruitType: 'STRAWBERRY'
        },
        3: {
            pacmanSpeed: 110,
            ghostSpeed: 95,
            powerPelletDuration: 4000,
            fruitType: 'ORANGE'
        }
    };

    loadLevel(levelNum: number) {
        const store = useGameStore.getState();
        const config = this.levels[levelNum] || this.levels[3]; // Fallback to level 3 difficulty

        // Reset entities with new speeds
        store.updatePacman({ 
            speed: config.pacmanSpeed,
            position: { x: 400, y: 400 }, // Mock start pos
            direction: 'NONE'
        });
        
        // Reset Ghosts
        store.setGhosts([
            { id: 'blinky', type: 'BLINKY', position: { x: 300, y: 300 }, velocity: {x:0,y:0}, direction: 'LEFT', speed: config.ghostSpeed, radius: 10, state: 'SCATTER', frightenedTimer: 0, targetPosition: {x:0,y:0} },
            // Add other ghosts...
        ]);

        // Reset Pellets (reload map)
        // store.setPellets(generateMapPellets()); // Need map generator
        
        // store.setPowerModeDuration(config.powerPelletDuration); // Store helper if exists
    }
    
    checkLevelComplete() {
        const store = useGameStore.getState();
        if (store.pellets.length === 0 && store.status === GameStatus.PLAYING) {
            store.setStatus(GameStatus.LEVEL_COMPLETE);
            // Start intermission, then nextLevel()
            setTimeout(() => {
                store.nextLevel();
                this.loadLevel(store.level); // Load new level data
                store.setStatus(GameStatus.PLAYING);
            }, 3000);
        }
    }
}
