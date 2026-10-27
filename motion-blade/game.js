// ==========================================
// MOTION BLADE // Game Logic & Physics Engine
// ==========================================

class MotionBladeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem("motion_blade_highscore") || "0", 10);
    this.lives = 3;
    this.state = "START"; // START, PLAYING, GAMEOVER

    this.targets = [];
    this.slicedHalves = [];
    this.particles = [];
    this.floatingTexts = [];

    this.comboCount = 0;
    this.lastSliceTime = 0;
    this.spawnTimer = 0;
    this.spawnInterval = 75; // frames
    this.difficulty = 1.0;

    this.shakeAmount = 0;
    this.timeScale = 1.0;
    this.slowMoTimer = 0;

    this.initCanvas();
  }

  initCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.targets = [];
    this.slicedHalves = [];
    this.particles = [];
    this.floatingTexts = [];
    this.state = "PLAYING";
    this.difficulty = 1.0;
    this.updateHUD();
  }

  updateHUD() {
    document.getElementById("score-val").textContent = this.score;
    document.getElementById("highscore-val").textContent = this.highScore;
    
    let hearts = "";
    for (let i = 0; i < 3; i++) {
      hearts += i < this.lives ? "❤️" : "🖤";
    }
    document.getElementById("lives-val").textContent = hearts;
  }

  spawnTarget() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Type distribution
    const rand = Math.random();
    let type = "crystal";
    if (rand < 0.18) type = "bomb";
    else if (rand < 0.32) type = "gold";

    const x = w * 0.15 + Math.random() * (w * 0.7);
    const targetCenterX = w / 2;
    // Launch towards center
    const vx = (targetCenterX - x) * 0.015 + (Math.random() - 0.5) * 4;
    const vy = -(h * 0.017 + Math.random() * 4); // Upward velocity

    this.targets.push({
      x: x,
      y: h + 20,
      vx: vx,
      vy: vy,
      radius: type === "gold" ? 32 : 36,
      type: type,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      color: type === "bomb" ? "#ff3355" : (type === "gold" ? "#ffd700" : "#00f2fe")
    });
  }

  checkBladeIntersection(p1, p2, bladeColor) {
    if (this.state !== "PLAYING") return;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const speed = Math.hypot(dx, dy);

    // Require decent swing velocity to slice
    if (speed < 14) return;

    window.soundEngine.playSwoosh(Math.min(2.0, speed / 25));

    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      // Distance from circle center to line segment (p1 -> p2)
      const dist = this.distToSegment(t.x, t.y, p1.x, p1.y, p2.x, p2.y);

      if (dist < t.radius) {
        // HIT!
        this.sliceTarget(t, i, Math.atan2(dy, dx));
      }
    }
  }

  distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  sliceTarget(t, index, cutAngle) {
    this.targets.splice(index, 1);

    if (t.type === "bomb") {
      // Bomb exploded!
      window.soundEngine.playBomb();
      this.shakeAmount = 25;
      this.lives--;
      this.comboCount = 0;
      this.createExplosion(t.x, t.y, "#ff3355", 60);
      this.addFloatingText("BOOM! -1 LIFE", t.x, t.y, "#ff3355");
      this.updateHUD();

      if (this.lives <= 0) {
        this.gameOver();
      }
      return;
    }

    // Normal or Gold slice
    window.soundEngine.playSlice();

    const now = Date.now();
    if (now - this.lastSliceTime < 450) {
      this.comboCount++;
      if (this.comboCount >= 2) {
        window.soundEngine.playCombo(this.comboCount);
        this.addFloatingText(`COMBO x${this.comboCount}!`, t.x, t.y - 25, "#ffd700", 22);
        this.triggerSlowMo(22);
      }
    } else {
      this.comboCount = 1;
    }
    this.lastSliceTime = now;

    const basePts = t.type === "gold" ? 50 : 10;
    const earned = basePts * this.comboCount;
    this.score += earned;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("motion_blade_highscore", this.highScore.toString());
    }
    this.updateHUD();

    this.addFloatingText(`+${earned}`, t.x, t.y, t.color);
    this.createExplosion(t.x, t.y, t.color, 30);

    // Create 2 sliced halves flying apart
    const normalAngle = cutAngle + Math.PI / 2;
    const push = 6;
    this.slicedHalves.push({
      x: t.x - Math.cos(normalAngle) * 8,
      y: t.y - Math.sin(normalAngle) * 8,
      vx: t.vx - Math.cos(normalAngle) * push,
      vy: t.vy - 3,
      radius: t.radius,
      color: t.color,
      type: t.type,
      cutAngle: cutAngle,
      side: -1,
      rotation: t.rotation,
      vrot: -0.12,
      alpha: 1.0
    });
    this.slicedHalves.push({
      x: t.x + Math.cos(normalAngle) * 8,
      y: t.y + Math.sin(normalAngle) * 8,
      vx: t.vx + Math.cos(normalAngle) * push,
      vy: t.vy - 3,
      radius: t.radius,
      color: t.color,
      type: t.type,
      cutAngle: cutAngle,
      side: 1,
      rotation: t.rotation,
      vrot: 0.12,
      alpha: 1.0
    });
  }

  triggerSlowMo(frames = 20) {
    this.timeScale = 0.35;
    this.slowMoTimer = frames;
  }

  createExplosion(x, y, color, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: color,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  }

  addFloatingText(text, x, y, color = "#fff", size = 18) {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      color: color,
      size: size,
      alpha: 1.0,
      vy: -1.8
    });
  }

  gameOver() {
    this.state = "GAMEOVER";
    document.getElementById("gameover-score").textContent = this.score;
    document.getElementById("gameover-screen").style.display = "flex";
  }

  update() {
    if (this.slowMoTimer > 0) {
      this.slowMoTimer--;
      if (this.slowMoTimer <= 0) this.timeScale = 1.0;
    }

    const dt = this.timeScale;
    const gravity = 0.38 * dt;

    if (this.state === "PLAYING") {
      this.spawnTimer++;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnTarget();
        // Occasionally launch double targets
        if (Math.random() < 0.35) {
          setTimeout(() => this.spawnTarget(), 200);
        }
      }
    }

    // Update targets
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      t.vy += gravity;
      t.rotation += t.rotSpeed * dt;

      // Missed target fell below screen
      if (t.y > this.canvas.height + 60 && t.vy > 0) {
        if (t.type !== "bomb" && this.state === "PLAYING") {
          // Missed a crystal
          this.lives--;
          this.comboCount = 0;
          this.addFloatingText("MISSED!", t.x, this.canvas.height - 40, "#ff3355", 14);
          this.updateHUD();
          if (this.lives <= 0) {
            this.gameOver();
          }
        }
        this.targets.splice(i, 1);
      }
    }

    // Update sliced halves
    for (let i = this.slicedHalves.length - 1; i >= 0; i--) {
      const h = this.slicedHalves[i];
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      h.vy += gravity * 1.1;
      h.rotation += h.vrot * dt;
      h.alpha -= 0.015 * dt;

      if (h.alpha <= 0 || h.y > this.canvas.height + 100) {
        this.slicedHalves.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.1 * dt;
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= 0.02 * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Decay screen shake
    if (this.shakeAmount > 0) {
      this.shakeAmount *= 0.88;
      if (this.shakeAmount < 0.5) this.shakeAmount = 0;
    }
  }

  render(ctx) {
    ctx.save();

    // Apply screen shake
    if (this.shakeAmount > 0) {
      const ox = (Math.random() - 0.5) * this.shakeAmount;
      const oy = (Math.random() - 0.5) * this.shakeAmount;
      ctx.translate(ox, oy);
    }

    // Draw Targets
    this.targets.forEach(t => {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rotation);

      if (t.type === "bomb") {
        // Red Hazard Bomb
        ctx.fillStyle = "#ff1a40";
        ctx.shadowColor = "#ff1a40";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bomb Core & Hazard icon
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(0, 0, t.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ff1a40";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("☠", 0, 1);
      } else {
        // Cyber Crystal / Golden Orb
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 22;

        ctx.beginPath();
        const sides = t.type === "gold" ? 8 : 6;
        for (let i = 0; i < sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          const r = t.radius * (t.type === "gold" && i % 2 === 1 ? 0.6 : 1.0);
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(0, 0, t.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Draw Sliced Halves
    this.slicedHalves.forEach(h => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.globalAlpha = Math.max(0, h.alpha);

      ctx.fillStyle = h.color;
      ctx.shadowColor = h.color;
      ctx.shadowBlur = 15;

      // Draw half circle / semicircle
      ctx.beginPath();
      ctx.arc(0, 0, h.radius, h.cutAngle, h.cutAngle + Math.PI);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Draw Particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Floating Texts
    this.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.font = `bold ${ft.size}px 'Orbitron', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  }
}

window.game = new MotionBladeGame();
