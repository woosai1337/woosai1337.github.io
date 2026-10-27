// ==========================================
// VISION SYNTH // MediaPipe Hand Tracking
// ==========================================

class HandTrackingApp {
  constructor() {
    this.video = document.getElementById("webcam");
    this.canvas = document.getElementById("outputCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.isCameraRunning = false;
    this.rightHandPinching = false;
    this.leftHandPinching = false;

    this.initCanvas();
    this.initMediaPipe();
    this.initUI();
  }

  initCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
  }

  initUI() {
    const startBtn = document.getElementById("btn-start");
    startBtn.addEventListener("click", () => {
      document.getElementById("splash-screen").style.display = "none";
      window.synth.init();
      this.startCamera();
    });

    document.querySelectorAll("[data-preset]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-preset]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.synth.setPreset(btn.dataset.preset);
      });
    });

    document.querySelectorAll("[data-scale]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-scale]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.synth.scaleMode = btn.dataset.scale;
      });
    });
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      this.video.srcObject = stream;
      await this.video.play();
      this.isCameraRunning = true;

      const camera = new Camera(this.video, {
        onFrame: async () => {
          if (this.isCameraRunning) {
            await this.hands.send({ image: this.video });
          }
        },
        width: 1280,
        height: 720
      });
      camera.start();

      document.getElementById("hud-status").textContent = "VISION ENGINE ONLINE // TRACKING HANDS";
    } catch (err) {
      alert("Не удалось получить доступ к веб-камере. Пожалуйста, разрешите доступ в браузере: " + err.message);
    }
  }

  initMediaPipe() {
    this.hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    this.hands.onResults(this.onResults.bind(this));
  }

  onResults(results) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Mirrored Camera Feed with Dark Cyber Tint
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, w, h);

    // Dark tint overlay
    ctx.fillStyle = "rgba(6, 12, 20, 0.68)";
    ctx.fillRect(0, 0, w, h);

    ctx.restore();

    // 2. Draw Note Pitch Grid Lines
    this.drawPitchGrid(w, h);

    const handsList = results.multiHandLandmarks || [];

    if (handsList.length === 0) {
      window.synth.noteOff();
      this.rightHandPinching = false;
      return;
    }

    // Sort hands by mirrored on-screen X position (landmark 0: wrist)
    // mirrored X = (1 - rawX) * w
    const handsWithX = handsList.map(lm => {
      const screenX = (1 - lm[0].x) * w;
      return { landmarks: lm, screenX };
    });
    handsWithX.sort((a, b) => a.screenX - b.screenX);

    if (handsWithX.length === 1) {
      // Single hand in view: always controls melody!
      this.processRightHand(handsWithX[0].landmarks, w, h);
    } else {
      // Leftmost hand controls FX / Echo / Sub-bass
      this.processLeftHand(handsWithX[0].landmarks, w, h);
      // Rightmost hand controls Melody
      this.processRightHand(handsWithX[1].landmarks, w, h);
    }
  }

  drawPitchGrid(w, h) {
    const ctx = this.ctx;
    const scale = window.synth.scales[window.synth.scaleMode] || window.synth.scales.pentatonic;
    const count = scale.length;
    const colWidth = w / count;

    ctx.strokeStyle = "rgba(0, 242, 254, 0.08)";
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
      const x = i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      const note = window.synth.freqToNoteName(scale[i]);
      ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
      ctx.font = "11px 'Share Tech Mono', monospace";
      ctx.fillText(note, x + 6, h - 25);
    }
  }

  processRightHand(landmarks, w, h) {
    const ctx = this.ctx;

    // Index fingertip (landmark 8)
    const indexX = (1 - landmarks[8].x) * w;
    const indexY = landmarks[8].y * h;

    // Thumb tip (landmark 4)
    const thumbX = (1 - landmarks[4].x) * w;
    const thumbY = landmarks[4].y * h;

    // Normalized pinch distance
    const distNorm = Math.hypot(landmarks[8].x - landmarks[4].x, landmarks[8].y - landmarks[4].y);
    const isPinching = distNorm < 0.085;
    const isTriggered = window.synth.scaleMode === "theremin" || isPinching;

    // Draw Skeleton (Cyan Neon)
    this.drawHandSkeleton(landmarks, w, h, "#00f2fe", "rgba(0, 242, 254, 0.4)");

    // Pinch Lightning Effect
    if (isPinching) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(thumbX, thumbY);
      ctx.lineTo((thumbX + indexX) / 2 + (Math.random() - 0.5) * 12, (thumbY + indexY) / 2 + (Math.random() - 0.5) * 12);
      ctx.lineTo(indexX, indexY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Floating Note HUD over index fingertip
    const noteText = `${window.synth.currentNoteName}`;
    ctx.fillStyle = isTriggered ? "#00ff88" : "#00f2fe";
    ctx.shadowColor = isTriggered ? "#00ff88" : "#00f2fe";
    ctx.shadowBlur = 12;
    ctx.font = "bold 18px 'Orbitron', sans-serif";
    ctx.fillText(noteText, indexX + 15, indexY - 12);

    ctx.font = "11px 'Share Tech Mono', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.shadowBlur = 0;
    const statusText = window.synth.scaleMode === "theremin" ? "⚡ THEREMIN: ACTIVE" : (isPinching ? "⚡ SOUND ON" : "PINCH TO PLAY");
    ctx.fillText(statusText, indexX + 15, indexY + 6);

    // Update Synthesizer
    const normX = Math.max(0, Math.min(1, indexX / w));
    const normY = Math.max(0, Math.min(1, indexY / h));
    window.synth.updateFromHand(normX, normY, isTriggered);

    // Update HUD meters
    document.getElementById("note-display").textContent = noteText;
    document.getElementById("freq-display").textContent = `${Math.round(window.synth.currentFreq)} Hz`;
  }

  processLeftHand(landmarks, w, h) {
    const ctx = this.ctx;

    const indexX = (1 - landmarks[8].x) * w;
    const indexY = landmarks[8].y * h;
    const thumbX = (1 - landmarks[4].x) * w;
    const thumbY = landmarks[4].y * h;

    const distNorm = Math.hypot(landmarks[8].x - landmarks[4].x, landmarks[8].y - landmarks[4].y);
    const isPinching = distNorm < 0.085;

    // Draw Skeleton (Magenta Neon)
    this.drawHandSkeleton(landmarks, w, h, "#d946ef", "rgba(217, 70, 239, 0.4)");

    if (isPinching && !this.leftHandPinching) {
      window.synth.triggerBassDrop();
      this.createPulseRing(indexX, indexY, "#d946ef");
    }
    this.leftHandPinching = isPinching;

    const normY = Math.max(0, Math.min(1, indexY / h));
    const normX = Math.max(0, Math.min(1, indexX / w));
    const echoPct = Math.round((1 - normY) * 100);

    ctx.fillStyle = "#d946ef";
    ctx.shadowColor = "#d946ef";
    ctx.shadowBlur = 10;
    ctx.font = "bold 14px 'Orbitron', sans-serif";
    ctx.fillText(`ECHO: ${echoPct}%`, indexX - 110, indexY - 12);
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.fillText(isPinching ? "💥 808 SUB BASS" : "PINCH: BASS DROP", indexX - 110, indexY + 6);
    ctx.shadowBlur = 0;

    window.synth.updateModulation(normY, normX);
  }

  drawHandSkeleton(landmarks, w, h, color, glowColor) {
    const ctx = this.ctx;
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14;

    connections.forEach(([p1, p2]) => {
      const x1 = (1 - landmarks[p1].x) * w;
      const y1 = landmarks[p1].y * h;
      const x2 = (1 - landmarks[p2].x) * w;
      const y2 = landmarks[p2].y * h;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    for (let i = 0; i < landmarks.length; i++) {
      const x = (1 - landmarks[i].x) * w;
      const y = landmarks[i].y * h;
      const isTip = [4, 8, 12, 16, 20].includes(i);

      ctx.fillStyle = isTip ? "#fff" : color;
      ctx.beginPath();
      ctx.arc(x, y, isTip ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  createPulseRing(x, y, color) {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.stroke();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new HandTrackingApp();
});
