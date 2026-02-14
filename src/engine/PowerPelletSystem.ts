import { useGameStore } from '../store/gameStore';

export class PowerPelletSystem {
    private static readonly BASE_DURATION_MS = 6000;

    update(dt: number) {
        const store = useGameStore.getState();
        
        if (store.powerModeTimeLeft > 0) {
            // Decrease timer
            store.decrementPowerModeTime(dt);

            // Blink logic could be handled here or in the renderer based on time left
            // For now, we just manage the state transition which is largely handled by the store's action
            
            // Check if we need to revert ghost speeds or visual states
            // The store handles state reversion when time hits 0
        }
    }

    activate(level: number) {
        const store = useGameStore.getState();
        
        // Calculate duration based on level
        // Level 1: 6s, Level 2: 5s, Level 3: 4s
        const duration = Math.max(0, PowerPelletSystem.BASE_DURATION_MS - (level - 1) * 1000);
        
        store.setPowerMode(true, duration);
        
        // Play sound
        // const audio = new Audio('/sounds/frightened.mp3');
        // audio.loop = true;
        // audio.play();
    }
}
