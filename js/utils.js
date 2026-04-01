/* ============================================================
   UTILS.JS
   App config, date/time helpers, weather category mappers,
   Minecraft advice generator, icon URL builder.
   PRD §4 API, §5.2 Advice, §6.4 Backgrounds
============================================================ */

/* ============================================================
   CONFIG — replace API_KEY with your OpenWeatherMap key
   Sign up free at: https://openweathermap.org/api
============================================================ */
const CONFIG = {
  API_KEY:      '05c556bc53c38a52ae9e6919574fa261',   // ← Paste your key here
  BASE_URL:     'https://api.openweathermap.org/data/2.5',
  UNITS:        'metric',
  DEFAULT_CITY: 'London',
};

/* ============================================================
   DATE / TIME HELPERS
============================================================ */

/**
 * Format a UNIX timestamp as "Mon, 1 Jan"
 * @param {number} ts - UNIX timestamp (seconds)
 * @returns {string}
 */
const formatDate = (ts) =>
  new Date(ts * 1000).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

/**
 * Return abbreviated day name from UNIX timestamp ("Mon", "Tue" …)
 * @param {number} ts
 * @returns {string}
 */
const getDayName = (ts) =>
  new Date(ts * 1000).toLocaleDateString('en-GB', { weekday: 'short' });

/* ============================================================
   WEATHER CATEGORY MAPPER
   Maps OWM weather ID → simple internal category
   Used to drive backgrounds, effects, and advice.
============================================================ */

/**
 * @param {number} id - OWM weather condition id
 * @returns {'storm'|'rain'|'snow'|'fog'|'clear'|'cloudy'}
 */
const getWeatherCategory = (id) => {
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800)             return 'clear';
  return 'cloudy';
};

/**
 * Map category → body class that controls --bg-primary
 * @param {string} category
 * @returns {string} CSS class name
 */
const getBgClass = (category) =>
  ({
    clear:  'wx-clear',
    cloudy: 'wx-cloudy',
    rain:   'wx-rain',
    snow:   'wx-snow',
    storm:  'wx-storm',
    fog:    'wx-fog',
  })[category] ?? 'wx-clear';

/**
 * Map category → weather-bg-effect overlay class
 * @param {string} category
 * @returns {string} CSS class name (empty string = no overlay)
 */
const getBgEffectClass = (category) =>
  ({ rain: 'rain', snow: 'snow', storm: 'storm', fog: 'fog' })[category] ?? '';

/* ============================================================
   MINECRAFT ADVICE
   PRD §5.2 — "What to Wear" balloon messages
============================================================ */

/**
 * @param {number} weatherId - OWM condition id
 * @param {number} temp      - temperature in °C
 * @returns {string}
 */
const getMinecraftAdvice = (weatherId, temp) => {
  const cat = getWeatherCategory(weatherId);

  if (cat === 'storm')  return '⚡ Thunderstorm! Stay inside — lightning strikes mobs too. Charge your trident.';
  if (cat === 'rain')   return '🚣 Bring a boat! Depth Strider III enchant highly recommended today.';
  if (cat === 'snow')   return '☃ Snow golems incoming! Grab your shovel and craft some wool armor.';
  if (cat === 'fog')    return '🌫 Dense fog — phantoms spawn in low visibility! Sleep NOW.';
  if (temp >= 35)       return '🔥 Blaze-level heat! Fire resistance potions required. Watch for lava.';
  if (temp >= 25)       return '☀ Clear skies — perfect day to go surface mining. No hostile mobs in sight!';
  if (temp <= 0)        return '❄ Permafrost conditions! Wear enchanted diamond armor. Stay near a furnace.';
  if (temp <= 10)       return '🧥 Cold biome detected. Pack cooked steak and keep your XP bar high.';
  return '⛏ Optimal conditions. Grab your pickaxe — diamond ore is waiting at Y: -58.';
};

/* ============================================================
   ICON URL HELPER
============================================================ */

/**
 * Returns the OWM icon URL (@2x for sharp pixel rendering)
 * @param {string} iconCode - e.g. "10d"
 * @returns {string}
 */
const getIconUrl = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
