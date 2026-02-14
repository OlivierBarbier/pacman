import { useGameStore } from '../store/gameStore';

export class ScoreSystem {
    update() {
        // Mostly event driven, but could handle time-based bonuses here
    }

    addPelletScore(isPowerPellet: boolean) {
        useGameStore.getState().addScore(isPowerPellet ? 50 : 10);
    }

    addGhostScore(ghostIndex: number) {
        // 200 * 2^n
        // ghostIndex is the nth ghost eaten in this power mode sequence (0-3)
        const points = 200 * Math.pow(2, ghostIndex);
        useGameStore.getState().addScore(points);
        return points; // Return for floating text display
    }

    addFruitScore(fruitType: 'CHERRY' | 'STRAWBERRY' | 'ORANGE') {
        let points = 0;
        switch (fruitType) {
            case 'CHERRY': points = 100; break;
            case 'STRAWBERRY': points = 300; break;
            case 'ORANGE': points = 500; break;
        }
        useGameStore.getState().addScore(points);
        return points;
    }
}
