import { useGameStore } from '../store/gameStore';
import { Entity } from './types';
import { PowerPelletSystem } from './PowerPelletSystem';

export class CollisionSystem {
    private powerPelletSystem: PowerPelletSystem;
    private mapWidth: number = 0; // Should be set based on level data
    private _mapHeight: number = 0;

    constructor(powerPelletSystem: PowerPelletSystem) {
        this.powerPelletSystem = powerPelletSystem;
    }

    setMapSize(width: number, height: number) {
        this.mapWidth = width;
        this._mapHeight = height;
        // Suppress unused variable warning - will be used for boundary checks
        void this._mapHeight;
    }

    update() {
        const store = useGameStore.getState();
        const { pacman, ghosts, pellets, level } = store;

        // 1. Pacman vs Pellets
        // Optimization: spatial partition or grid lookup is better, but simple distance check for now
        // assuming pellets are static and grid aligned, simple AABB or distance
        const eatenPellet = pellets.find(p => this.checkCollision(pacman, { ...p, radius: 5, velocity: {x:0,y:0}, direction: 'NONE', speed: 0, id: p.id })); // Mocking pellet as entity
        
        if (eatenPellet) {
            store.removePellet(eatenPellet.id);
            
            if (eatenPellet.isPowerPellet) {
                store.addScore(50);
                this.powerPelletSystem.activate(level);
            } else {
                store.addScore(10);
            }
            
            // Check Level Complete
            if (store.pellets.length <= 1) { // 1 because we just removed one but the state update might be async or buffered (Zustand is sync but good to be safe)
                 // Actually Zustand is sync. Logic: if pellets.length - 1 === 0
                 // But better handled in GameLoop or LevelSystem checking total pellets
            }
        }

        // 2. Pacman vs Ghosts
        const hitGhost = ghosts.find(g => this.checkCollision(pacman, g));
        if (hitGhost) {
            if (hitGhost.state === 'FRIGHTENED') {
                // Eat Ghost
                store.addScore(200 * store.comboMultiplier); // Logic for doubling needed
                store.updateGhost(hitGhost.id, { state: 'EATEN', targetPosition: { x: 100, y: 100 } }); // Send home (mock pos)
                // store.setComboMultiplier(store.comboMultiplier * 2); // Need to add this action to store
            } else if (hitGhost.state === 'EATEN') {
                // Ignore
            } else {
                // Pacman dies
                store.loseLife();
                // Reset positions
            }
        }
        
        // 3. Pacman vs Fruit
        // ...
        
        // 4. Wrap around (Tunnel)
        this.handleWrapAround(pacman, store.updatePacman);
        ghosts.forEach(g => this.handleWrapAround(g, (u) => store.updateGhost(g.id, u)));
    }

    private checkCollision(a: Entity, b: Entity): boolean {
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (a.radius + b.radius);
    }
    
    private handleWrapAround(entity: Entity, updateFn: (u: Partial<Entity>) => void) {
        // Assuming map is centered or 0,0 based.
        // If mapWidth is set.
        if (this.mapWidth > 0) {
            if (entity.position.x < -entity.radius) {
                updateFn({ position: { ...entity.position, x: this.mapWidth + entity.radius } });
            } else if (entity.position.x > this.mapWidth + entity.radius) {
                updateFn({ position: { ...entity.position, x: -entity.radius } });
            }
        }
    }
}
