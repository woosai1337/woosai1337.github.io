// ==========================================
// VISION SYNTH // Web Audio Engine
// ==========================================

class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.subOsc = null;
    this.filter = null;
    this.gainNode = null;
    this.delayNode = null;
    this.delayGain = null;
    this.masterGain = null;

    this.isPlaying = false;
    this.scaleMode = "pentatonic"; // pentatonic, dorian, theremin (continuous)
    this.preset = "neon-lead"; // neon-lead, cyber-bass, dream-pad

    // Pentatonic scale frequencies (C3 to C5)
    this.scales = {
      pentatonic: [
        130.81, 155.56, 174.61, 196.00, 233.08, // C3, Eb3, F3, G3, Bb3
        261.63, 311.13, 349.23, 392.00, 466.16, // C4, Eb4, F4, G4, Bb4
        523.25, 622.25, 698.46, 783.99, 932.33, 1046.50 // C5, Eb5, F5, G5, Bb5, C6
      ],
      dorian: [
        130.81, 146.83, 155.56, 174.61, 196.00, 220.00, 233.08, // C3 Dorian
        261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 466.16,
        523.25, 587.33, 622.25, 698.46, 783.99, 880.00, 932.33, 1046.50
      ]
    };

    this.currentNoteName = "C4";
    this.currentFreq = 261.63;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Delay FX (Echo)
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.42, this.ctx.currentTime);
    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.masterGain);

    // Lowpass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    // Voice Gain (Envelope)
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    this.gainNode.connect(this.filter);
    this.filter.connect(this.masterGain);
    this.filter.connect(this.delayNode);
    this.masterGain.connect(this.ctx.destination);

    // Oscillators
    this.setupOscillators();
  }

  setupOscillators() {
    const now = this.ctx.currentTime;

    // Osc 1 (Lead)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = this.preset === "dream-pad" ? "sine" : "sawtooth";
    this.osc1.frequency.setValueAtTime(261.63, now);

    // Osc 2 (Detuned)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = "sawtooth";
    this.osc2.detune.setValueAtTime(9, now); // +9 cents fat chorus
    this.osc2.frequency.setValueAtTime(261.63, now);

    // Sub Osc (Bass body)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = "sine";
    this.subOsc.frequency.setValueAtTime(130.81, now);

    const oscMix = this.ctx.createGain();
    oscMix.gain.setValueAtTime(0.35, now);

    this.osc1.connect(oscMix);
    this.osc2.connect(oscMix);
    this.subOsc.connect(oscMix);
    oscMix.connect(this.gainNode);

    this.osc1.start();
    this.osc2.start();
    this.subOsc.start();
  }

  setPreset(name) {
    this.preset = name;
    if (!this.osc1) return;
    if (name === "neon-lead") {
      this.osc1.type = "sawtooth";
      this.osc2.type = "sawtooth";
      this.subOsc.type = "sine";
      this.filter.Q.setValueAtTime(6.0, this.ctx.currentTime);
    } else if (name === "cyber-bass") {
      this.osc1.type = "square";
      this.osc2.type = "sawtooth";
      this.subOsc.type = "triangle";
      this.filter.Q.setValueAtTime(8.0, this.ctx.currentTime);
    } else if (name === "dream-pad") {
      this.osc1.type = "sine";
      this.osc2.type = "triangle";
      this.subOsc.type = "sine";
      this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
    }
  }

  noteOn() {
    if (!this.ctx) this.init();
    if (this.ctx.state === "suspended") this.ctx.resume();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0.5, now + 0.04); // Fast attack
  }

  noteOff() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); // Smooth release
  }

  updateFromHand(x, y, isPinching) {
    // x: 0.0 (left) to 1.0 (right)
    // y: 0.0 (top) to 1.0 (bottom)
    if (!this.ctx) return;

    // Pitch determination
    let targetFreq = 261.63;
    if (this.scaleMode === "theremin") {
      // Continuous frequency from 100Hz to 1200Hz
      targetFreq = 100 + Math.pow(x, 2) * 1100;
      this.currentNoteName = `${Math.round(targetFreq)} Hz`;
    } else {
      // Quantize to scale notes
      const scale = this.scales[this.scaleMode] || this.scales.pentatonic;
      const idx = Math.min(scale.length - 1, Math.max(0, Math.floor(x * scale.length)));
      targetFreq = scale[idx];
      this.currentNoteName = this.freqToNoteName(targetFreq);
    }

    this.currentFreq = targetFreq;

    const now = this.ctx.currentTime;
    // Glide pitch smoothly
    this.osc1.frequency.setTargetAtTime(targetFreq, now, 0.02);
    this.osc2.frequency.setTargetAtTime(targetFreq, now, 0.02);
    this.subOsc.frequency.setTargetAtTime(targetFreq / 2, now, 0.02);

    // Filter Cutoff from Y axis: Higher in camera (lower y) = brighter, open filter
    const cutoff = 250 + Math.pow(1 - y, 2.2) * 7500;
    this.filter.frequency.setTargetAtTime(cutoff, now, 0.03);

    // Gate control
    if (isPinching) {
      this.noteOn();
    } else {
      this.noteOff();
    }
  }

  updateModulation(yValue, xValue) {
    // Left hand modulation
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Y modulates delay wet mix (0.0 to 0.7)
    const delayWet = (1 - yValue) * 0.7;
    this.delayGain.gain.setTargetAtTime(delayWet, now, 0.05);

    // X modulates resonance / distortion Q
    const res = 1.0 + xValue * 14.0;
    this.filter.Q.setTargetAtTime(res, now, 0.05);
  }

  triggerBassDrop() {
    if (!this.ctx) this.init();
    const now = this.ctx.currentTime;
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();

    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(140, now);
    kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    kickGain.gain.setValueAtTime(0.8, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    kickOsc.connect(kickGain);
    kickGain.connect(this.masterGain);

    kickOsc.start(now);
    kickOsc.stop(now + 0.42);
  }

  freqToNoteName(freq) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midi = Math.round(69 + 12 * Math.log2(freq / 440));
    const name = notes[midi % 12];
    const oct = Math.floor(midi / 12) - 1;
    return `${name}${oct}`;
  }
}

window.synth = new AudioSynthEngine();
