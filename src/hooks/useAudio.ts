import { useState, useEffect, useCallback } from 'react';
import { AudioManager } from '../engine/AudioManager';

export const useAudio = () => {
  const manager = AudioManager.getInstance();
  
  const [masterVolume, setMasterVolumeState] = useState(manager.getMasterVolume());
  const [sfxVolume, setSFXVolumeState] = useState(manager.getSFXVolume());
  const [musicVolume, setMusicVolumeState] = useState(manager.getMusicVolume());
  const [isMuted, setIsMutedState] = useState(manager.isAudioMuted());

  useEffect(() => {
    // Subscribe to changes in the Audio Manager
    const unsubscribe = manager.subscribe(() => {
      setMasterVolumeState(manager.getMasterVolume());
      setSFXVolumeState(manager.getSFXVolume());
      setMusicVolumeState(manager.getMusicVolume());
      setIsMutedState(manager.isAudioMuted());
    });
    return unsubscribe;
  }, [manager]);

  const setMasterVolume = useCallback((val: number) => manager.setMasterVolume(val), [manager]);
  const setSFXVolume = useCallback((val: number) => manager.setSFXVolume(val), [manager]);
  const setMusicVolume = useCallback((val: number) => manager.setMusicVolume(val), [manager]);
  const toggleMute = useCallback(() => manager.toggleMute(), [manager]);
  
  const playSFX = useCallback((name: string) => manager.playSFX(name), [manager]);
  const playMusic = useCallback((name: string, loop: boolean = true) => manager.playMusic(name, loop), [manager]);
  const stopMusic = useCallback(() => manager.stopMusic(), [manager]);
  const preloadSounds = useCallback((list: { name: string; url: string }[]) => manager.preloadSounds(list), [manager]);

  return {
    masterVolume,
    sfxVolume,
    musicVolume,
    isMuted,
    setMasterVolume,
    setSFXVolume,
    setMusicVolume,
    toggleMute,
    playSFX,
    playMusic,
    stopMusic,
    preloadSounds
  };
};
