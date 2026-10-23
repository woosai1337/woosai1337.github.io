/**
 * Portfolio Application Logic — Egor Litvinov (woosai)
 * Interactive Background, Project Catalog, Terminal Emulator, Modals
 */

// ==========================================
// 1. DATA: 12 FEATURED PROJECTS
// ==========================================
const PROJECTS = [
  {
    id: "taxi-radar-by",
    title: "Такси Радар РБ",
    category: "tg-serverless",
    categoryLabel: "Telegram & Serverless",
    badge: "Cloudflare Edge",
    icon: "🚕",
    image: null,
    gradient: "linear-gradient(135deg, #1e293b, #0f172a)",
    excerpt: "Автономный Serverless-мониторинг коэффициентов Яндекс Go и Fasten в Беларуси с Telegram-оповещениями о снижении цен.",
    description: "Полноценный serverless-сервис на Cloudflare Workers с ежеминутным запуском по Cron Triggers. Сканирует координаты ключевых районов Минска, Гомеля, Бреста, Гродно, Витебска и Могилева, вычисляет динамику коэффициентов через KV Storage и мгновенно оповещает водителей и пассажиров в Telegram о падении повышенного спроса.",
    features: [
      "Архитектура Cloudflare Workers + Scheduled Cron без отдельного сервера",
      "Хранение истории скачков цен и сессий в Cloudflare KV",
      "Поддержка мульти-городов (Минск, Гомель, Гродно, Брест, Витебск, Могилев)",
      "Интеграция с Telegram Bot API и гео-полигонами районов",
      "Нулевой cold-start и ультра-быстрый отклик на Edge"
    ],
    tags: ["Cloudflare Workers", "KV Storage", "Telegram Bot API", "JavaScript", "Cron Triggers", "Edge Computing"]
  },
  {
    id: "gomel-tg-delivery",
    title: "Gomel Delivery Mini App",
    category: "tg-serverless",
    categoryLabel: "Telegram & Serverless",
    badge: "Mini App",
    icon: "🍔",
    image: null,
    gradient: "linear-gradient(135deg, #7c2d12, #18181b)",
    excerpt: "Высокоскоростной Telegram Mini App для кафе и ресторанов: корзина, учет скидок в BYN, промокоды и панель администратора.",
    description: "Готовый прототип Telegram WebApp для заведений общепита. Включает нативное меню блюд с ценами в белорусских рублях, расчет самовывоза (-10%) и промокодов (-15%), мгновенную передачу заказа повару в Telegram и переключение бренда заведения на лету.",
    features: [
      "Работает напрямую внутри Telegram WebApp на смартфонах и ПК",
      "Отказоустойчивый UI на чистом JS/CSS без тяжелых фреймворков",
      "Интерактивная корзина, валидация промокодов и расчет доставки",
      "Режим админ-уведомлений и панель быстрой кастомизации меню"
    ],
    tags: ["Telegram WebApp", "JavaScript", "CSS Glassmorphism", "E-commerce", "Mobile First"]
  },
  {
    id: "malina-tofu",
    title: "ТОФУ / Малина Gaming",
    category: "tg-serverless",
    categoryLabel: "Telegram & Serverless",
    badge: "Monorepo Cloud",
    icon: "🎲",
    image: "assets/projects/malina-art.png",
    excerpt: "Масштабируемая социальная игровая платформа в Telegram на Cloudflare Durable Objects и pnpm-монорепозитории.",
    description: "Многопользовательская игровая экосистема в Telegram на виртуальных очках. Включает краш-механику «Облава» с динамическим ростом множителя, логику безопасных кейсов «Баулы», мины «Схрон» и слоты. Все данные синхронизируются через Cloudflare Durable Objects с защитой от читерства.",
    features: [
      "Монорепозиторий на pnpm (server, web, shared packages)",
      "Серверное состояние на Cloudflare Durable Objects и WebSockets",
      "Честная серверная верификация исходов и защита от рассинхрона",
      "Сезонный арт, кастомные аватары и таблица лидеров"
    ],
    tags: ["Cloudflare Durable Objects", "TypeScript", "WebSocket", "pnpm Monorepo", "Telegram Bot"]
  },
  {
    id: "beam-crash-3d",
    title: "Beam Crash 3D Derby",
    category: "gamedev-3d",
    categoryLabel: "GameDev & 3D WebGL",
    badge: "Physics 3D",
    icon: "🏎️",
    image: null,
    gradient: "linear-gradient(135deg, #1e1b4b, #09090b)",
    excerpt: "3D веб-дерби на Three.js с физической деформацией геометрии машин, динамическими столкновениями и ареной.",
    description: "Аркадная браузерная игра с физическим движком. Включает симуляцию деформации полигональной сетки автомобилей при ударах, расчет импульса и отскоков, частицы искр и пыли, систему сенсорного управления для смартфонов и адаптивную камеру слежения.",
    features: [
      "Процедурная деформация вершин трехмерной модели кузова при коллизиях",
      "Адаптивный рендерер на Three.js и WebGL",
      "Двойное управление: клавиатура (WASD) и виртуальный джойстик на мобильных",
      "Физика ускорения, трения колес и опрокидывания транспорта"
    ],
    tags: ["Three.js", "WebGL", "Game Physics", "3D Modeling", "Mobile Controls"]
  },
  {
    id: "energy-game",
    title: "ЭнергоДом (Match-3)",
    category: "gamedev-3d",
    categoryLabel: "GameDev & 3D WebGL",
    badge: "Конкурсная работа",
    icon: "💡",
    image: "assets/projects/energy-game.png",
    excerpt: "Конкурсная Match-3 игра про энергосбережение в стиле Homescapes: замена фишек, комбо-бонусы и апгрейд комнат дома.",
    description: "Проект для республиканского конкурса по энергосбережению. Игрок решает головоломки с фишками солнечных батарей, лампочек и ветряков, зарабатывает эко-ресурсы и восстанавливает энергоэффективность загородного дома. Разработана на чистом Canvas/JS с кастомным движком анимаций.",
    features: [
      "Кастомный Match-3 движок с механикой падения фишек и цепных реакций",
      "Система бонусов: бомбы, линейные молнии и радужные фишки",
      "Визуальная прогрессия дома с заменой старых приборов на энергоэффективные",
      "Сохранение прогресса, система уровней и звуковое сопровождение"
    ],
    tags: ["Canvas 2D", "JavaScript", "Game Design", "State Engine", "Particle FX"]
  },
  {
    id: "rose-arena",
    title: "Rose Arena (Алый Сад)",
    category: "gamedev-3d",
    categoryLabel: "GameDev & 3D WebGL",
    badge: "Arcade Hub",
    icon: "🌹",
    image: "assets/projects/rose-arena.png",
    excerpt: "Игровой клуб мини-игр: 4 дисциплины, кейсы с кинематографической рулеткой, анимированные карточки и турнирная таблица.",
    description: "Интерактивный аркадный портал в стилистике Cyberpunk / Neon Garden. Объединяет 4 мини-игры на реакцию и стратегию, анимацию открытия кейсов со скроллом предметов, систему инвентаря и сохранение рекордов.",
    features: [
      "4 независимых игровых режима с уникальной механикой",
      "Плавная CSS/Canvas анимация прокрутки рулетки кейсов",
      "Полная автономность: запуск в любом браузере без внешнего бэкенда",
      "Неоновый темный UI с микро-интеракциями"
    ],
    tags: ["JavaScript", "HTML5 Canvas", "UI/UX", "Audio FX", "Game Hub"]
  },
  {
    id: "za-predelami",
    title: "За пределами возможного",
    category: "gamedev-3d",
    categoryLabel: "GameDev & 3D WebGL",
    badge: "Виртуальный музей",
    icon: "🏛️",
    image: null,
    gradient: "linear-gradient(135deg, #064e3b, #022c22)",
    excerpt: "Интерактивная 3D-выставка с физической шейдерной симуляцией флага Беларуси на WebGL и виртуальными залами экспозиции.",
    description: "Виртуальная 3D выставка, приуроченная к Году белорусской женщины. Главная визуальная доминанта — трехмерный развевающийся государственный флаг, реализованный на кастомных вершинных шейдерах Three.js с процедурным ветром и картами нормалей.",
    features: [
      "Вершинный шейдер симуляции развевания ткани на ветру",
      "Интерактивная галерея выдающихся деятельниц истории, науки и спорта",
      "Плавная навигация между экспозициями и 3D зум карточек",
      "Оптимизация рендеринга для мобильных устройств"
    ],
    tags: ["Three.js", "GLSL Shaders", "WebGL", "Digital Exhibition", "Interactive 3D"]
  },
  {
    id: "chromatic-abyss",
    title: "Chromatic Abyss",
    category: "minecraft-shaders",
    categoryLabel: "Minecraft & Шейдеры",
    badge: "Fabric 1.21.1",
    icon: "🔮",
    image: "assets/projects/chromatic-abyss.png",
    excerpt: "Клиентский шейдерный мод для Minecraft: полноэкранная хроматическая аберрация, жидкие преломления, bloom и сканлайны.",
    description: "Графический мод для Minecraft Java Edition (Fabric 1.21.1). Реализует конвейер пост-обработки кадра через кастомные GLSL-шейдеры. Добавляет кинематографические эффекты: спектральный сдвиг цветов по краям экрана, тепловую волну, кинематографический Bloom и стилизацию CRT-монитора.",
    features: [
      "Разработка на Java 21 под Fabric Loom и Minecraft 1.21.1",
      "Собственные GLSL-шейдеры пост-обработки с нулевой просадкой FPS",
      "Тонкая конфигурация параметров через внутриигровые настройки",
      "Поддержка динамического включения эффектов при событиях в игре"
    ],
    tags: ["Java 21", "Fabric API", "GLSL Shaders", "OpenGL", "Minecraft Modding"]
  },
  {
    id: "orbital-arsenal",
    title: "Orbital Arsenal",
    category: "minecraft-shaders",
    categoryLabel: "Minecraft & Шейдеры",
    badge: "Fabric Mod",
    icon: "🛰️",
    image: null,
    gradient: "linear-gradient(135deg, #1e3a8a, #030712)",
    excerpt: "Боевой Fabric-мод для Minecraft: спутниковые кинетические удары, пробивающий рельсотрон и плазменный карабин с перегревом.",
    description: "Технологический оружейный мод для Minecraft 1.21.1. Включает целеуказатель для вызова орбитального лазерного луча со стратосферы с разрушением блоков и ударной волной, рельсотрон с физикой мгновенного лучевого рэйкаста через несколько сущностей и кастомные звуки выстрелов.",
    features: [
      "Кастомная физика снарядов и рейкастинг сквозь препятствия",
      "Процедурные эффекты частиц и система нагрева ствола",
      "Интеграция с физикой повреждений и взрывов Minecraft",
      "Полный цикл сборки через Gradle Loom"
    ],
    tags: ["Java", "Fabric API", "Game Physics", "Minecraft Java", "Raycasting"]
  },
  {
    id: "nitka-mary",
    title: "Нітка мары",
    category: "systems-creative",
    categoryLabel: "Systems & Creative",
    badge: "IX Рэспубліканскі конкурс",
    icon: "🧵",
    image: "assets/projects/nitka-mary.jpg",
    excerpt: "Мультимедийная интерактивная выставка к конкурсу «Здравствуй, мир!»: 6 тематических сцен, дикторская озвучка и анимация.",
    description: "Творческий цифровой проект, объединяющий белорусскую традиционную культуру и современные технологии: рушники, робототехнику, экологию и мечты молодежи. Реализована покадровая анимация сцен, синхронизация со звуковой дорожкой диктора через Web Audio API и субтитры на белорусском языке.",
    features: [
      "6 уникальных отрисованных сцен в единой стилистике (16:9)",
      "Синхронизация воспроизведения голоса с текстовыми субтитрами",
      "Адаптивный медиа-плеер с паузой, перемоткой сцен и таймингами",
      "Участие в IX Республиканском смотре-конкурсе детского творчества"
    ],
    tags: ["Web Audio API", "Animation Engine", "Interactive Story", "Belarusian Heritage"]
  },
  {
    id: "blender-bridge",
    title: "Blender Live Bridge IPC",
    category: "systems-creative",
    categoryLabel: "Systems & Creative",
    badge: "Python Tooling",
    icon: "🧊",
    image: "assets/projects/remont3d.png",
    excerpt: "Высокоскоростной мост автоматизации Blender 3D через сокеты: удаленное исполнение скриптов и генерация геометрии на лету.",
    description: "Инструментарий для автоматизации 3D-пайплайна. Сервер внутри Blender перехватывает команды через сокеты и ставит их в очередь главного потока `bpy`. Позволяет внешним агентам и веб-интерфейсам в реальном времени строить сцены, накладывать материалы и рендерить превью.",
    features: [
      "Многопоточный сокет-сервер с безопасным выполнением в главном цикле Blender",
      "Управление мешами, камерами, светом и материалами через Python `bpy`",
      "Интеграция с веб-конфигуратором Remont3D и Three.js",
      "Мгновенный экспорт в GLTF/OBJ и рендеринг скриншотов"
    ],
    tags: ["Python", "Blender API (bpy)", "Sockets IPC", "3D Automation", "Three.js"]
  },
  {
    id: "phone-doctor-vpn",
    title: "Phone Doctor & DevOps",
    category: "systems-creative",
    categoryLabel: "Systems & Creative",
    badge: "Low-Level & Net",
    icon: "🛡️",
    image: null,
    gradient: "linear-gradient(135deg, #134e4a, #042f2e)",
    excerpt: "Нативная чистка Android без оверхеда Gradle на чистых build-tools + автоматизация VLESS/Reality сетевых шлюзов на VPS.",
    description: "Набор системных проектов: Android-приложение для анализа памяти, собранное вручную через `aapt2 + javac + d8 + zipalign`, а также Bash-скрипты настройки приватного VLESS + XTLS-Reality прокси на удаленных серверах с обходом блокировок и маршрутизацией трафика.",
    features: [
      "Сборка Android APK без Gradle: экстремально легкий размер и быстрый билд",
      "Bash-скрипты развертывания Xray Reality ядра на Ubuntu VPS",
      "TetherTune PowerShell утилита тюнинга MTU/TTL мобильных сетей",
      "Строгая ориентация на конфиденциальность и производительность"
    ],
    tags: ["Android aapt2/d8", "Linux VPS", "Xray / VLESS", "PowerShell", "Networking"]
  }
];

// ==========================================
// 2. BACKGROUND PARTICLES CANVAS
// ==========================================
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse push/pull
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          const lineAlpha = (1 - dist / 130) * 0.16;
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 3. RENDER PROJECTS & FILTERING
// ==========================================
function renderProjects(filter = 'all') {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  container.innerHTML = filtered.map(project => {
    const thumbHtml = project.image 
      ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
      : `<div class="project-illus" style="background: ${project.gradient}">
           <div class="illus-pattern"></div>
           <div class="illus-icon">${project.icon}</div>
         </div>`;

    const tagsHtml = project.tags.slice(0, 4)
      .map(t => `<span class="tech-tag">${t}</span>`).join('');

    return `
      <article class="project-card" data-id="${project.id}">
        <div class="project-thumb">
          ${thumbHtml}
          <span class="project-badge-top">${project.badge}</span>
        </div>
        <div class="project-body">
          <div class="project-category">${project.categoryLabel}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-excerpt">${project.excerpt}</p>
          <div class="project-tech-tags">${tagsHtml}</div>
          <div class="project-card-footer">
            <span class="view-details-link">
              Подробнее о проекте
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </span>
            <span style="font-size: 1.2rem;">${project.icon}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach card click handlers for modal
  container.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openProjectModal(id);
    });
  });
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
}

// ==========================================
// 4. PROJECT MODAL (DEEP DIVE)
// ==========================================
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');

function openProjectModal(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project || !modal) return;

  const mediaEl = document.getElementById('modal-media');
  if (project.image) {
    mediaEl.innerHTML = `<img src="${project.image}" alt="${project.title}">`;
  } else {
    mediaEl.innerHTML = `
      <div class="project-illus" style="background: ${project.gradient}; height: 100%;">
        <div class="illus-pattern"></div>
        <div class="illus-icon" style="font-size: 4.5rem;">${project.icon}</div>
      </div>
    `;
  }

  document.getElementById('modal-category').textContent = project.categoryLabel + ' • ' + project.badge;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-summary').textContent = project.description;

  const featuresList = document.getElementById('modal-features');
  featuresList.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');

  const tagsContainer = document.getElementById('modal-tags');
  tagsContainer.innerHTML = project.tags.map(t => `<span class="tech-tag" style="padding: 5px 12px; font-size: 0.8rem;">${t}</span>`).join('');

  const actionsContainer = document.getElementById('modal-actions');
  actionsContainer.innerHTML = `
    <a href="https://t.me/tarakan_egor" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
      <span>Обсудить похожий проект</span>
    </a>
    <a href="https://github.com/woosai1337" target="_blank" rel="noopener" class="btn btn-glass" style="padding: 10px 20px; font-size: 0.88rem;">
      <span>GitHub автора</span>
    </a>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

// ==========================================
// 5. TERMINAL EMULATOR
// ==========================================
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');
  const chips = document.querySelectorAll('.term-chip');

  if (!form || !input || !output) return;

  const commands = {
    help: () => `
      <div class="terminal-line"><span class="term-hl">Доступные команды:</span></div>
      <div class="terminal-line">  <span class="term-prompt">skills</span>    - Стек технологий и ключевые компетенции</div>
      <div class="terminal-line">  <span class="term-prompt">projects</span>  - Список всех 12 проектов</div>
      <div class="terminal-line">  <span class="term-prompt">awards</span>    - Конкурсные победы и признание</div>
      <div class="terminal-line">  <span class="term-prompt">whoami</span>    - Кратко обо мне</div>
      <div class="terminal-line">  <span class="term-prompt">contact</span>   - Прямые каналы связи</div>
      <div class="terminal-line">  <span class="term-prompt">matrix</span>    - Цифровой дождь в терминале</div>
      <div class="terminal-line">  <span class="term-prompt">sudo</span>      - Запуск с правами суперпользователя</div>
      <div class="terminal-line">  <span class="term-prompt">clear</span>     - Очистить консоль</div>
    `,
    whoami: () => `
      <div class="terminal-line"><span class="term-hl">Егор Литвинов (woosai)</span></div>
      <div class="terminal-line">Роль: Fullstack & Systems Developer, GameDev, Telegram & WebGL Engineer</div>
      <div class="terminal-line">Локация: Беларусь</div>
      <div class="terminal-line">Специализация: Быстрые Serverless-решения (Cloudflare), Telegram Mini Apps, 3D WebGL, шейдеры и Fabric-моды.</div>
    `,
    skills: () => `
      <div class="terminal-line"><span class="term-hl">АРСЕНАЛ НАВЫКОВ:</span></div>
      <div class="terminal-line">⚡ <span class="term-prompt">Cloudflare & Backend:</span> Workers, KV, Durable Objects, Cron, WebSockets, Node/TS</div>
      <div class="terminal-line">📱 <span class="term-prompt">Telegram WebApps:</span> Telegram Bot API, Mini App UI, Instant Checkouts</div>
      <div class="terminal-line">🎮 <span class="term-prompt">3D & GameDev:</span> Three.js, WebGL 2.0, GLSL Shaders, Physics Engines, Canvas 2D</div>
      <div class="terminal-line">💎 <span class="term-prompt">Minecraft & Java:</span> Java 21, Fabric Modding, Mixins, Raycasting, Screen PostFX</div>
      <div class="terminal-line">🛠️ <span class="term-prompt">Systems & DevOps:</span> Blender Scripting (bpy), Docker, Linux VPS, Xray/VLESS Reality, aapt2</div>
    `,
    projects: () => {
      return PROJECTS.map((p, idx) => `
        <div class="terminal-line">${idx + 1}. <span class="term-hl">${p.title}</span> [${p.categoryLabel}] — ${p.excerpt}</div>
      `).join('');
    },
    awards: () => `
      <div class="terminal-line">🏆 <span class="term-hl">IX Рэспубліканскі конкурс «Здравствуй, мир!»</span> — Проект «Нітка мары»</div>
      <div class="terminal-line">⚡ <span class="term-hl">Республиканский конкурс энергосбережения</span> — Игра «ЭнергоДом» (Match-3)</div>
      <div class="terminal-line">🏛️ <span class="term-hl">Год белорусской женщины</span> — 3D выставка «За пределами возможного»</div>
    `,
    contact: () => `
      <div class="terminal-line">Telegram: <a href="https://t.me/tarakan_egor" target="_blank" style="color: #38bdf8; text-decoration: underline;">@tarakan_egor</a></div>
      <div class="terminal-line">GitHub:   <a href="https://github.com/woosai1337" target="_blank" style="color: #38bdf8; text-decoration: underline;">github.com/woosai1337</a></div>
      <div class="terminal-line">Email:    <a href="mailto:woosaiiiii@gmail.com" style="color: #38bdf8; text-decoration: underline;">woosaiiiii@gmail.com</a></div>
    `,
    sudo: () => `
      <div class="terminal-line" style="color: #ef4444;">[sudo] пароль для woosai: ***********</div>
      <div class="terminal-line" style="color: #f59e0b;">Доступ предоставлен! Кофе варится, баги фиксируются... ☕</div>
    `,
    matrix: () => {
      runMatrixEffect(output);
      return `<div class="terminal-line" style="color: #10b981;">Wake up, Neo... Follow the white rabbit 🐇</div>`;
    },
    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(cmdStr) {
    const raw = cmdStr.trim().toLowerCase();
    if (!raw) return;

    if (raw === 'clear') {
      commands.clear();
      return;
    }

    const commandEntry = document.createElement('div');
    commandEntry.innerHTML = `
      <div class="terminal-line" style="margin-top: 10px;">
        <span class="term-prompt">woosai@macbook:~$</span> <span>${escapeHtml(cmdStr)}</span>
      </div>
    `;
    output.appendChild(commandEntry);

    if (commands[raw]) {
      const res = commands[raw]();
      if (res) {
        const resDiv = document.createElement('div');
        resDiv.innerHTML = res;
        output.appendChild(resDiv);
      }
    } else {
      const errDiv = document.createElement('div');
      errDiv.innerHTML = `
        <div class="terminal-line" style="color: #ef4444;">
          zsh: команда не найдена: ${escapeHtml(raw)}. Введите <span class="term-hl">help</span> для списка.
        </div>
      `;
      output.appendChild(errDiv);
    }

    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    executeCommand(val);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

function runMatrixEffect(container) {
  const lines = [
    "01000101 01100111 01101111 01110010",
    "4C 69 74 76 69 6E 6F 76 20 28 77 6F 6F 73 61 69 29",
    "SYSTEM BREACH: CLOUDFLARE_WORKERS_ONLINE",
    "INJECTING GLSL SHADERS INTO MATRIX PIPELINE...",
    "ACCESS GRANTED: FULLSTACK_GOD_MODE_ACTIVATED"
  ];
  lines.forEach((l, i) => {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'terminal-line';
      d.style.color = '#10b981';
      d.style.fontFamily = 'monospace';
      d.textContent = l;
      container.appendChild(d);
    }, i * 150);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ==========================================
// 6. COPY EMAIL & UI CONTROLS
// ==========================================
function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  const indicator = document.getElementById('copy-indicator');
  if (!btn || !indicator) return;

  btn.addEventListener('click', () => {
    const email = 'woosaiiiii@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      indicator.textContent = 'Скопировано! ✅';
      indicator.style.color = '#34d399';
      setTimeout(() => {
        indicator.textContent = '📋';
        indicator.style.color = '';
      }, 2500);
    }).catch(() => {
      indicator.textContent = 'Скопируйте: ' + email;
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.toggle('active');
  });

  drawer.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  });
}

// ==========================================
// 7. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  renderProjects('all');
  initFilters();
  initTerminal();
  initCopyEmail();
  initMobileMenu();
});
