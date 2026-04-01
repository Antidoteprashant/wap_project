/* ============================================================
   UI.JS
   All DOM rendering functions.
   Keeps all document.getElementById / innerHTML changes in
   one place — app.js calls these, never touches the DOM itself.
   PRD §5.2, §6.3, §6.5 — Milestone 2 display deliverable
============================================================ */

/* ============================================================
   LOADING STATE
   NES.css: nes-progress is-primary + animated bar
   PRD §6.5, M2 Task "Handle loading states effectively"
============================================================ */

let _loadingInterval = null;

/**
 * Show the full-screen "Building terrain..." loading overlay.
 * Animates the NES progress bar in steps.
 */
const showLoading = () => {
  const overlay = document.getElementById('loading-overlay');
  const bar     = document.getElementById('loading-bar');

  bar.value = 0;
  overlay.classList.remove('hidden');

  // Animate bar from 0 → 90 in random steps (completes on hideLoading)
  _loadingInterval = setInterval(() => {
    const jump = Math.random() * 18 + 5;
    bar.value = Math.min(bar.value + jump, 90);
    if (bar.value >= 90) clearInterval(_loadingInterval);
  }, 140);
};

/**
 * Complete the bar to 100 and hide the overlay.
 */
const hideLoading = () => {
  clearInterval(_loadingInterval);
  const overlay = document.getElementById('loading-overlay');
  const bar     = document.getElementById('loading-bar');
  bar.value = 100;
  setTimeout(() => overlay.classList.add('hidden'), 250);
};

/* ============================================================
   ERROR DIALOG — "You Died!"
   NES.css: nes-dialog is-dark is-rounded
============================================================ */

/**
 * Open the error dialog with a custom message.
 * @param {string} message
 */
const showError = (message) => {
  const dialog = document.getElementById('error-dialog');
  document.getElementById('error-message').textContent = message;
  // Add Animate.css shake to the dialog for flair
  dialog.classList.add('animate__animated', 'animate__shakeX');
  dialog.addEventListener(
    'animationend',
    () => dialog.classList.remove('animate__animated', 'animate__shakeX'),
    { once: true }
  );
  if (!dialog.open) dialog.showModal();
};

/** Close the error dialog. */
const hideError = () => {
  const dialog = document.getElementById('error-dialog');
  if (dialog.open) dialog.close();
};

/* ============================================================
   WEATHER BACKGROUND
   Applies body class for CSS variable override + effect layer
============================================================ */

/**
 * Set body bg class and weather-bg-effect layer based on
 * the OWM weather condition id.
 * @param {number} weatherId
 */
const setWeatherBackground = (weatherId) => {
  const cat    = getWeatherCategory(weatherId);
  const bgCls  = getBgClass(cat);
  const fxCls  = getBgEffectClass(cat);

  // Remove all existing wx-* classes
  [...document.body.classList]
    .filter(c => c.startsWith('wx-'))
    .forEach(c => document.body.classList.remove(c));

  document.body.classList.add(bgCls);

  // Update particle/effect layer
  const fxEl = document.getElementById('weather-bg-effect');
  fxEl.className = 'weather-bg-effect';
  if (fxCls) fxEl.classList.add(fxCls);
};

/* ============================================================
   RENDER CURRENT WEATHER
   PRD §5.2 — current weather card
============================================================ */

/**
 * Populate the current weather card from OWM /weather response.
 * @param {Object} data - OWM current weather JSON
 */
const renderCurrentWeather = (data) => {
  const { name, main, weather, wind, visibility, sys, dt } = data;
  const w = weather[0]; // primary condition

  // Card title: "London, GB"
  document.getElementById('card-city-title').textContent =
    `${name}, ${sys.country}`;

  // Icon (pixelated OWM icon @2x)
  const iconEl = document.getElementById('weather-icon');
  iconEl.src = getIconUrl(w.icon);
  iconEl.alt = w.description;

  // Condition text + date
  document.getElementById('weather-condition').textContent = w.main;
  document.getElementById('weather-date').textContent = formatDate(dt);

  // Temperature
  document.getElementById('temp-main').textContent =
    `${Math.round(main.temp)}°C`;
  document.getElementById('temp-feels').textContent =
    `Feels like ${Math.round(main.feels_like)}°C`;

  // Stats
  document.getElementById('stat-humidity').textContent =
    `${main.humidity}%`;
  document.getElementById('stat-wind').textContent =
    `${Math.round(wind.speed * 3.6)} km/h`;  // m/s → km/h
  document.getElementById('stat-visibility').textContent =
    visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A';
  document.getElementById('stat-pressure').textContent =
    `${main.pressure} hPa`;

  // Minecraft advice balloon
  document.getElementById('advice-text').textContent =
    getMinecraftAdvice(w.id, main.temp);

  // Dynamic background
  setWeatherBackground(w.id);
};

/* ============================================================
   RENDER 5-DAY FORECAST
   PRD §5.2 — "row of nes-container boxes (Item frames)"
   Uses .filter() and .reduce() — Array HOFs, no for/while.
============================================================ */

/**
 * Populate the forecast row from OWM /forecast response.
 * Picks the entry closest to 12:00 UTC for each future date.
 * @param {Object} data - OWM forecast JSON
 */
const renderForecast = (data) => {
  const forecastRow = document.getElementById('forecast-row');
  const today = new Date().toISOString().split('T')[0];

  // Group forecast list by calendar date using .reduce()
  // Result: { 'YYYY-MM-DD': [item, item, …], … }
  const grouped = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // For each future date, pick entry closest to 12:00 UTC
  const dailyItems = Object.entries(grouped)
    .filter(([date]) => date > today)      // exclude today
    .slice(0, 5)                           // max 5 days
    .map(([, items]) =>
      items.reduce((best, item) => {
        const itemHour = new Date(item.dt * 1000).getUTCHours();
        const bestHour = new Date(best.dt * 1000).getUTCHours();
        return Math.abs(itemHour - 12) < Math.abs(bestHour - 12) ? item : best;
      })
    );

  // Clear and repopulate
  forecastRow.innerHTML = '';

  dailyItems.forEach((item, index) => {
    const w    = item.weather[0];
    const card = document.createElement('div');
    card.className = 'forecast-card animate__animated animate__fadeInUp';
    card.style.animationDelay = `${index * 0.07}s`;

    card.innerHTML = `
      <div class="nes-container is-dark">
        <span class="forecast-day">${getDayName(item.dt)}</span>
        <img
          class="forecast-icon pixel-icon"
          src="${getIconUrl(w.icon)}"
          alt="${w.description}"
        />
        <span class="forecast-hi">${Math.round(item.main.temp_max)}°</span>
        <span class="forecast-lo">${Math.round(item.main.temp_min)}°</span>
        <span class="forecast-desc">${w.description}</span>
      </div>
    `;

    forecastRow.appendChild(card);
  });
};

/* ============================================================
   SHOW MAIN CONTENT (reveals after first successful fetch)
============================================================ */

/** Unhide the main content section with a fade-in. */
const showMainContent = () => {
  const main = document.getElementById('main-content');
  main.classList.remove('hidden');
  // Ensure Animate.css re-triggers if already shown
  main.classList.remove('animate__fadeIn');
  void main.offsetWidth; // force reflow
  main.classList.add('animate__animated', 'animate__fadeIn');
};
