export type EarChannel = 'left' | 'right' | 'both';

class AudioService {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  public getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getAudioContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
    }
    return this.analyser;
  }

  /**
   * Creates a stereo panner node configured for Left, Right, or Center (Both) audio routing.
   * - Left: pan = -1.0
   * - Right: pan = +1.0
   * - Both: pan = 0.0
   */
  private createPanner(ctx: AudioContext, ear: EarChannel): StereoPannerNode | null {
    if (typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      if (ear === 'left') {
        panner.pan.setValueAtTime(-1.0, ctx.currentTime);
      } else if (ear === 'right') {
        panner.pan.setValueAtTime(1.0, ctx.currentTime);
      } else {
        panner.pan.setValueAtTime(0.0, ctx.currentTime);
      }
      return panner;
    }
    return null;
  }

  /**
   * Generates a soft acoustic masking noise in the opposite ear (contralateral masking)
   * to minimize bone-conduction and acoustic leakage during unilateral testing.
   */
  private playContralateralMasking(
    ctx: AudioContext,
    destination: AudioNode,
    ear: EarChannel,
    durationSec: number
  ): { stop: () => void } | null {
    if (ear === 'both') return null; // No masking needed if testing both ears

    try {
      const oppositeEar: EarChannel = ear === 'left' ? 'right' : 'left';
      const bufferSize = ctx.sampleRate * Math.min(durationSec, 3);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate gentle pink-tinted acoustic masking noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.06; // soft amplitude
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const maskGain = ctx.createGain();
      const now = ctx.currentTime;
      // Gentle masking volume (~0.025) so it doesn't distract but isolates opposite ear
      maskGain.gain.setValueAtTime(0.0001, now);
      maskGain.gain.exponentialRampToValueAtTime(0.025, now + 0.08);
      maskGain.gain.setValueAtTime(0.025, now + durationSec - 0.08);
      maskGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      const maskPanner = this.createPanner(ctx, oppositeEar);

      if (maskPanner) {
        noiseSource.connect(maskGain);
        maskGain.connect(maskPanner);
        maskPanner.connect(destination);
      } else {
        noiseSource.connect(maskGain);
        maskGain.connect(destination);
      }

      noiseSource.start(now);
      noiseSource.stop(now + durationSec);

      return {
        stop: () => {
          try {
            noiseSource.stop();
          } catch (e) {
            // Ignored
          }
        }
      };
    } catch (e) {
      console.warn("Masking generator warning:", e);
      return null;
    }
  }

  /**
   * Plays a pure sinusoidal audio tone at exact frequency with smooth envelope
   * and isolated stereo panning for Left Ear, Right Ear, or Both.
   */
  public playPureTone(
    frequencyHz: number,
    durationMs: number = 1400,
    gainLevel: number = 0.22,
    ear: EarChannel = 'both',
    enableMasking: boolean = true
  ): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = this.getAnalyser();
      const panner = this.createPanner(ctx, ear);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

      const now = ctx.currentTime;
      const attackTime = 0.08;
      const releaseTime = 0.08;
      const durationSec = durationMs / 1000;

      // Soft envelope ramp-up and ramp-down prevents click/pop artifacts
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainLevel, now + attackTime);
      gain.gain.setValueAtTime(gainLevel, now + durationSec - releaseTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      // Connect node pipeline: osc -> gain -> panner (if available) -> analyser -> destination
      osc.connect(gain);

      if (panner) {
        gain.connect(panner);
        panner.connect(analyser);
      } else {
        gain.connect(analyser);
      }
      analyser.connect(ctx.destination);

      // Play soft contralateral masking in opposite ear if unilateral
      let maskingHandle: { stop: () => void } | null = null;
      if (enableMasking && ear !== 'both') {
        maskingHandle = this.playContralateralMasking(ctx, ctx.destination, ear, durationSec);
      }

      osc.start(now);
      osc.stop(now + durationSec);

      osc.onended = () => {
        if (maskingHandle) maskingHandle.stop();
        resolve();
      };
    });
  }

  /**
   * Applies frequency filter (lowpass, bandpass, highpass) to simulate
   * acoustic degradation stages of the Repetition Detection Test,
   * panned to the requested ear.
   */
  public playFilteredToneBeep(
    filterType: BiquadFilterType,
    cutoffFreq: number,
    durationMs: number = 1000,
    ear: EarChannel = 'both'
  ): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const analyser = this.getAnalyser();
      const panner = this.createPanner(ctx, ear);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      filter.type = filterType;
      filter.frequency.setValueAtTime(cutoffFreq, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.setValueAtTime(0.3, now + durationSec - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);

      if (panner) {
        gain.connect(panner);
        panner.connect(analyser);
      } else {
        gain.connect(analyser);
      }
      analyser.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);

      osc.onended = () => {
        resolve();
      };
    });
  }
}

export const audioService = new AudioService();
