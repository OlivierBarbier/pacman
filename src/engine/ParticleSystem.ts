export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

export class ParticleSystem {
    private particles: Particle[] = [];
    private pool: Particle[] = []; // Object pooling

    constructor() {}

    spawn(x: number, y: number, color: string, count: number = 10, speed: number = 2) {
        for (let i = 0; i < count; i++) {
            const p = this.getPooled();
            p.x = x;
            p.y = y;
            const angle = Math.random() * Math.PI * 2;
            const v = Math.random() * speed;
            p.vx = Math.cos(angle) * v;
            p.vy = Math.sin(angle) * v;
            p.life = 1.0;
            p.maxLife = 1.0; // Normalized life
            p.color = color;
            p.size = Math.random() * 2 + 1;
            this.particles.push(p);
        }
    }

    private getPooled(): Particle {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return {
            x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, color: '#fff', size: 1
        };
    }

    update(dt: number) {
        // dt in seconds
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; // Adjust for dt if desired, but simplified here
            p.y += p.vy;
            p.life -= dt; // Decay

            if (p.life <= 0) {
                this.pool.push(p);
                this.particles.splice(i, 1); // Remove from active
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // Batch drawing by color or just iterate
        for (const p of this.particles) {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
