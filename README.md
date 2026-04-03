# PixelWeather — Minecraft Weather Dashboard

> "Check the forecast, Minecraft style."

A fully responsive weather dashboard built with **vanilla HTML, CSS, and JavaScript** — styled in 8-bit Minecraft pixel art using NES.css.

---

## Live Demo

[Deploy to GitHub Pages — see Step 5 below for instructions]

---

## About

PixelWeather brings the blocky, pixelated aesthetic of Minecraft to a fully functional weather app. Search any city, view current conditions and a 5-day forecast, save favourites, filter and sort your saved cities, and toggle between Day and Night themes.

---

## API

**OpenWeatherMap** (Free Tier) — [https://openweathermap.org/api](https://openweathermap.org/api)

| Endpoint | Purpose |
|----------|---------|
| `/weather?q={city}&appid={key}&units=metric` | Current weather |
| `/forecast?q={city}&appid={key}&units=metric` | 5-day / 3-hour forecast |

---

## Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| [NES.css](https://nostalgic-css.github.io/NES.css/) | 2.3.0 | 8-bit pixel-art UI (buttons, containers, icons, dialogs, progress bars) |
| [Animate.css](https://animate.style/) | 4.1.1 | CSS animations — card entrances, shake, bounce, fade |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | — | Pixel / retro font (required by NES.css) |

All libraries are loaded via CDN — **zero build step, zero npm**.

---

## Features

| Feature | Implementation |
|---------|---------------|
| **City search** | Debounced text input + Enter / button trigger |
| **Current weather** | Temperature, feels-like (heart icons), humidity, wind, cloud % |
| **5-day forecast** | Row of NES.css container cards with staggered `fadeInUp` entrances |
| **Minecraft advice** | `nes-balloon` tip for each weather condition (e.g. *"Bring a boat!"*) |
| **Favorites (Ender Chest)** | Save / remove cities with `localStorage` persistence |
| **Filter by condition** | Sunny, Cloudy, Rainy, Snowy, Stormy — using `.filter()` HOF |
| **Sort** | By name, temperature, or humidity — using `.sort()` HOF |
| **Pagination** | 5 cities per page with Prev / Next NES.css buttons |
| **Day / Night theme** | Swaps CSS variables + NES.css `is-dark` containers; persisted in `localStorage` |
| **Rain & snow particles** | CSS-animated pixel drops / flakes generated via JS |
| **Fog overlay** | Semi-transparent overlay for Mist / Fog / Haze conditions |
| **Thunderstorm flash** | Lightning-flash overlay with custom CSS animation |
| **Loading screen** | Dirt-brown full-screen overlay with NES.css XP progress bar |
| **Error dialog** | NES.css death-screen dialog ("You died!") with Respawn button |
| **Clear All** | Wipe all saved cities from the Ender Chest |
| **Keyboard shortcut** | Press `/` anywhere to focus the search bar |
| **Last updated stamp** | Timestamp shown on the weather card action row |
| **Responsive layout** | Desktop two-column, tablet single-column, mobile full-stack |

---

## Array HOF Usage (Project Requirement)

| Operation | HOF | Location |
|-----------|-----|---------|
| Filter favorites by condition | `.filter()` | `js/filter.js` |
| Sort favorites by field | `.sort()` | `js/sort.js` |
| Search favorites by name | `.filter()` | `js/search.js` |
| Build forecast card HTML | `.map()` | `js/ui.js → renderForecast` |
| Build favorites grid HTML | `.map()` | `js/ui.js → renderFavorites` |
| Generate rain/snow particles | `Array.from().forEach()` | `js/ui.js → createWeatherParticles` |
| Check if city is saved | `.some()` | `js/favorites.js → isFavorite` |
| Find city in favorites | `.find()` | `js/favorites.js → addFavorite` |
| Remove city from favorites | `.filter()` | `js/favorites.js → removeFavorite` |

**Zero `for` / `while` loops used for data operations.**

---

## Project Structure

```
pixelweather/
├── index.html               # Full app skeleton (NES.css components)
├── css/
│   ├── style.css            # CSS variables (day/night), NES.css overrides, layout grid
│   ├── weather.css          # Weather card, forecast row, advice balloon, favorites cards
│   ├── animations.css       # Rain, snow, fog, lightning, loading overlay, bg transitions
│   └── responsive.css       # Breakpoints: 768px (tablet), 1024px (desktop)
├── js/
│   ├── app.js               # Entry point — event listeners, init sequence, theme sync
│   ├── api.js               # OpenWeatherMap fetch wrappers (fetchCurrentWeather, fetchForecast)
│   ├── ui.js                # All DOM rendering functions
│   ├── search.js            # handleSearch (Promise.all), searchFavorites
│   ├── favorites.js         # localStorage CRUD, pagination state
│   ├── filter.js            # filterByCondition + handleFilter
│   ├── sort.js              # sortCities + handleSort
│   ├── theme.js             # initTheme, applyTheme, toggleTheme
│   └── utils.js             # debounce, processForecast, WEATHER_CONFIG, formatters
├── README.md
└── .gitignore
```

---

## Setup & Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pixelweather.git
   cd pixelweather
   ```

2. **Get a free API key**
   - Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
   - Go to **API Keys** in your profile dashboard
   - Copy your key (new keys activate within ~2 hours)

3. **Add your key**
   Open `js/api.js` and replace `YOUR_API_KEY_HERE`:
   ```javascript
   const API_KEY = "paste_your_key_here";
   ```

4. **Open in browser**
   - Open `index.html` directly, or
   - Use **VS Code Live Server** (right-click → *Open with Live Server*)

---

## Technologies

- **HTML5** — semantic structure, `<dialog>` for error modal
- **CSS3** — custom properties, grid, flexbox, `@keyframes` animations
- **Vanilla JavaScript (ES6+)** — `fetch()`, `Promise.all`, `localStorage`, arrow functions, template literals
- **NES.css** — pixel-art UI framework (CDN)
- **Animate.css** — entrance/exit animations (CDN)
- **Google Fonts** — Press Start 2P (CDN)
- **OpenWeatherMap API** — free-tier weather data

---

## Deployment (GitHub Pages)

```bash
# 1. Create a GitHub repo named "pixelweather"
# 2. Push your code
git remote add origin https://github.com/YOUR_USERNAME/pixelweather.git
git branch -M main
git push -u origin main

# 3. Enable Pages in repo Settings → Pages → Source: main branch / root
# 4. Your site will be live at:
#    https://YOUR_USERNAME.github.io/pixelweather/
```

---

## Colour Palette

| Token | Day | Night | Use |
|-------|-----|-------|-----|
| `--bg-primary` | `#87CEEB` | `#1A1A2E` | Page background |
| `--bg-secondary` | `#5B8731` | `#2D1B4E` | Header / stats panel |
| `--accent` | `#5DB12F` | `#A020F0` | Primary buttons, highlights |
| `--accent-gold` | `#FCDB05` | `#FCDB05` | Star icons, temperatures |
| `--danger` | `#FF5555` | `#FF5555` | Error dialog, hearts |

---

## Acknowledgements

- [NES.css](https://nostalgic-css.github.io/NES.css/) by Yoriiis — MIT licence
- [Animate.css](https://animate.style/) by Daniel Eden — MIT licence
- [OpenWeatherMap](https://openweathermap.org/) — free-tier API
