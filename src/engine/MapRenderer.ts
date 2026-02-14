export const TILE_SIZE = 24;

export class MapRenderer {
    private grid: number[][] = []; // 0=Empty, 1=Wall, 2=Pellet, 3=PowerPellet, 4=Gate
    private width: number = 0;
    private height: number = 0;

    constructor() {}

    loadMap(grid: number[][]) {
        this.grid = grid;
        this.height = grid.length;
        this.width = grid[0]?.length || 0;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Draw Walls (Neon Style)
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f'; // Neon Blue
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === 1) { // Wall
                    // Simple approach: Draw rectangle for each wall block
                    // For better "connected" look, we would check neighbors, 
                    // but for this MVP, individual blocks with glow works for "grid" style neon.
                    // To make it look cleaner, we can draw a slightly smaller rect
                    const pad = 4;
                    ctx.strokeRect(x * TILE_SIZE + pad, y * TILE_SIZE + pad, TILE_SIZE - pad*2, TILE_SIZE - pad*2);
                }
            }
        }
        // ctx.stroke(); // strokeRect draws immediately
        ctx.restore();

        // Draw Pellets
        ctx.save();
        ctx.fillStyle = '#ffb8ae'; // Pale pink/orange
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                const cx = x * TILE_SIZE + TILE_SIZE/2;
                const cy = y * TILE_SIZE + TILE_SIZE/2;

                if (cell === 2) { // Pellet
                    ctx.fillRect(cx - 2, cy - 2, 4, 4);
                } else if (cell === 3) { // Power Pellet
                    // Pulsing Glow
                    const pulse = Math.sin(time / 200) * 5 + 10;
                    ctx.shadowBlur = pulse;
                    ctx.shadowColor = '#fff';
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0; 
                }
            }
        }
        ctx.restore();
    }
}
