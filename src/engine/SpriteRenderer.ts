
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface SpriteDef {
    sheet: string;
    x: number;
    y: number;
    w: number;
    h: number;
    frames?: number; // Number of animation frames in a row
    gap?: number;    // Gap between frames
}

export class SpriteRenderer {
    private sheets: Map<string, HTMLImageElement> = new Map();
    private spriteDefs: Map<string, SpriteDef> = new Map();

    constructor() {}

    async loadSheet(name: string, url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sheets.set(name, img);
                resolve(img);
            };
            img.onerror = (e) => {
                console.error(`Failed to load spritesheet: ${name} from ${url}`, e);
                reject(e);
            };
            img.src = url;
        });
    }

    defineSprite(name: string, def: SpriteDef) {
        this.spriteDefs.set(name, def);
    }

    /**
     * Draws a sprite frame to the context.
     * @param ctx The canvas 2D context.
     * @param spriteName The name of the defined sprite.
     * @param x Destination x coordinate (center or top-left depending on convention, usually top-left for 2D).
     * @param y Destination y coordinate.
     * @param frameIndex The current frame index for animation (0-based).
     * @param direction Optional direction index (if sprite has rows for directions).
     *                  Convention: 0=Right, 1=Left, 2=Up, 3=Down or similar.
     *                  If spritesheet is arranged vertically for directions, multiply y.
     */
    drawSprite(ctx: CanvasRenderingContext2D, spriteName: string, x: number, y: number, frameIndex: number = 0, direction: number = 0, width?: number, height?: number) {
        const def = this.spriteDefs.get(spriteName);
        if (!def) {
            // console.warn(`Sprite definition not found: ${spriteName}`);
            return;
        }

        const sheet = this.sheets.get(def.sheet);
        if (!sheet) {
            // console.warn(`Spritesheet not found: ${def.sheet}`);
            return;
        }

        // Calculate source coordinates
        // Assumes frames are horizontal, directions are vertical rows if applicable, 
        // or just simple single row animation.
        // Adjust logic based on actual asset layout.
        // For now, assuming frames are horizontal.
        
        const gap = def.gap || 0;
        const srcX = def.x + (frameIndex * (def.w + gap));
        // If direction is used, it might offset Y. For now, we assume simple single-row sprites
        // or that 'def.y' is adjusted by the caller or we add a 'row' param.
        // Given "Support différentes directions", usually means multiple rows.
        // Let's assume direction adds to the Y offset if it's a character sprite.
        // BUT, for now, let's keep it simple: def.y is fixed, if direction changes, 
        // the caller might use a different sprite name (e.g., "pacman_left") or we handle it here if we know the layout.
        // Let's assume standard grid: Directions often are rows.
        
        let srcY = def.y;
        if (direction > 0) {
             srcY += direction * (def.h + gap);
        }

        const destW = width || def.w;
        const destH = height || def.h;

        ctx.drawImage(
            sheet,
            srcX, srcY, def.w, def.h,
            x, y, destW, destH
        );
    }

    // Helper to batch load standard sheets
    async loadDefaults() {
        try {
            await Promise.all([
                this.loadSheet('pacman', '/assets/pacman.png'), // Placeholder paths
                this.loadSheet('ghosts', '/assets/ghosts.png'),
                this.loadSheet('maze', '/assets/maze.png')
            ]);
        } catch (e) {
            console.error("Error loading default sheets", e);
        }
    }
}
