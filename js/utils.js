/* js/utils.js — Helpers: debounce, weather config, forecast processing, formatters */

/**
 * debounce — Delays invoking func until delay ms after last call.
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/** WEATHER_CONFIG — Minecraft-themed display data per weather condition. */
const WEATHER_CONFIG = {
  Clear:        { icon: "☀️",  advice: "Perfect day to go mining. No mobs in sight!",         bg: "weather-clear",  particles: null   },
  Clouds:       { icon: "☁️",  advice: "Overcast skies. Spiders may spawn early.",             bg: "weather-cloudy", particles: null   },
  Rain:         { icon: "🌧️",  advice: "Bring a boat! Depth Strider enchant recommended.",      bg: "weather-rain",   particles: "rain" },
  Drizzle:      { icon: "🌦️",  advice: "Light drizzle. Crops will love this!",                 bg: "weather-rain",   particles: "rain" },
  Thunderstorm: { icon: "⛈️",  advice: "Lightning incoming! Channeling trident time!",          bg: "weather-storm",  particles: "rain" },
  Snow:         { icon: "❄️",  advice: "Snow golems incoming! Grab a shovel.",                 bg: "weather-snow",   particles: "snow" },
  Mist:         { icon: "🌫️",  advice: "Low visibility. Render distance: 2 chunks.",           bg: "weather-fog",    particles: null   },
  Fog:          { icon: "🌫️",  advice: "Dense fog. Watch for creepers sneaking up.",           bg: "weather-fog",    particles: null   },
  Haze:         { icon: "🌫️",  advice: "Hazy skies. Like the Nether, minus the fire.",        bg: "weather-fog",    particles: null   },
  Smoke:        { icon: "🌫️",  advice: "Smoky air. Someone left a furnace running.",           bg: "weather-fog",    particles: null   },
  Dust:         { icon: "🌪️",  advice: "Desert biome detected. Sand everywhere.",              bg: "weather-fog",    particles: null   },
  Sand:         { icon: "🌪️",  advice: "Sandstorm! Craft a shelter quickly.",                  bg: "weather-fog",    particles: null   },
  Ash:          { icon: "🌋",  advice: "Volcanic ash detected. Like the Nether ceiling.",      bg: "weather-fog",    particles: null   },
  Squall:       { icon: "💨",  advice: "Strong gusts! Tie down your chickens.",                bg: "weather-storm",  particles: "rain" },
  Tornado:      { icon: "🌪️",  advice: "Tornado warning! Get underground — now!",              bg: "weather-storm",  particles: null   },
};

/** Returns weather config for a condition, falls back to Clear. */
function getWeatherConfig(condition) {
  return WEATHER_CONFIG[condition] || WEATHER_CONFIG["Clear"];
}

/**
 * processForecast — Converts 40-item 3-hour list into 5 daily entries
 * (closest to midday). Uses .forEach() — no for loops.
 */
function processForecast(forecastData) {
  const dailyMap = {};

  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
    const existingHour = dailyMap[date]
      ? parseInt(dailyMap[date].dt_txt.split(" ")[1].split(":")[0])
      : -1;

    if (!dailyMap[date] || Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
      dailyMap[date] = item;
    }
  });

  return Object.values(dailyMap).slice(0, 5);
}

/** formatTemp — e.g. 24 → "24°C" */
function formatTemp(celsius) {
  return `${Math.round(celsius)}°C`;
}

/** formatDate — UNIX timestamp → short day name e.g. "Mon" */
function formatDate(timestamp) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(timestamp * 1000).getDay()];
}

/** getWindDirection — degrees → compass string e.g. "NW" */
function getWindDirection(degrees) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}
