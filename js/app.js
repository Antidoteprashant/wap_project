/* ============================================================
   APP.JS
   Entry point — wires event listeners, manages theme, triggers
   initial load. All data flow starts here.
   PRD §5.1 City Search, §5.6 Dark/Night Toggle, M2 Tasks
============================================================ */

/* ============================================================
   STATE
============================================================ */
let currentCity = CONFIG.DEFAULT_CITY;

/* ============================================================
   CORE: LOAD WEATHER DATA
   Orchestrates loading state → fetch → render → hide loading.
   Any error shows the "You Died!" dialog.
   M2 Task: fetch + display + loading states
============================================================ */

/**
 * Full pipeline: show loader, fetch, render, hide loader.
 * @param {string} city - City name to fetch
 */
const loadWeather = async (city) => {
  showLoading();
  hideError();

  try {
    const { current, forecast } = await fetchWeatherData(city);

    renderCurrentWeather(current);
    renderForecast(forecast);
    showMainContent();

    currentCity = city;

    // Persist last searched city so it reloads on next visit
    localStorage.setItem('pw-last-city', city);

    // Clear the input field after a successful search
    document.getElementById('city-input').value = '';

  } catch (err) {
    showError(err.message);
  } finally {
    hideLoading();
  }
};

/* ============================================================
   SEARCH HANDLER
============================================================ */

/** Reads the input, validates, and calls loadWeather. */
const handleSearch = () => {
  const input = document.getElementById('city-input');
  const city  = input.value.trim();
  if (!city) return;
  loadWeather(city);
};

/* ============================================================
   DEBOUNCE UTILITY (bonus PRD §7)
   Prevents firing a request on every keypress.
============================================================ */

/**
 * Returns a debounced version of fn that waits `delay` ms.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Debounced search — triggers 350ms after user stops typing
const debouncedSearch = debounce(() => {
  const city = document.getElementById('city-input').value.trim();
  if (city.length >= 3) loadWeather(city);
}, 350);

/* ============================================================
   THEME — Day / Night Toggle
   PRD §5.6 — saves preference to localStorage
============================================================ */

/**
 * Apply a theme mode to the body and update the button label.
 * @param {'day'|'night'} mode
 */
const applyTheme = (mode) => {
  document.body.classList.remove('day-mode', 'night-mode');
  document.body.classList.add(`${mode}-mode`);

  const btn = document.getElementById('theme-toggle-btn');
  btn.textContent = mode === 'day' ? '☀ Day' : '🌙 Night';

  localStorage.setItem('pw-theme', mode);
};

/** Toggle between day and night. */
const toggleTheme = () => {
  const isDay = document.body.classList.contains('day-mode');
  applyTheme(isDay ? 'night' : 'day');
};

/** Read saved theme from localStorage (defaults to 'day'). */
const initTheme = () => {
  const saved = localStorage.getItem('pw-theme') || 'day';
  applyTheme(saved);
};

/* ============================================================
   INIT — runs when DOM is ready
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Event: Search button click ---- */
  document.getElementById('search-btn')
    .addEventListener('click', handleSearch);

  /* ---- Event: Enter key in search input ---- */
  document.getElementById('city-input')
    .addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });

  /* ---- Event: Debounced typing (optional auto-search) ---- */
  // Uncomment the line below to enable auto-search after 350ms of typing:
  // document.getElementById('city-input').addEventListener('input', debouncedSearch);

  /* ---- Event: Theme toggle ---- */
  document.getElementById('theme-toggle-btn')
    .addEventListener('click', toggleTheme);

  /* ---- Event: Error dialog close ("Respawn" button) ---- */
  document.getElementById('error-close-btn')
    .addEventListener('click', hideError);

  /* ---- Restore theme from localStorage ---- */
  initTheme();

  /* ---- Load last searched city or default ---- */
  const lastCity = localStorage.getItem('pw-last-city') || CONFIG.DEFAULT_CITY;
  loadWeather(lastCity);
});
