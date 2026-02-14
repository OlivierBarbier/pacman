export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private sfxGain: GainNode;
  private musicGain: GainNode;
  
  private buffers: Map<string, AudioBuffer> = new Map();
  private activeMusicSource: AudioBufferSourceNode | null = null;
  
  private isMuted: boolean = false;

  // Volume levels (0.0 to 1.0)
  private masterVolume: number = 1.0;
  private sfxVolume: number = 1.0;
  private musicVolume: number = 1.0;

  private constructor() {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    this.audioContext = new AudioContextClass();
    
    // Create Gain Nodes
    this.masterGain = this.audioContext.createGain();
    this.sfxGain = this.audioContext.createGain();
    this.musicGain = this.audioContext.createGain();

    // Connect graph: Source -> Group Gain -> Master Gain -> Destination
    this.sfxGain.connect(this.masterGain);
    this.musicGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);

    // Initialize volumes
    this.updateVolumes();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private updateVolumes() {
    const now = this.audioContext.currentTime;
    // Smooth transition to avoid clicks
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume, now, 0.01);
    this.sfxGain.gain.setTargetAtTime(this.sfxVolume, now, 0.01);
    this.musicGain.gain.setTargetAtTime(this.musicVolume, now, 0.01);
    this.notifyListeners();
  }

  public async preloadSounds(soundList: { name: string; url: string }[]): Promise<void> {
    const promises = soundList.map(async (sound) => {
      try {
        const response = await fetch(sound.url);
        if (!response.ok) throw new Error(`Failed to load sound: ${sound.url}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(sound.name, audioBuffer);
      } catch (error) {
        console.error(`Error loading sound ${sound.name}:`, error);
      }
    });
    await Promise.all(promises);
  }

  public playSFX(name: string): void {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`SFX not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGain);
    source.start();
  }

  public playMusic(name: string, loop: boolean = true): void {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Stop currently playing music if any
    this.stopMusic();

    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Music not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.musicGain);
    source.start();
    this.activeMusicSource = source;
  }

  public stopMusic(): void {
    if (this.activeMusicSource) {
      this.activeMusicSource.stop();
      this.activeMusicSource.disconnect();
      this.activeMusicSource = null;
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (!this.isMuted) {
        this.updateVolumes();
    }
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.updateVolumes();
  }

  public isAudioMuted(): boolean {
      return this.isMuted;
  }

  public getMasterVolume(): number { return this.masterVolume; }
  public getSFXVolume(): number { return this.sfxVolume; }
  public getMusicVolume(): number { return this.musicVolume; }

  private listeners: Set<() => void> = new Set();

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  // Cleanup mainly for strict hot-reload environments or testing
  public cleanup(): void {
    this.stopMusic();
    this.audioContext.close();
  }
}
