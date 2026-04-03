# Technical Specification — PixelWeather
# For Claude Code Implementation

---

## IMPORTANT INSTRUCTIONS FOR CLAUDE CODE

You are building **PixelWeather**, a Minecraft-themed weather dashboard. Read this entire document and `PRD.md` before writing any code.

**Stack:** Vanilla HTML + CSS + JavaScript. No React, no Vue, no Angular, no build tools.
**CSS Libraries:** NES.css + Animate.css + Google Fonts (all via CDN).
**JS Libraries:** NONE. Use native `fetch()`, `querySelector()`, etc.

---

## 1. CDN Links (put these in `<head>`)

```html
<!-- Google Font: Press Start 2P (pixel font, required by NES.css) -->
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

<!-- NES.css: 8-bit pixel-art UI framework (buttons, containers, inputs, icons, dialogs, progress bars) -->
<link href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css" rel="stylesheet" />

<!-- Animate.css: predefined CSS animations (fadeIn, bounceIn, shakeX, flash, etc.) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
```

**Global font rule (required for NES.css to look correct):**
```css
html, body, pre, code, kbd, samp {
  font-family: "Press Start 2P", monospace;
}
```

---

## 2. NES.css Component Reference

Use these NES.css classes throughout. Do NOT build buttons, inputs, or containers from scratch — NES.css already provides them in pixel-art style.

### Containers
```html
<!-- Light container -->
<div class="nes-container with-title">
  <p class="title">Current Weather</p>
  <p>Content here</p>
</div>

<!-- Dark container (for night mode and search bar) -->
<div class="nes-container is-dark with-title">
  <p class="title">Ender Chest</p>
  <p>Content here</p>
</div>

<!-- Rounded container -->
<div class="nes-container is-rounded">
  <p>Rounded content</p>
</div>
```

### Buttons
```html
<button type="button" class="nes-btn">Normal</button>
<button type="button" class="nes-btn is-primary">Primary</button>
<button type="button" class="nes-btn is-success">Success</button>
<button type="button" class="nes-btn is-warning">Warning</button>
<button type="button" class="nes-btn is-error">Error/Danger</button>
<button type="button" class="nes-btn is-disabled">Disabled</button>
```

### Text Input
```html
<div class="nes-field">
  <label for="search">Search City</label>
  <input type="text" id="search" class="nes-input" placeholder="/weather <city>">
</div>

<!-- Dark variant -->
<div class="nes-field">
  <input type="text" id="search" class="nes-input is-dark" placeholder="/weather <city>">
</div>
```

### Select Dropdown
```html
<div class="nes-select">
  <select id="filter-select">
    <option value="all">All Conditions</option>
    <option value="Clear">Sunny</option>
    <option value="Clouds">Cloudy</option>
    <option value="Rain">Rainy</option>
  </select>
</div>

<!-- Dark variant -->
<div class="nes-select is-dark">
  <select>...</select>
</div>
```

### Icons (Pixel Art — built into NES.css)
```html
<!-- Hearts (use for "feels like" temperature) -->
<i class="nes-icon heart"></i>           <!-- Full heart -->
<i class="nes-icon is-half heart"></i>   <!-- Half heart -->
<i class="nes-icon is-empty heart"></i>  <!-- Empty heart -->

<!-- Stars (use for favorites) -->
<i class="nes-icon star"></i>            <!-- Full star -->
<i class="nes-icon is-empty star"></i>   <!-- Empty star -->

<!-- Other useful icons -->
<i class="nes-icon trophy"></i>          <!-- Trophy -->
<i class="nes-icon like"></i>            <!-- Thumbs up -->
<i class="nes-icon close"></i>           <!-- X / close -->

<!-- Icon sizes -->
<i class="nes-icon is-small heart"></i>
<i class="nes-icon is-medium heart"></i>
<i class="nes-icon is-large heart"></i>
```

### Dialog / Modal (for error screen)
```html
<!-- Trigger dialog with JS: document.getElementById('dialog-error').showModal() -->
<dialog class="nes-dialog is-dark is-rounded" id="dialog-error">
  <form method="dialog">
    <p class="title">You died!</p>
    <p id="error-message">City not found in the overworld!</p>
    <menu class="dialog-menu">
      <button class="nes-btn is-error">Respawn</button>
    </menu>
  </form>
</dialog>
```

### Progress Bar (for loading)
```html
<progress class="nes-progress is-primary" value="70" max="100"></progress>
<progress class="nes-progress is-success" value="100" max="100"></progress>
```

### Balloon / Tooltip (for weather advice)
```html
<div class="nes-balloon from-left">
  <p>Bring a boat! Depth Strider enchant recommended.</p>
</div>

<div class="nes-balloon from-right">
  <p>Perfect day to go mining. No mobs in sight!</p>
</div>
```

### Lists
```html
<ul class="nes-list is-disc">
  <li>Humidity: 65%</li>
  <li>Wind: 12 km/h</li>
  <li>Pressure: 1013 hPa</li>
</ul>
```

### Checkboxes (optional, for settings)
```html
<label>
  <input type="checkbox" class="nes-checkbox" checked />
  <span>Show Minecraft Advice</span>
</label>
```

---

## 3. Animate.css Usage Reference

Add animation classes to elements when they enter the DOM. Always include the `animate__animated` base class.

```html
<!-- Fade in weather card when data loads -->
<div class="nes-container animate__animated animate__fadeInUp">...</div>

<!-- Bounce in the favorite star when toggled -->
<i class="nes-icon star animate__animated animate__bounceIn"></i>

<!-- Shake the error dialog -->
<dialog class="nes-dialog animate__animated animate__shakeX">...</dialog>

<!-- Flash effect for thunderstorm -->
<div class="overlay animate__animated animate__flash">...</div>
```

**Useful Animate.css classes for this project:**
| Animation | Use Case |
|-----------|----------|
| `animate__fadeIn` | Generic card/section entrance |
| `animate__fadeInUp` | Weather card appearing after search |
| `animate__fadeInDown` | Snow-weather card entrance |
| `animate__bounceIn` | Favorite star toggle |
| `animate__shakeX` | Error state, thunderstorm shake |
| `animate__flash` | Lightning/thunderstorm flash |
| `animate__pulse` | Loading text pulse |
| `animate__fadeOut` | Removing elements smoothly |
| `animate__zoomIn` | Dialog appearing |

**Adding animation via JavaScript:**
```javascript
function animateElement(element, animationName) {
  element.classList.add("animate__animated", `animate__${animationName}`);
  element.addEventListener("animationend", () => {
    element.classList.remove("animate__animated", `animate__${animationName}`);
  }, { once: true });
}

// Usage:
animateElement(weatherCard, "fadeInUp");
animateElement(errorDialog, "shakeX");
```

---

## 4. API Integration

### 4.1 API Key

```javascript
// js/api.js
// ============================================================
// HOW TO GET YOUR FREE API KEY:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Go to "API Keys" in your profile
// 4. Copy your key and paste it below
// 5. NOTE: New keys take ~2 hours to activate
// ============================================================
const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
```

### 4.2 Fetch Functions

```javascript
// js/api.js

async function fetchCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`City "${city}" not found in the overworld!`);
  }
  return response.json();
}

async function fetchForecast(city) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast unavailable for "${city}"!`);
  }
  return response.json();
}
```

### 4.3 Forecast Processing

The `/forecast` endpoint returns 40 items (3-hour intervals × 5 days). Group by date, pick midday:

```javascript
// js/utils.js

function processForecast(forecastData) {
  const dailyMap = {};

  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);

    if (!dailyMap[date] || Math.abs(hour - 12) < Math.abs(parseInt(dailyMap[date].dt_txt.split(" ")[1]) - 12)) {
      dailyMap[date] = item;
    }
  });

  return Object.values(dailyMap).slice(0, 5);
}
```

### 4.4 Error Handling Pattern

```javascript
try {
  showLoading();
  const [currentData, forecastData] = await Promise.all([
    fetchCurrentWeather(city),
    fetchForecast(city)
  ]);
  renderCurrentWeather(currentData);
  renderForecast(processForecast(forecastData));
  renderAdvice(currentData.weather[0].main);
  updateWeatherBackground(currentData.weather[0].main);
  saveLastCity(city);
} catch (error) {
  showError(error.message);
} finally {
  hideLoading();
}
```

---

## 5. Data Operations — STRICT HOF REQUIREMENT

**CRITICAL: Do NOT use `for`, `while`, `do...while`, or `for...of` loops for ANY data processing. Use ONLY Array Higher-Order Functions.**

### 5.1 Search

```javascript
// js/search.js
function searchFavorites(favorites, query) {
  const lowerQuery = query.toLowerCase();
  return favorites.filter(city =>
    city.name.toLowerCase().includes(lowerQuery)
  );
}
```

### 5.2 Filter

```javascript
// js/filter.js
function filterByCondition(cities, condition) {
  if (condition === "all") return cities;
  return cities.filter(city =>
    city.weather[0].main.toLowerCase() === condition.toLowerCase()
  );
}
```

### 5.3 Sort

```javascript
// js/sort.js
function sortCities(cities, criteria, order = "asc") {
  const sorted = [...cities].sort((a, b) => {
    if (criteria === "name") return a.name.localeCompare(b.name);
    if (criteria === "temp") return a.main.temp - b.main.temp;
    if (criteria === "humidity") return a.main.humidity - b.main.humidity;
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}
```

### 5.4 Rendering Arrays — ALWAYS use HOFs

```javascript
// CORRECT — use .map() or .forEach()
const html = forecastDays.map(day => createForecastCardHTML(day)).join("");
container.innerHTML = html;

// ALSO CORRECT
forecastDays.forEach(day => {
  container.appendChild(createForecastCard(day));
});

// NEVER DO THIS — will lose marks
for (let i = 0; i < forecastDays.length; i++) { ... }
```

---

## 6. localStorage

### 6.1 Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `pixelweather_favorites` | JSON array of city weather objects | Saved favorites |
| `pixelweather_theme` | `"day"` or `"night"` | Theme preference |
| `pixelweather_lastCity` | string | Last searched city |

### 6.2 Implementation

```javascript
// js/favorites.js

function getFavorites() {
  const data = localStorage.getItem("pixelweather_favorites");
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("pixelweather_favorites", JSON.stringify(favorites));
}

function addFavorite(cityData) {
  const favorites = getFavorites();
  const exists = favorites.find(fav => fav.id === cityData.id);
  if (!exists) {
    favorites.push(cityData);
    saveFavorites(favorites);
  }
}

function removeFavorite(cityId) {
  const favorites = getFavorites().filter(fav => fav.id !== cityId);
  saveFavorites(favorites);
}

function isFavorite(cityId) {
  return getFavorites().some(fav => fav.id === cityId);
}

function saveLastCity(city) {
  localStorage.setItem("pixelweather_lastCity", city);
}

function getLastCity() {
  return localStorage.getItem("pixelweather_lastCity") || "";
}
```

---

## 7. Debouncing

```javascript
// js/utils.js

function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

Apply to search input:
```javascript
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", debounce((e) => {
  const query = e.target.value.trim();
  if (query.length >= 2) {
    // Filter favorites locally as user types
    const filtered = searchFavorites(getFavorites(), query);
    renderFavorites(filtered);
  }
}, 300));
```

---

## 8. Theme Toggle (Day/Night)

```javascript
// js/theme.js

function initTheme() {
  const saved = localStorage.getItem("pixelweather_theme") || "day";
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("pixelweather_theme", theme);

  // Swap NES.css container variants
  const containers = document.querySelectorAll(".nes-container.theme-aware");
  containers.forEach(container => {
    if (theme === "night") {
      container.classList.add("is-dark");
    } else {
      container.classList.remove("is-dark");
    }
  });

  // Update toggle button text
  const toggleBtn = document.querySelector("#theme-toggle");
  if (toggleBtn) {
    toggleBtn.textContent = theme === "day" ? "Night Mode" : "Day Mode";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "day" ? "night" : "day");
}
```

### CSS Variables

```css
/* css/style.css */

:root[data-theme="day"] {
  --bg-primary: #87CEEB;
  --bg-secondary: #5B8731;
  --bg-surface: #F0F0F0;
  --text-primary: #3F3F3F;
  --text-heading: #FFFFFF;
  --accent: #5DB12F;
  --accent-gold: #FCDB05;
  --danger: #FF5555;
  --shadow-color: rgba(0, 0, 0, 0.2);
}

:root[data-theme="night"] {
  --bg-primary: #1A1A2E;
  --bg-secondary: #2D1B4E;
  --bg-surface: #2A2A3E;
  --text-primary: #FFFFFF;
  --text-heading: #FCDB05;
  --accent: #A020F0;
  --accent-gold: #FCDB05;
  --danger: #FF5555;
  --shadow-color: rgba(0, 0, 0, 0.5);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: "Press Start 2P", monospace;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
```

---

## 9. CSS Architecture

### File Structure

| File | Contents |
|------|----------|
| `css/style.css` | CSS variables for day/night, global resets, body styling, NES.css overrides (colors, fonts), layout grid, page backgrounds |
| `css/weather.css` | Weather card layout, forecast row flex, advice balloon positioning, temperature display, weather icon containers, favorite star styling, detail expansion |
| `css/animations.css` | Rain drops (falling blue pixels), snowfall (falling white squares), loading overlay with progress bar, thunderstorm flash, fog overlay, weather background transitions |
| `css/responsive.css` | Breakpoints: 768px (tablet), 1024px (desktop). Stack layout on mobile, sidebar on desktop |

### NES.css Color Overrides (Minecraft palette)

```css
/* css/style.css — Override NES.css defaults with Minecraft colors */

/* Make primary buttons green (creeper green) in day mode */
[data-theme="day"] .nes-btn.is-primary {
  background-color: #5DB12F;
  color: #FFFFFF;
}

/* Make primary buttons purple (ender) in night mode */
[data-theme="night"] .nes-btn.is-primary {
  background-color: #A020F0;
  color: #FFFFFF;
}

/* Gold accents for stars and highlights */
.nes-icon.star {
  color: #FCDB05;
}

/* Minecraft-style text shadow on all headings */
h1, h2, h3, .title {
  text-shadow: 2px 2px 0px var(--shadow-color);
  color: var(--text-heading);
}

/* Override NES.css dialog for dark Minecraft death screen */
.nes-dialog.death-screen {
  background-color: #2D0000;
  color: #FF5555;
}
```

### Weather Animations (custom CSS — NOT from NES.css or Animate.css)

```css
/* css/animations.css */

/* ===== Loading Overlay ===== */
.loading-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #866043; /* Minecraft dirt color */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  gap: 20px;
}

.loading-overlay.hidden {
  display: none;
}

.loading-overlay p {
  font-size: 14px;
  color: #FFFFFF;
  text-shadow: 2px 2px 0px #3F3F3F;
}

/* ===== Rain ===== */
.rain-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.rain-drop {
  position: absolute;
  top: -20px;
  width: 3px;
  height: 12px;
  background: #5B8EFF;
  image-rendering: pixelated;
  animation: rainFall linear infinite;
}

@keyframes rainFall {
  0%   { transform: translateY(-20px); opacity: 0.8; }
  100% { transform: translateY(100vh); opacity: 0.4; }
}

/* ===== Snow ===== */
.snow-flake {
  position: absolute;
  top: -10px;
  width: 6px;
  height: 6px;
  background: #FFFFFF;
  image-rendering: pixelated;
  animation: snowFall linear infinite;
}

@keyframes snowFall {
  0%   { transform: translateY(-10px) translateX(0); opacity: 1; }
  50%  { transform: translateY(50vh) translateX(15px); }
  100% { transform: translateY(100vh) translateX(-10px); opacity: 0.7; }
}

/* ===== Lightning Flash ===== */
.lightning-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  z-index: 2;
  animation: lightningFlash 0.15s ease-out;
}

@keyframes lightningFlash {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}

/* ===== Fog ===== */
.fog-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 1;
}

[data-theme="night"] .fog-overlay {
  background: rgba(100, 100, 120, 0.4);
}
```

**Generate rain/snow drops via JavaScript:**
```javascript
// js/ui.js

function createWeatherParticles(type, count = 40) {
  const container = document.getElementById("weather-animation");
  container.innerHTML = ""; // Clear previous

  if (type === "rain" || type === "snow") {
    Array.from({ length: count }).forEach(() => {
      const particle = document.createElement("div");
      particle.classList.add(type === "rain" ? "rain-drop" : "snow-flake");
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 1.5 + 0.8}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(particle);
    });
  }
}
```

---

## 10. HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en" data-theme="day">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PixelWeather — Minecraft Weather Dashboard</title>

  <!-- Libraries (CDN) -->
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <link href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/weather.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>

  <!-- ===== LOADING OVERLAY ===== -->
  <div id="loading-overlay" class="loading-overlay hidden">
    <p class="animate__animated animate__pulse animate__infinite">Building terrain...</p>
    <progress class="nes-progress is-primary" value="70" max="100" style="width: 300px;"></progress>
  </div>

  <!-- ===== ERROR DIALOG ===== -->
  <dialog class="nes-dialog is-dark is-rounded death-screen" id="error-dialog">
    <form method="dialog">
      <p class="title">You died!</p>
      <p id="error-message">Something went wrong in the overworld!</p>
      <menu class="dialog-menu">
        <button class="nes-btn is-error" id="respawn-btn">Respawn</button>
      </menu>
    </form>
  </dialog>

  <!-- ===== HEADER ===== -->
  <header class="app-header">
    <div class="header-top">
      <h1 class="game-title">PixelWeather</h1>
      <button type="button" class="nes-btn is-warning" id="theme-toggle">Night Mode</button>
    </div>

    <!-- Search Bar (styled like Minecraft command input) -->
    <div class="search-section">
      <div class="nes-container is-dark search-container">
        <div class="search-row">
          <span class="search-prefix">/weather</span>
          <div class="nes-field search-field">
            <input type="text" id="search-input" class="nes-input is-dark" placeholder="Enter city name..." autocomplete="off">
          </div>
          <button type="button" class="nes-btn is-primary" id="search-btn">Search</button>
        </div>
      </div>
    </div>
  </header>

  <!-- ===== MAIN LAYOUT ===== -->
  <div class="app-layout">

    <!-- Main Content -->
    <main class="main-content">

      <!-- Current Weather Card -->
      <section id="current-weather-section" class="hidden">
        <div class="nes-container with-title theme-aware" id="weather-card">
          <p class="title" id="city-name">City Name</p>
          <div id="weather-content">
            <!-- Rendered dynamically by ui.js -->
          </div>
        </div>
      </section>

      <!-- Minecraft Advice Balloon -->
      <section id="advice-section" class="hidden">
        <div class="nes-balloon from-left" id="advice-balloon">
          <p id="advice-text">Advice loads here...</p>
        </div>
      </section>

      <!-- 5-Day Forecast -->
      <section id="forecast-section" class="hidden">
        <h2 class="section-heading">5-Day Forecast</h2>
        <div class="forecast-row" id="forecast-row">
          <!-- 5 forecast cards rendered dynamically -->
        </div>
      </section>

    </main>

    <!-- Favorites Sidebar -->
    <aside class="favorites-sidebar">
      <div class="nes-container with-title theme-aware">
        <p class="title">Ender Chest</p>

        <!-- Filter & Sort Controls -->
        <div class="controls-row">
          <div class="nes-select">
            <select id="filter-select">
              <option value="all">All Weather</option>
              <option value="Clear">Sunny</option>
              <option value="Clouds">Cloudy</option>
              <option value="Rain">Rainy</option>
              <option value="Snow">Snowy</option>
              <option value="Thunderstorm">Stormy</option>
            </select>
          </div>
          <div class="nes-select">
            <select id="sort-select">
              <option value="name-asc">Name A→Z</option>
              <option value="name-desc">Name Z→A</option>
              <option value="temp-asc">Temp ↑</option>
              <option value="temp-desc">Temp ↓</option>
              <option value="humidity-asc">Humidity ↑</option>
            </select>
          </div>
        </div>

        <!-- Favorites Grid -->
        <div id="favorites-grid" class="favorites-grid">
          <!-- Rendered dynamically -->
          <p class="empty-state" id="empty-favorites">No saved cities yet. Search and star a city!</p>
        </div>
      </div>
    </aside>

  </div>

  <!-- Weather Particle Animation Container -->
  <div id="weather-animation" class="rain-container"></div>

  <!-- ===== SCRIPTS ===== -->
  <script src="js/utils.js"></script>
  <script src="js/api.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/favorites.js"></script>
  <script src="js/search.js"></script>
  <script src="js/filter.js"></script>
  <script src="js/sort.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 11. JavaScript Module Responsibilities

### `js/app.js` — Entry Point
- On `DOMContentLoaded`:
  - Call `initTheme()` to load saved theme.
  - Load last searched city from localStorage and fetch its weather.
  - Load and render favorites.
  - Attach event listeners: search input (debounced), search button, theme toggle, filter dropdown, sort dropdown, respawn button.

### `js/api.js` — API Layer
- `fetchCurrentWeather(city)` → Promise<JSON>
- `fetchForecast(city)` → Promise<JSON>
- Both with error handling (throw on non-OK response).

### `js/ui.js` — DOM Rendering
- `renderCurrentWeather(data)` — Build weather card HTML with NES.css components and Animate.css entrance.
- `renderForecast(days)` — Build 5 forecast `nes-container` cards in the forecast row.
- `renderAdvice(condition)` — Fill the `nes-balloon` with Minecraft advice.
- `renderFavorites(favorites)` — Build the favorites grid with star icons and mini weather info.
- `showLoading()` / `hideLoading()` — Toggle loading overlay.
- `showError(message)` — Open the `nes-dialog` with `showModal()` and set message.
- `hideError()` — Close the dialog.
- `updateWeatherBackground(condition)` — Change body background + add/remove rain/snow particles.
- `createWeatherParticles(type, count)` — Generate rain/snow DOM elements.
- `animateElement(el, animName)` — Add Animate.css class, remove after animation ends.

### `js/search.js` — Search Logic
- Debounced handler on search input that filters favorites locally.
- Button click / Enter press handler that calls API and renders results.
- Saves last city to localStorage.

### `js/favorites.js` — Favorites CRUD
- `getFavorites()`, `saveFavorites()`, `addFavorite()`, `removeFavorite()`, `isFavorite()`.
- `saveLastCity()`, `getLastCity()`.

### `js/filter.js` — Filter
- `filterByCondition(cities, condition)` using `.filter()`.

### `js/sort.js` — Sort
- `sortCities(cities, criteria, order)` using `.sort()`.

### `js/theme.js` — Theme
- `initTheme()`, `applyTheme(theme)`, `toggleTheme()`.
- Swaps `data-theme` on `<html>`.
- Adds/removes `is-dark` on `.theme-aware` NES.css containers.

### `js/utils.js` — Helpers
- `debounce(fn, delay)`
- `processForecast(data)` — 40 items → 5 daily.
- `getWeatherConfig(condition)` — Returns icon, advice, bgClass.
- `formatTemp(celsius)` — e.g., "24°C".
- `formatDate(timestamp)` — e.g., "Mon".
- `getWindDirection(degrees)` — e.g., "NW".

---

## 12. Weather Config Map

```javascript
// js/utils.js

const WEATHER_CONFIG = {
  Clear:        { icon: "☀️", advice: "Perfect day to go mining. No mobs in sight!", bg: "weather-clear" },
  Clouds:       { icon: "☁️", advice: "Overcast skies. Spiders may spawn early.", bg: "weather-cloudy" },
  Rain:         { icon: "🌧️", advice: "Bring a boat! Depth Strider enchant recommended.", bg: "weather-rain", particles: "rain" },
  Drizzle:      { icon: "🌦️", advice: "Light drizzle. Crops will love this!", bg: "weather-rain", particles: "rain" },
  Thunderstorm: { icon: "⛈️", advice: "Lightning incoming! Channeling trident time!", bg: "weather-storm", particles: "rain" },
  Snow:         { icon: "❄️", advice: "Snow golems incoming! Grab a shovel.", bg: "weather-snow", particles: "snow" },
  Mist:         { icon: "🌫️", advice: "Low visibility. Render distance: 2 chunks.", bg: "weather-fog" },
  Fog:          { icon: "🌫️", advice: "Dense fog. Watch for creepers sneaking up.", bg: "weather-fog" },
  Haze:         { icon: "🌫️", advice: "Hazy skies. Like the Nether, minus the fire.", bg: "weather-fog" },
  Smoke:        { icon: "🌫️", advice: "Smoky air. Someone left a furnace running.", bg: "weather-fog" },
  Dust:         { icon: "🌪️", advice: "Desert biome detected. Sand everywhere.", bg: "weather-fog" },
};

function getWeatherConfig(condition) {
  return WEATHER_CONFIG[condition] || WEATHER_CONFIG["Clear"];
}
```

---

## 13. Implementation Order

Build in this exact sequence for clean, incremental progress:

1. **`index.html`** — Full skeleton with NES.css components, CDN links, all sections.
2. **`css/style.css`** — CSS variables, body styling, NES.css color overrides, layout grid.
3. **`css/weather.css`** — Weather card layout, forecast flex row, advice balloon, star toggle.
4. **`js/utils.js`** — All helper functions.
5. **`js/api.js`** — Fetch functions.
6. **`js/ui.js`** — All render functions. Test with hardcoded mock data first.
7. **`js/theme.js`** — Theme toggle + `is-dark` swapping.
8. **`js/app.js`** — Wire search → fetch → render, theme toggle, initial load.
9. **`js/favorites.js`** — Add/remove favorites, render grid.
10. **`js/filter.js`** + **`js/sort.js`** — Filter/sort the favorites.
11. **`css/animations.css`** — Rain, snow, loading, fog, lightning.
12. **`css/responsive.css`** — Mobile/tablet breakpoints.
13. **Polish** — Test all screen sizes, conditions, empty/error states, add Animate.css classes.
14. **`README.md`** — Full documentation.

---

## 14. Commit Strategy

```
"Initial project setup with HTML skeleton and CDN links"
"Add NES.css themed CSS variables and global styles"
"Style weather card and forecast row with NES.css containers"
"Implement OpenWeatherMap API fetch functions"
"Render current weather data dynamically using NES.css components"
"Add 5-day forecast display with NES.css container cards"
"Implement city search with debouncing"
"Add Minecraft weather advice balloon system"
"Implement favorites with localStorage and NES.css star icons"
"Add filter by weather condition using .filter() HOF"
"Add sort by temp/name/humidity using .sort() HOF"
"Implement day/night theme toggle with NES.css is-dark variants"
"Add rain and snow particle animations"
"Add loading overlay and error dialog with NES.css progress/dialog"
"Add Animate.css entrance effects to weather cards"
"Make layout fully responsive for mobile and tablet"
"Final cleanup, code comments, and README update"
```

---

## 15. README.md Template

```markdown
# PixelWeather — Minecraft Weather Dashboard

A Minecraft-themed weather dashboard built with vanilla HTML, CSS, JavaScript, and the NES.css pixel-art framework.

## About

PixelWeather brings the blocky, pixelated aesthetic of Minecraft to a fully functional weather app. Search any city, view current conditions and a 5-day forecast, save favorites, and toggle between day and night themes.

## API Used

**OpenWeatherMap** (Free Tier)
- Current Weather: `/weather`
- 5-Day Forecast: `/forecast`
- Docs: https://openweathermap.org/api

## Libraries Used

| Library | Purpose |
|---------|---------|
| [NES.css](https://nostalgic-css.github.io/NES.css/) | 8-bit pixel-art UI components (buttons, containers, icons, dialogs) |
| [Animate.css](https://animate.style/) | CSS animations for smooth transitions and effects |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | Pixel font for authentic retro/Minecraft text |

## Features

- Real-time weather data from OpenWeatherMap API
- City search with debounced input
- 5-day weather forecast
- Filter saved cities by weather condition (using `.filter()`)
- Sort saved cities by temperature, name, or humidity (using `.sort()`)
- Favorite cities persisted in localStorage
- Day/Night theme toggle (persisted in localStorage)
- Minecraft-themed weather advice ("Bring a boat!", "Snow golems incoming!")
- Weather-dependent particle animations (rain, snow)
- Loading screen ("Building terrain...")
- Error dialog ("You died!")
- Fully responsive (mobile, tablet, desktop)

## Technologies

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- NES.css (CDN), Animate.css (CDN), Google Fonts (CDN)
- OpenWeatherMap API
- GitHub Pages (deployment)

## Setup & Run

1. Clone: `git clone https://github.com/YOUR_USERNAME/pixelweather.git`
2. Get a free API key from https://openweathermap.org/api
3. Open `js/api.js` and replace `YOUR_API_KEY_HERE` with your key
4. Open `index.html` in a browser (or use VS Code Live Server)

## Live Demo

[GitHub Pages link here]
```

---

## 16. Quality Checklist

- [ ] NES.css components used for: buttons, containers, inputs, selects, dialogs, icons, progress bars.
- [ ] Animate.css used for: card entrances, error shake, loading pulse.
- [ ] All data operations use HOFs — zero `for`/`while` loops.
- [ ] `fetch()` used for all API calls with `try/catch`.
- [ ] Loading overlay shows NES.css progress bar + "Building terrain..." text.
- [ ] Error dialog uses `nes-dialog` with "You died!" and "Respawn" button.
- [ ] Search works and renders current weather + forecast.
- [ ] Filter dropdown filters favorites by condition using `.filter()`.
- [ ] Sort dropdown sorts favorites using `.sort()`.
- [ ] Favorite star toggles with NES.css `nes-icon star` / `nes-icon is-empty star`.
- [ ] Theme toggle swaps CSS variables + NES.css `is-dark` on containers.
- [ ] Rain/snow particle animations work for relevant weather conditions.
- [ ] Responsive at 768px and 1024px breakpoints.
- [ ] No copyrighted assets — all visuals from NES.css + custom CSS.
- [ ] Code is clean, commented, modular.
- [ ] README complete.
- [ ] Deployed on GitHub Pages.
- [ ] 15+ meaningful commits.
