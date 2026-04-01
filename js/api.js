/* ============================================================
   API.JS
   OpenWeatherMap fetch wrappers.
   All network calls live here — app.js never calls fetch()
   directly.
   PRD §4 API, Milestone 2 — "Implement API calls using fetch"
============================================================ */

/**
 * Fetch current weather for a city.
 *
 * Endpoint: GET /weather?q={city}&appid={key}&units=metric
 *
 * @param {string} city - City name entered by user
 * @returns {Promise<Object>} Resolved OWM current-weather JSON
 * @throws {Error} Human-readable error message for UI display
 */
const fetchCurrentWeather = async (city) => {
  const url =
    `${CONFIG.BASE_URL}/weather` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${CONFIG.API_KEY}` +
    `&units=${CONFIG.UNITS}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404)
      throw new Error(`City "${city}" not found. Check the spelling and try again!`);
    if (response.status === 401)
      throw new Error('Invalid API key. Update CONFIG.API_KEY in js/utils.js');
    if (response.status === 429)
      throw new Error('Too many requests. Wait a moment and try again.');
    throw new Error(`Weather service error (${response.status}). Please try again.`);
  }

  return response.json();
};

/**
 * Fetch 5-day / 3-hour forecast for a city.
 *
 * Endpoint: GET /forecast?q={city}&appid={key}&units=metric
 * Returns 40 data points (5 days × 8 per day at 3-hour intervals).
 *
 * @param {string} city
 * @returns {Promise<Object>} Resolved OWM forecast JSON
 * @throws {Error}
 */
const fetchForecast = async (city) => {
  const url =
    `${CONFIG.BASE_URL}/forecast` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${CONFIG.API_KEY}` +
    `&units=${CONFIG.UNITS}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404)
      throw new Error(`Forecast for "${city}" not found.`);
    if (response.status === 401)
      throw new Error('Invalid API key. Update CONFIG.API_KEY in js/utils.js');
    throw new Error(`Forecast error (${response.status}). Please try again.`);
  }

  return response.json();
};

/**
 * Fetch current weather AND forecast in a single call using
 * Promise.all() — both requests fire simultaneously.
 *
 * @param {string} city
 * @returns {Promise<{ current: Object, forecast: Object }>}
 */
const fetchWeatherData = async (city) => {
  const [current, forecast] = await Promise.all([
    fetchCurrentWeather(city),
    fetchForecast(city),
  ]);
  return { current, forecast };
};
