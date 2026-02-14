import React from 'react';
import { useGameStore } from './store/gameStore';

function App() {
  const { status, setStatus } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]">
        PACMAN REACT
      </h1>
      
      <div className="bg-gray-900 border-4 border-blue-900 rounded-lg p-8 shadow-[0_0_20px_rgba(0,0,255,0.3)]">
        <div className="text-center mb-6">
          <p className="text-xl mb-2">Status: <span className="font-mono text-green-400">{status}</span></p>
          <p className="text-sm text-gray-400">Use Arrow Keys to move (when implemented)</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-all shadow-[0_0_15px_rgba(0,100,255,0.4)]"
            onClick={() => setStatus('PLAYING')}
          >
            START GAME
          </button>
          <button 
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-bold transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)]"
            onClick={() => setStatus('GAME_OVER')}
          >
            RESET
          </button>
        </div>
      </div>
      
      <footer className="mt-8 text-gray-600 text-sm">
        Built with React + TypeScript + Vite + Zustand
      </footer>
    </div>
  );
}

export default App;
