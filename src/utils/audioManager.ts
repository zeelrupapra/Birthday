// Audio manager for background music & cute sound effects
// Supports both custom mp3 files and a procedural Web Audio API music-box fallback!

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private proceduralInterval: number | null = null;
  private usingProcedural: boolean = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Lazy initialized on first user interaction
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public async startMusic(musicPath: string = '/music/birthday-song.mp3'): Promise<void> {
    if (this.isMusicPlaying) return;

    try {
      if (!this.bgAudio) {
        this.bgAudio = new Audio(musicPath);
        this.bgAudio.loop = true;
        this.bgAudio.volume = 0.55;
      }

      await this.bgAudio.play();
      this.isMusicPlaying = true;
      this.usingProcedural = false;
      this.notify();
    } catch {
      // Custom file not found or autoplay error -> start dreamy procedural music box!
      this.startProceduralLofiMusic();
    }
  }

  public togglePlay(musicPath?: string): void {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.startMusic(musicPath);
    }
  }

  public pauseMusic(): void {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    if (this.proceduralInterval) {
      window.clearInterval(this.proceduralInterval);
      this.proceduralInterval = null;
    }
    this.isMusicPlaying = false;
    this.notify();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.muted = this.isMuted;
    }
    this.notify();
  }

  public getStatus() {
    return {
      isPlaying: this.isMusicPlaying,
      isMuted: this.isMuted,
      isProcedural: this.usingProcedural
    };
  }

  // --- Procedural Dreamy Music Box Synth ---
  private startProceduralLofiMusic(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.usingProcedural = true;
    this.notify();

    // Sweet pentatonic music box notes (C major / A minor pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
    const melodyFreqs = [
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 440.00, 523.25,
      587.33, 523.25, 440.00, 392.00, 329.63, 293.66, 261.63, 392.00
    ];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.audioCtx) return;
      const freq = melodyFreqs[noteIndex % melodyFreqs.length];
      noteIndex++;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        // Music box timbre: sine with subtle harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.25);
      } catch {
        // Safe fallback
      }
    };

    if (this.proceduralInterval) {
      window.clearInterval(this.proceduralInterval);
    }
    playNextNote();
    this.proceduralInterval = window.setInterval(playNextNote, 600);
  }

  // --- Cute Instant Sound Effects ---
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  public playPop(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  public playSparkle(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const notes = [880, 1174, 1318, 1760];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

        const startTime = ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {}
  }

  public playWhoosh(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  public playTick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  public playSlice(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }

  public playBlow(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Wind puff sound using noise buffer or swept low sine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Fanfare chords
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {}
  }
}

export const audioManager = AudioManager.getInstance();
