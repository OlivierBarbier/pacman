import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameStatus } from '../engine/types';

const MainMenu: React.FC = () => {
  const setStatus = useGameStore((state) => state.setStatus);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? '#00f2ff' : '#ff00ff'
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="main-menu" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      background: 'transparent'
    }}>
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }} />
      <div className="neon-grid"></div>
      
      <h1 className="neon-text" style={{ fontSize: '5rem', marginBottom: '2rem' }}>
        PAC<span className="neon-text-pink">MAN</span>
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <button className="neon-button" onClick={() => setStatus(GameStatus.PLAYING)}>
          PLAY
        </button>
        <button className="neon-button" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
          OPTIONS
        </button>
      </div>

      <div className="overlay"></div>
    </div>
  );
};

export default MainMenu;
