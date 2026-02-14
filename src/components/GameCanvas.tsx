import React, { useRef, useEffect } from 'react';

interface GameCanvasProps {
    onDraw: (ctx: CanvasRenderingContext2D, time: number, width: number, height: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onDraw }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    // SpriteRenderer moved to parent (Game.tsx)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get main context
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Double buffering: Create an offscreen canvas
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d', { alpha: false });

        if (!offCtx) return;

        // Resize handler
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Main canvas size (physical pixels)
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            
            // CSS size (logical pixels)
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Offscreen canvas size (physical pixels)
            offscreen.width = width * dpr;
            offscreen.height = height * dpr;

            // Scale offscreen context to match logical coordinates
            offCtx.resetTransform();
            offCtx.scale(dpr, dpr);
            
            // We do NOT scale the main ctx, because we will blit the offscreen canvas directly (1:1 pixels)
            ctx.resetTransform();
        };

        window.addEventListener('resize', resize);
        resize(); // Initial resize

        // Game Loop
        const render = (time: number) => {
            // 1. Clear offscreen
            // We use logical width/height for clearing because of the scale
            const width = offscreen.width / (window.devicePixelRatio || 1);
            const height = offscreen.height / (window.devicePixelRatio || 1);
            
            // Clear with background color (could be prop)
            offCtx.fillStyle = '#000000';
            offCtx.fillRect(0, 0, width, height);

            // 2. Delegate Drawing to Parent
            if (onDraw) {
                onDraw(offCtx, time, width, height);
            }

            // 3. Blit to Main Canvas
            ctx.drawImage(offscreen, 0, 0);

            // Loop
            requestRef.current = requestAnimationFrame(render);
        };

        // Start loop
        requestRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [onDraw]);

    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
