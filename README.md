# ⚡ Портфолио-сайт: Егор Литвинов (woosai)

Современный, быстрый и интерактивный персональный сайт-портфолио в стиле **Cyberpunk / Glassmorphism / Dark Tech Luxury**.

---

## 🌟 Что внутри портфолио

1. **Каталог 12 проектов:**
   - **Telegram & Cloudflare Serverless:**
     - *Такси Радар РБ* (Cloudflare Workers, KV, Cron, Telegram Bot, Яндекс Go / Fasten API)
     - *Gomel Delivery Mini App* (Telegram WebApp для заведений Гомеля, корзина, скидки)
     - *ТОФУ / Малина Gaming* (Durable Objects, WebSocket, pnpm monorepo)
   - **GameDev & 3D WebGL:**
     - *Beam Crash 3D Derby* (Three.js, физическая деформация кузова машин)
     - *ЭнергоДом (Match-3)* (Республиканский конкурс энергосбережения)
     - *Rose Arena* (Игровой хаб «Алый Сад», рулетка кейсов)
     - *За пределами возможного* (3D выставка с флагом на GLSL шейдерах)
   - **Minecraft & Шейдеры:**
     - *Chromatic Abyss* (Шейдерный пост-процессинг мод, Fabric 1.21.1)
     - *Orbital Arsenal* (Спутниковые орбитальные удары, рельсотроны)
   - **Systems, Creative & DevOps:**
     - *Нітка мары* (IX Республиканский конкурс «Здравствуй, мир!», Web Audio API)
     - *Blender Live Bridge IPC* (Python socket bridge для живого стриминга в Blender)
     - *Phone Doctor & VPN Reality* (Android чистка на `aapt2/d8` + VLESS Reality)

2. **Интерактивные фичи:**
   - 🌌 **Генеративный Canvas-фон:** частицы и созвездия, реагирующие на курсор.
   - 🔍 **Категорийные фильтры:** мгновенная фильтрация по направлениям.
   - 🔎 **Модальные окна Deep Dive:** клик по любой карточке открывает подробное описание архитектуры и стек.
   - 💻 **Интерактивный консольный терминал разработчика:** поддержка команд `help`, `skills`, `projects`, `awards`, `whoami`, `contact`, `matrix`, `sudo`, `clear`.
   - 📋 **Быстрое копирование Email** в буфер обмена в 1 клик.
   - 📱 **100% мобильная адаптивность** с плавным выпадающим меню.

---

## 🚀 Как открыть прямо сейчас

### Способ 1: Без установки чего-либо (самый простой)
Просто откройте файл `portfolio/index.html` в вашем браузере (Chrome, Safari, Edge, Firefox). Двойной клик на файл — и сайт работает!

### Способ 2: Через локальный HTTP-сервер
В терминале:
```bash
cd /Users/egorlitvinov/Desktop/гемини/portfolio
python3 -m http.server 3000
```
И откройте в браузере: `http://localhost:3000`

---

## 🌐 Как бесплатно залить в интернет (1-2 минуты)

### Вариант А: Cloudflare Pages (Идеально подходит под стек)
1. Установите wrangler (если еще нет) или зайдите на [dash.cloudflare.com](https://dash.cloudflare.com).
2. Выберите **Workers & Pages** → **Create application** → **Pages**.
3. Загрузите папку `portfolio` или привяжите GitHub-репозиторий.
4. Вы получите молниеносный сайт с бесплатным SSL вида `https://woosai.pages.dev`.

### Вариант Б: GitHub Pages
1. Создайте репозиторий на GitHub (например, `portfolio` или `username.github.io`).
2. Запушьте содержимое папки `portfolio`.
3. В настройках репозитория (*Settings -> Pages*) выберите ветку `main` и нажмите **Save**.

### Вариант В: Vercel
1. Перейдите на [vercel.com](https://vercel.com).
2. Перетащите папку `portfolio` мышкой в окно браузера — сайт будет онлайн через 15 секунд.
