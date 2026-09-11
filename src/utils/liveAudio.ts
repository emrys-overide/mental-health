// Audio utilities for Gemini Live API (gemini-3.1-flash-live-preview)

/**
 * Converts Float32Array PCM audio from Web Audio API into 16-bit PCM little-endian Base64.
 * Live API input audio format: audio/pcm;rate=16000, 16-bit signed integer, Little-Endian.
 */
export function pcmFloat32ToBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Clamp sample between -1.0 and 1.0
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // Convert Int16Array buffer to binary string
  const bytes = new Uint8Array(int16Array.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes 16-bit PCM little-endian Base64 from Gemini Live API into an AudioBuffer at 24kHz.
 */
export function decodeBase64ToPcm24k(audioCtx: AudioContext, base64Data: string): AudioBuffer {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const int16 = new Int16Array(bytes.buffer);
  const sampleRate = 24000;
  const buffer = audioCtx.createBuffer(1, int16.length, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < int16.length; i++) {
    channelData[i] = int16[i] / (int16[i] < 0 ? 32768 : 32767);
  }

  return buffer;
}

/**
 * Manages scheduled, gapless audio playback for the 24kHz output stream from Gemini Live API.
 */
export class LiveAudioPlayer {
  private ctx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  public isPlaying = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public enqueueChunk(base64Chunk: string, onAudioStart?: () => void, onAudioEnd?: () => void) {
    try {
      const ctx = this.getAudioContext();
      const buffer = decodeBase64ToPcm24k(ctx, base64Chunk);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime + 0.05; // 50ms initial jitter buffer
      }

      source.start(this.nextStartTime);
      this.isPlaying = true;
      if (onAudioStart) onAudioStart();

      const duration = buffer.duration;
      this.nextStartTime += duration;

      this.activeSources.push(source);

      source.onended = () => {
        this.activeSources = this.activeSources.filter((s) => s !== source);
        if (this.activeSources.length === 0) {
          this.isPlaying = false;
          if (onAudioEnd) onAudioEnd();
        }
      };
    } catch (err) {
      console.error('Error playing Live audio chunk:', err);
    }
  }

  public stopAndClear() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Source may already be stopped
      }
    }
    this.activeSources = [];
    if (this.ctx) {
      this.nextStartTime = this.ctx.currentTime;
    }
    this.isPlaying = false;
  }

  public close() {
    this.stopAndClear();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch (e) {}
    }
    this.ctx = null;
  }
}
