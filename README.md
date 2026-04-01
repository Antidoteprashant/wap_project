# ⛏ PixelWeather — Minecraft Biome Weather App

> A pixel-art weather dashboard themed around Minecraft.  
> Pure frontend — no build tools, no frameworks, no paid libraries.

---

## 📁 File structure
```
pixelweather/
├── index.html              ← full page structure
├── .gitignore
├── css/
│   ├── style.css           ← variables, header, search, layout
│   ├── weather.css         ← weather card, forecast, advice balloon
│   ├── animations.css      ← loading overlay, rain/snow/fog/storm FX
│   └── responsive.css      ← mobile / tablet / desktop breakpoints
└── js/
    ├── utils.js            ← CONFIG, formatters, advice mapper
    ├── api.js              ← fetch wrappers (fetchWeatherData)
    ├── ui.js               ← all DOM rendering (renderCurrentWeather, renderForecast)
    └── app.js              ← event listeners, theme toggle, init
```

---

## ✅ Every M2 task is covered

| Task | How |
|------|-----|
| **API calls using fetch** | `api.js` — `Promise.all()` fires both endpoints simultaneously |
| **Display data dynamically** | `ui.js` — `renderCurrentWeather()` + `renderForecast()` |
| **Loading states** | NES.css `nes-progress` bar + "Building terrain..." overlay |
| **Error states** | NES.css `nes-dialog` "You Died!" with Respawn button |
| **Fully responsive** | `responsive.css` — 4 breakpoints (480 / 768 / 1024 / 1200px) |
| **Bonus: debounce** | `app.js` — `debounce()` utility ready to enable |
| **Bonus: localStorage** | Last searched city + theme saved and restored on reload |

---

## 🚀 Getting Started

#### Option 1 — Open directly
Just double-click `index.html` in your file explorer. It opens in any modern browser.

#### Option 2 — Local server (recommended)
```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```
Then visit `http://localhost:8000/`

---

## ✨ Features

- **🌍 Real-time Data**: Fetches current weather and 5-day forecast from OpenWeatherMap.
- **🎨 NES-Style UI**: Built using the [NES.css](https://nostalgic-css.github.io/NES.css/) framework for a consistent 8-bit aesthetic.
- **🌙 Day/Night Toggle**: Switch between light and dark modes (persisted in localStorage).
- **🌧 Weather Effects**: CSS-based overlays for Rain, Snow, Fog, and Storms that activate based on conditions.
- **💬 Survival Advice**: Randomly generated Minecraft "What to wear" advice based on temperature and weather.
- **💀 Error Handling**: Custom "You Died!" screen if a city search fails or API limit is reached.

---

## 🧰 Tech Stack

- **HTML5 / Vanilla JS (ES6+)**: Core application logic and structure.
- **Vanilla CSS**: Variables, Flexbox/Grid, and custom animations.
- **NES.css**: 8-bit CSS framework.
- **Google Fonts**: "Press Start 2P" for that authentic blocky feel.
- **OpenWeatherMap API**: The engine for all meteorological data.

---

## 📄 License

MIT — free to use, modify, and share.
