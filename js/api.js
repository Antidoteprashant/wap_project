/* js/api.js — OpenWeatherMap API fetch functions */

// ============================================================
// HOW TO GET YOUR FREE API KEY:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Go to "API Keys" in your profile
// 4. Paste your key below (new keys take ~2 hours to activate)
// ============================================================
const API_KEY = "2534d8272e3498774ba4818cadc07006";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * fetchCurrentWeather — Fetches current weather for a city.
 * @throws {Error} if city not found
 */
async function fetchCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`City "${city}" not found in the overworld!`);
  }
  return response.json();
}

/**
 * fetchForecast — Fetches 5-day / 3-hour forecast for a city.
 * @throws {Error} if city not found
 */
async function fetchForecast(city) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast unavailable for "${city}"!`);
  }
  return response.json();
}
