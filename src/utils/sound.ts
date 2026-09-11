// Web Audio API Synthesizer for responsive, calm and tactile feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft high-frequency chime for tapping virtuous focus targets in mind game
  playChime(frequency: number = 528) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      // Gentle exponential decay
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Ignore audio errors if context blocked by browser
    }
  }

  // Harmonic chord for combos or completing scripture
  playVictoryChord() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const freqs = [432, 540, 648, 864]; // Sacred harmonious Solfeggio / A=432Hz tuning
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq);
        }, idx * 90);
      });
    } catch {
      // ignore
    }
  }

  // Soft low thud/buzz for avoided distractor or mistake
  playSoftThud() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  // Deep meditation bowl chime for Urge SOS Pause
  playZenBowl() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, ctx.currentTime); // Deep warm fundamental

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch {
      // ignore
    }
  }

  playPop(frequency: number = 600) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      instrumental.stop();
    }
    return this.isMuted;
  }
}

export type InstrumentalStyle = 'lofi' | 'celestial432' | 'harp' | 'waves';

class AmbientInstrumentalEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  public style: InstrumentalStyle = 'lofi';
  public volume: number = 0.35;
  private activeNodes: (OscillatorNode | AudioNode)[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public start(chosenStyle?: InstrumentalStyle) {
    if (chosenStyle) this.style = chosenStyle;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stop();
    this.isRunning = true;

    // Master gain for smooth volume control & crossfade
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(this.volume, ctx.currentTime + 1.2);
    this.masterGain.connect(ctx.destination);

    if (this.style === 'lofi') {
      this.playLofiProgression();
    } else if (this.style === 'celestial432') {
      this.playCelestialDrone();
    } else if (this.style === 'harp') {
      this.playHarpArpeggio();
    } else {
      this.playCalmWaves();
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.timer) {
      window.clearInterval(this.timer);
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      } catch {
        // ignore
      }
    }
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public setVolume(newVol: number) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setStyle(newStyle: InstrumentalStyle) {
    if (this.style === newStyle && this.isRunning) return;
    this.style = newStyle;
    if (this.isRunning) {
      this.start(newStyle);
    }
  }

  // 1. Lofi E-Piano Chords Progression (Emaj9 -> C#m7 -> Aadd9 -> Bsus4)
  private playLofiProgression() {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    const chords = [
      [164.81, 246.94, 329.63, 370.0, 493.88], // Emaj9 (E3, B3, E4, F#4, B4)
      [138.59, 207.65, 277.18, 329.63, 415.3],  // C#m7 (C#3, G#3, C#4, E4, G#4)
      [110.0,  220.0,  277.18, 329.63, 440.0],  // Aadd9 (A2, A3, C#4, E4, A4)
      [123.47, 185.0,  246.94, 370.0,  493.88]  // Bsus4 (B2, F#3, B3, F#4, B4)
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      // Filter for vintage warm lofi tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, this.ctx.currentTime);
      filter.Q.value = 1.2;
      filter.connect(this.masterGain);

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Use soft triangle & warm sine combination
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + (idx * 0.04);
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.12 / notes.length, startTime + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0005, startTime + 3.8);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(startTime);
        osc.stop(startTime + 4.0);
        this.activeNodes.push(osc);
      });
    };

    playNextChord();
    this.timer = window.setInterval(playNextChord, 3800);
  }

  // 2. 432Hz Sacred Celestial Pad Drone with subtle shimmer
  private playCelestialDrone() {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    // 432Hz base, 216Hz sub, 648Hz fifth, 864Hz octave
    const freqs = [108, 216, 432, 434, 648, 864];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.connect(this.masterGain);

    freqs.forEach(freq => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08 / freqs.length, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });
  }

  // 3. Meditative Harp / Kalimba Gentle Arpeggios (Pentatonic Peace)
  private playHarpArpeggio() {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C Major Pentatonic
    const pattern = [0, 2, 4, 7, 5, 3, 2, 0, 1, 4, 6, 4, 2, 1];
    let noteIdx = 0;

    const tick = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;
      const freq = scale[pattern[noteIdx % pattern.length]];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
      this.activeNodes.push(osc);
    };

    tick();
    this.timer = window.setInterval(tick, 450);
  }

  // 4. Calm Ocean Surf + Singing Bowl Low Drone
  private playCalmWaves() {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    // Singing bowl fundamental 144Hz + 432Hz
    [144, 288, 432].forEach(f => {
      if (!ctx || !this.masterGain) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc);
    });
  }
}

export const sound = new SoundEngine();
export const instrumental = new AmbientInstrumentalEngine();
