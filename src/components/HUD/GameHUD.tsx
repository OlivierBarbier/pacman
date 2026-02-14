import React from 'react';
import { useGameStore } from '../../store/gameStore';

const GameHUD: React.FC = () => {
  const { score, highScore, level, lives } = useGameStore((state) => ({
    score: state.score,
    highScore: state.highScore,
    level: state.level,
    lives: state.lives
  }));

  return (
    <div className="game-hud" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      pointerEvents: 'none',
      zIndex: 50,
      fontFamily: '"Courier New", Courier, monospace',
      boxSizing: 'border-box'
    }}>
      <div className="hud-left" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ color: 'var(--neon-blue)', fontSize: '0.9rem', opacity: 0.8 }}>HIGH SCORE</div>
        <div className="neon-text-pink" style={{ fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 0 10px var(--neon-pink)' }}>
          {highScore.toString().padStart(6, '0')}
        </div>
        <div style={{ marginTop: '10px', color: 'var(--neon-blue)', fontSize: '0.9rem', opacity: 0.8 }}>SCORE</div>
        <div className="neon-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      <div className="hud-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        <div className="level-display" style={{ 
          background: 'rgba(0, 242, 255, 0.1)', 
          padding: '5px 15px', 
          border: '1px solid var(--neon-blue)',
          borderRadius: '4px',
          color: 'var(--neon-blue)',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          LEVEL {level}
        </div>
        
        <div className="lives-display" style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: i < lives ? 'var(--neon-yellow)' : 'rgba(255, 255, 0, 0.1)',
              boxShadow: i < lives ? '0 0 10px var(--neon-yellow)' : 'none',
              clipPath: i < lives ? 'polygon(100% 0%, 100% 35%, 50% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 0%)' : 'none',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
