// ==========================================
// MOTION BLADE // Hand Tracking & Blade Trails
// ==========================================

class BladeTrackerApp {
  constructor() {
    this.video = document.getElementById("webcam");
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.rightBladeTrail = [];
    this.leftBladeTrail = [];
    this.maxTrailLength = 14;

    this.initUI();
    this.initMediaPipe();
  }

  initUI() {
    document.getElementById("btn-start-game").addEventListener("click", () => {
      document.getElementById("start-screen").style.display = "none";
      window.soundEngine.init();
      window.game.start();
      this.startCamera();
    });

    document.getElementById("btn-restart-game").addEventListener("click", () => {
      document.getElementById("gameover-screen").style.display = "none";
      window.game.start();
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

      const camera = new Camera(this.video, {
        onFrame: async () => {
          await this.hands.send({ image: this.video });
        },
        width: 1280,
        height: 720
      });
      camera.start();
    } catch (err) {
      alert("Доступ к веб-камере не получен: " + err.message);
    }
  }

  initMediaPipe() {
    this.hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    this.hands.onResults(this.onResults.bind(this));
  }

  onResults(results) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Mirrored Camera Feed with Dark Cyber Atmosphere
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, w, h);

    // Dark cyber tint
    ctx.fillStyle = "rgba(4, 8, 16, 0.72)";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // 2. Track Hands & Update Blade Positions
    let currentRightTip = null;
    let currentLeftTip = null;

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i].label;
        const isRightHand = handedness === "Left"; // Mirrored

        // Index tip (landmark 8)
        const tipX = (1 - landmarks[8].x) * w;
        const tipY = landmarks[8].y * h;

        if (isRightHand) {
          currentRightTip = { x: tipX, y: tipY, time: Date.now() };
          this.drawHandGhost(landmarks, w, h, "#00f2fe");
        } else {
          currentLeftTip = { x: tipX, y: tipY, time: Date.now() };
          this.drawHandGhost(landmarks, w, h, "#ff007f");
        }
      }
    }

    // Update Blade Trails & Check Slices
    this.updateBladeTrail(this.rightBladeTrail, currentRightTip, "#00f2fe");
    this.updateBladeTrail(this.leftBladeTrail, currentLeftTip, "#ff007f");

    // 3. Update & Render Game Targets and Halves
    window.game.update();
    window.game.render(ctx);

    // 4. Render Glowing Energy Blades
    this.renderBladeRibbon(this.rightBladeTrail, "#00f2fe", "rgba(0, 242, 254, 0.8)");
    this.renderBladeRibbon(this.leftBladeTrail, "#ff007f", "rgba(255, 0, 127, 0.8)");
  }

  updateBladeTrail(trail, currentTip, color) {
    const now = Date.now();

    if (currentTip) {
      if (trail.length > 0) {
        const prev = trail[trail.length - 1];
        // Test slice intersection
        window.game.checkBladeIntersection(prev, currentTip, color);
      }
      trail.push(currentTip);
    }

    // Remove expired points (> 180ms old)
    for (let i = trail.length - 1; i >= 0; i--) {
      if (now - trail[i].time > 180) {
        trail.splice(i, 1);
      }
    }
  }

  renderBladeRibbon(trail, color, glow) {
    if (trail.length < 2) return;
    const ctx = this.ctx;

    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 24;

    for (let i = 1; i < trail.length; i++) {
      const p1 = trail[i - 1];
      const p2 = trail[i];
      const progress = i / trail.length; // 0 to 1

      ctx.strokeStyle = progress > 0.8 ? "#fff" : color;
      ctx.lineWidth = 3 + progress * 9;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Glowing tip orb
    const tip = trail[trail.length - 1];
    ctx.fillStyle = "#fff";
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHandGhost(landmarks, w, h, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.28;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20]
    ];

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

    ctx.restore();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new BladeTrackerApp();
});
