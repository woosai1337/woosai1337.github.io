// ==========================================
// MOTION BLADE // Procedural Web Audio SFX
// ==========================================

class BladeSoundEngine {
  constructor() {
    this.ctx = null;
    this.lastSwooshTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  playSwoosh(speed = 1.0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastSwooshTime < 0.16) return; // Debounce
    this.lastSwooshTime = now;

    try {
      // Noise buffer for swoosh
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      const startFreq = 400 * speed;
      filter.frequency.setValueAtTime(startFreq, now);
      filter.frequency.exponentialRampToValueAtTime(1400 * speed, now + 0.12);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  playSlice() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Laser impact snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.09);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);

      // Glass / Metallic chime
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = "sine";
      chime.frequency.setValueAtTime(2400 + Math.random() * 400, now);
      chimeGain.gain.setValueAtTime(0.3, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);

      chime.start(now);
      chime.stop(now + 0.22);
    } catch (e) {}
  }

  playBomb() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Deep sub boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  playCombo(count) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440;
      const notes = [1, 1.25, 1.5, 1.75, 2.0];
      const mult = notes[Math.min(notes.length - 1, count - 2)] || 1.5;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * mult, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * mult * 1.5, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }
}

window.soundEngine = new BladeSoundEngine();
