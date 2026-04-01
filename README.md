# ⛏ BlockCast — Minecraft Biome Weather App

> A pixel-art weather dashboard themed around Minecraft biomes.  
> Pure frontend — no build tools, no frameworks, no paid libraries.

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────────┐
│ ⛏ BlockCast          X: 1204 Y: 64 Z: -882    14:22:38 UTC │
├──────────────┬──────────────────────────┬───────────────────┤
│ // BIOME     │                          │  FOREST BIOME     │
│              │   [ animated sky scene ] │                   │
│ ▶ Forest     │   [ pixel trees / fx  ] │  22 °C            │
│   Desert     │   [ clouds / particles] │                   │
│   Ocean      │                          │  FEELS LIKE  19°  │
│   Tundra     ├──────────────────────────┤  HUMIDITY   68%   │
│   Jungle     │ ☀ SUNNY ☁ RAIN ⚡ STORM │  WIND       12km  │
│   Mesa       │ ❄ SNOW  🌫 FOG  7-DAY ▸ │  ALERTS / HOURLY  │
└──────────────┴──────────────────────────┴───────────────────┘
```

---

## ✨ Features

### 🌍 9 Minecraft Biomes
Each biome has a completely unique visual scene, colour palette, weather data, and alerts.

| Biome | Tag | Highlight |
|-------|-----|-----------|
| 🌲 Forest | TEMPERATE | Oak trees, soft blue sky |
| 🏜 Desert | ARID | Cacti, blazing orange sky |
| 🌊 Deep Ocean | MARITIME | Deep blue gradient, waves |
| ❄️ Ice Tundra | FROZEN | Snow pines, crescent moon |
| 🌴 Jungle | TROPICAL | Dense canopy, green sky |
| 🗻 Mesa | BADLANDS | Dead trees, red-orange sky |
| 🐸 Swamp | WETLAND | Gnarled trees, dark moon sky |
| 🔥 Nether | HELLSCAPE | Embers, lava, glowstone |
| 🌌 The End | VOID | End pillars, ender eye, stars |

### ☁️ 6 Weather Modes
Switch weather live — visuals, particles, and stats all update instantly.

| Mode | Effect |
|------|--------|
| ☀️ Sunny | Clear sky, bright sun, +3°C |
| ☁️ Cloudy | Dark clouds, grey tint overlay |
| 🌧 Rain | Pixel raindrop canvas particles |
| ⚡ Storm | Heavy rain + lightning flash animation |
| ❄️ Snow | Drifting pixel snowflakes with wobble |
| 🌫 Fog | Radial fog blobs + CSS backdrop blur |

### 🎨 Visual Design
- **CRT scanline overlay** — full-screen repeating gradient for retro feel
- **Radial vignette** — dark edges like an old monitor
- **Pixel cursor** — gold checkerboard square replaces default pointer
- **Animated sky gradients** — each biome has a unique 3-stop gradient sky
- **Canvas clouds** — blocky pixel clouds drift across at randomised speeds
- **Diorama trees** — pixel-art trees drawn on canvas (oak, pine, jungle, swamp, cactus, dead, End pillars)
- **Ground block rows** — CSS grid-line texture simulating Minecraft block layers
- **Celestial bodies** — pixel sun with glow corners, crescent moon with cutout trick, Ender Eye for The End
- **Canvas particle FX** — rain streaks, snow wobble, fog blobs, nether embers, End sparkles
- **Minimap panel** — 5×5 grid showing current biome location marker

### 📊 Live Weather Data Panel
Every biome + weather combination produces unique readings:
- Temperature & Feels Like (°C)
- Humidity % with animated pixel progress bar
- Wind speed with bar indicator
- Visibility in chunks
- Mob spawn status (PASSIVE / HOSTILE)
- 12-hour hourly forecast strip
- Biome-specific alert cards (info / warn / danger)
- 7-day daily forecast in the bottom bar

---

## 🗂 Project Structure

```
blockcast/
├── pixel-weather-v2.html   ← entire app (single file)
└── README.md
```

This is intentionally a **single-file app** — all HTML, CSS, and JavaScript live in one `.html` file. No bundler, no npm, no backend.

---

## 🚀 Getting Started

### Option 1 — Open directly
Just double-click `pixel-weather-v2.html` in your file explorer. It opens in any modern browser.

### Option 2 — Local server (recommended for best font loading)
```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click → Open with Live Server
```
Then visit `http://localhost:8080/pixel-weather-v2.html`

---

## 🧰 Tech Stack

| Dependency | Version | Purpose |
|------------|---------|---------|
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | Google Fonts | Pixel-art display font |
| [VT323](https://fonts.google.com/specimen/VT323) | Google Fonts | Retro terminal numbers font |
| Vanilla JS | ES6+ | All logic, canvas rendering, state |
| Canvas 2D API | Native | Particles, diorama trees, celestial bodies |
| CSS Variables | Native | Theming and consistent colour system |

**Zero npm packages. Zero build step. Zero paid tools.**

---

## 🎮 How to Use

1. **Pick a biome** from the left sidebar — the scene, sky, and all stats update instantly
2. **Pick a weather mode** from the bottom bar — particles and overlays activate live
3. **Check the right panel** for temperature, humidity, wind, visibility, mob danger, and alerts
4. **Scroll the hourly strip** for a 12-hour forecast
5. **Scroll the bottom bar** for the 7-day daily forecast

---

## 🏗 Architecture Overview

### State
Two global variables drive everything:
```js
let curBiome   = 'forest';   // active biome key
let curWeather = 'sunny';    // active weather key
```
Calling `render()` after any state change rebuilds all visual layers.

### Rendering Pipeline
```
render()
  ├── buildSky()        → CSS gradient on sky div
  ├── buildGround()     → CSS block-grid texture on 3 ground rows
  ├── buildClouds()     → canvas cloud elements injected into DOM
  ├── buildCelestial()  → sun / moon / ender eye drawn to canvas
  ├── applyWxTint()     → weather overlay div + flash animation
  ├── buildMinimap()    → 5×5 grid with active cell highlight
  ├── drawDiorama()     → pixel trees drawn to diorama canvas
  └── updatePanel()     → all right sidebar stats + hourly + alerts + daily
```

### Particle System
`animateFx()` runs in a `requestAnimationFrame` loop on the `#fx` canvas.  
Each particle type is a plain object `{ x, y, vx, vy, ... }` — no classes, no libraries.

```js
// Particle types:
// rain   → vertical streaks, slight left drift
// storm  → heavier/faster version of rain
// snow   → square flakes with sin() wobble
// fog    → large radial gradient blobs drifting right
// nether → rising ember squares with fade-out life cycle
// end    → twinkling stars with sin() opacity pulse
```

---

## 🎨 Colour System (CSS Variables)

```css
--bg:      #080c10   /* page background */
--surface: #0d1520   /* sidebar background */
--panel:   #101820   /* card / cell background */
--border:  #1e2d3d   /* primary border */
--border2: #2a3f55   /* hover border */
--gold:    #ffc94a   /* primary accent — active states, logo */
--cyan:    #4af0ff   /* secondary accent — weather selection */
--green:   #44ff88   /* positive status — passive mobs, online */
--red:     #ff4455   /* danger status — hostile mobs, warnings */
--white:   #e0eeff   /* body text */
--dim:     #3a5070   /* muted labels */
```

---

## 📐 Layout Grid

```
grid-template-columns: 220px  1fr  260px
grid-template-rows:     52px  1fr   44px

┌─────────┬──────────────────┬─────────┐  ← 52px header (spans all 3)
│ Biome   │                  │ Weather │
│ Sidebar │   Viewport       │ Data    │  ← 1fr (fills remaining height)
│  220px  │   (scene + fx)   │  260px  │
├─────────┴──────────────────┤         │
│ Bottom bar (weather + 7day)│         │  ← 44px (spans cols 1-2)
└────────────────────────────┘─────────┘
```

---

## 🔧 Customisation

### Add a new biome
Add an entry to the `BIOMES` object in the script:
```js
BIOMES.savanna = {
  name: 'SAVANNA BIOME',
  tag: 'DRY', tagCol: '#f0a030',
  temp: 28, feels: 32, hum: 25, wind: 20, windP: 45, vis: 18,
  mob: 'PASSIVE', mobCol: '#44ff88',
  coord: 'X: 4400 Y: 66 Z: -200 | OVERWORLD',
  sky: ['#f0b050', '#e89030', '#c07020'],
  groundCols: ['#c0a030', '#a08020', '#808010'],
  celestial: 'sun', celCol: '#fff060',
  cloudCol: '#f0e0a0',
  alerts: [
    { type: 'info', msg: 'Llama herd detected 50 blocks north.' },
  ],
  trees: 4, treeStyle: 'dead',
  extras: [],
};
```
Then add a button in the sidebar HTML:
```html
<button class="biome-btn" data-biome="savanna" onclick="setBiome('savanna')">
  <div class="bico" style="background:linear-gradient(180deg,#f0b050 50%,#a08020 50%)"></div>Savanna
</button>
```

### Add a new tree style
Add a drawing function to `TREE_DEFS`:
```js
TREE_DEFS.palm = (ctx, x, SZ) => {
  drawBlock(ctx, x+SZ, SZ*2, SZ, SZ*6, '#8b6914');        // trunk
  drawBlock(ctx, x-SZ*3, 0,  SZ*7, SZ*2, '#2a8a18');      // canopy
};
```

---

## 📱 Responsive Behaviour

On screens narrower than 900px, both sidebars hide and the bottom bar expands to show weather controls and the daily forecast stacked.

---

## 📄 License

MIT — free to use, modify, and share.

---

> *"It's not just a weather app. It's a biome."*  
> Built with ⛏ and zero npm installs.
