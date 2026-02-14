import React from 'react';
import { useGameStore } from '../store/gameStore';

const MobileControls: React.FC = () => {
  const updatePacman = useGameStore((state) => state.updatePacman);

  const handleDirection = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    updatePacman({ direction: dir });
  };

  return (
    <div className="mobile-controls" style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 60px)',
      gridTemplateRows: 'repeat(3, 60px)',
      gap: '10px',
      zIndex: 60,
      userSelect: 'none',
      opacity: 0.6
    }}>
      <div />
      <ControlButton label="↑" onClick={() => handleDirection('UP')} />
      <div />
      <ControlButton label="←" onClick={() => handleDirection('LEFT')} />
      <div />
      <ControlButton label="→" onClick={() => handleDirection('RIGHT')} />
      <div />
      <ControlButton label="↓" onClick={() => handleDirection('DOWN')} />
      <div />
    </div>
  );
};

const ControlButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onPointerDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    style={{
      width: '60px',
      height: '60px',
      backgroundColor: 'rgba(0, 242, 255, 0.2)',
      border: '2px solid var(--neon-blue)',
      borderRadius: '12px',
      color: 'var(--neon-blue)',
      fontSize: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      touchAction: 'none',
      boxShadow: '0 0 10px rgba(0, 242, 255, 0.3)'
    }}
  >
    {label}
  </button>
);

export default MobileControls;
