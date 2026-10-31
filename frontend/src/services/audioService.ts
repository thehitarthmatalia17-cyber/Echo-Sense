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
   * Plays a pure sinusoidal audio tone at exact frequency with smooth envelope.
   * Envelope prevents click/pop artifacts when starting and stopping tones.
   */
  public playPureTone(
    frequencyHz: number,
    durationMs: number = 1500,
    gainLevel: number = 0.25
  ): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = this.getAnalyser();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

      const now = ctx.currentTime;
      const attackTime = 0.08;
      const releaseTime = 0.08;
      const durationSec = durationMs / 1000;

      // Soft envelope ramp-up and ramp-down
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainLevel, now + attackTime);
      gain.gain.setValueAtTime(gainLevel, now + durationSec - releaseTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);

      osc.onended = () => {
        resolve();
      };
    });
  }

  /**
   * Applies frequency filter (lowpass, bandpass, highpass) to simulate
   * acoustic degradation stages of the Repetition Detection Test.
   */
  public playFilteredToneBeep(
    filterType: BiquadFilterType,
    cutoffFreq: number,
    durationMs: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const analyser = this.getAnalyser();

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
      gain.connect(analyser);
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
