/* js/ui.js — All DOM rendering functions */

/** animateElement — Applies Animate.css animation, removes classes on end. */
function animateElement(element, animationName) {
  element.classList.add("animate__animated", `animate__${animationName}`);
  element.addEventListener("animationend", () => {
    element.classList.remove("animate__animated", `animate__${animationName}`);
  }, { once: true });
}

function showLoading() { document.getElementById("loading-overlay").classList.remove("hidden"); }
function hideLoading() { document.getElementById("loading-overlay").classList.add("hidden"); }

/** showError — Opens the "You died!" dialog with a custom message. */
function showError(message) {
  const dialog = document.getElementById("error-dialog");
  document.getElementById("error-message").textContent = message;
  animateElement(dialog, "shakeX");
  dialog.showModal();
}

function hideError() {
  const dialog = document.getElementById("error-dialog");
  if (dialog.open) dialog.close();
}

/** renderCurrentWeather — Builds weather card from API data. */
function renderCurrentWeather(data) {
  const section = document.getElementById("current-weather-section");
  const cityNameEl = document.getElementById("city-name");
  const contentEl = document.getElementById("weather-content");
  const card = document.getElementById("weather-card");

  const config = getWeatherConfig(data.weather[0].main);
  const temp = formatTemp(data.main.temp);
  const feelsLike = formatTemp(data.main.feels_like);
  const windDir = getWindDirection(data.wind.deg || 0);
  const favored = isFavorite(data.id);

  // Hearts proportional to feels-like (-10°C → 40°C range = 5 hearts)
  const heartFraction = Math.max(0, Math.min(5, (data.main.feels_like + 10) / 10));
  const fullHearts = Math.floor(heartFraction);
  const halfHeart = heartFraction % 1 >= 0.5 ? 1 : 0;
  const emptyHearts = 5 - fullHearts - halfHeart;

  const heartsHTML = [
    ...Array.from({ length: fullHearts },  () => `<i class="nes-icon is-small heart"></i>`),
    ...(halfHeart                         ? [`<i class="nes-icon is-small is-half heart"></i>`] : []),
    ...Array.from({ length: emptyHearts }, () => `<i class="nes-icon is-small is-empty heart"></i>`),
  ].join("");

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;

  contentEl.innerHTML = `
    <div class="weather-main">
      <div class="weather-icon-display">${config.icon}</div>
      <div class="weather-temp-block">
        <p class="temperature-display">${temp}</p>
        <p class="weather-desc">${data.weather[0].description}</p>
        <div class="feels-like-row">
          <span class="feels-like-label">Feels: ${feelsLike}</span>
          <div class="feels-like-hearts">${heartsHTML}</div>
        </div>
      </div>
    </div>
    <div class="weather-details">
      <ul class="nes-list is-disc">
        <li>Humidity: ${data.main.humidity}%</li>
        <li>Wind: ${data.wind.speed} m/s ${windDir}</li>
        <li>Pressure: ${data.main.pressure} hPa</li>
        <li>Visibility: ${data.visibility ? (data.visibility / 1000).toFixed(1) + " km" : "N/A"}</li>
      </ul>
    </div>
    <div class="favorite-toggle-row">
      <i class="nes-icon ${favored ? "" : "is-empty"} star" id="fav-star"
         title="${favored ? "Remove from Ender Chest" : "Add to Ender Chest"}"></i>
      <span class="fav-toggle-label">${favored ? "In Ender Chest" : "Add to Ender Chest"}</span>
    </div>
  `;

  // Star toggle
  contentEl.querySelector("#fav-star").addEventListener("click", () => {
    if (isFavorite(data.id)) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
    animateElement(contentEl.querySelector("#fav-star"), "bounceIn");
    renderCurrentWeather(data);
    renderFavorites(getFavorites());
  });

  section.classList.remove("hidden");
  animateElement(card, "fadeInUp");
}

/**
 * renderForecast — Renders 5 forecast cards using .map(). No for loops.
 */
function renderForecast(days) {
  const section = document.getElementById("forecast-section");
  const row = document.getElementById("forecast-row");

  row.innerHTML = days.map((day, i) => {
    const config = getWeatherConfig(day.weather[0].main);
    return `
      <div class="nes-container with-title forecast-card animate__animated animate__fadeIn"
           style="animation-delay:${i * 0.1}s">
        <p class="title forecast-date">${formatDate(day.dt)}</p>
        <div class="forecast-icon">${config.icon}</div>
        <p class="forecast-temp">${formatTemp(day.main.temp)}</p>
        <p class="forecast-desc">${day.weather[0].description}</p>
      </div>
    `;
  }).join("");

  section.classList.remove("hidden");
}

/** renderAdvice — Fills the Minecraft advice balloon. */
function renderAdvice(condition) {
  const section = document.getElementById("advice-section");
  const balloon = document.getElementById("advice-balloon");
  document.getElementById("advice-text").textContent = getWeatherConfig(condition).advice;
  section.classList.remove("hidden");
  animateElement(balloon, "fadeIn");
}

/**
 * renderFavorites — Renders favorites grid with pagination (4 per page).
 * Uses .map() and .forEach() — no for loops.
 */
function renderFavorites(favorites, page = 1) {
  const grid = document.getElementById("favorites-grid");
  const emptyMsg = document.getElementById("empty-favorites");
  const clearAllRow = document.getElementById("clear-all-row");
  const paginationRow = document.getElementById("pagination-row");
  const pageInfo = document.getElementById("page-info");
  const badge = document.getElementById("fav-count-badge");
  const PAGE_SIZE = 4;

  if (badge) badge.textContent = favorites.length > 0 ? `(${favorites.length})` : "";

  if (!favorites || favorites.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    grid.querySelectorAll(".favorite-card").forEach(el => el.remove());
    if (clearAllRow) clearAllRow.classList.add("hidden");
    if (paginationRow) paginationRow.classList.add("hidden");
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");
  if (clearAllRow) clearAllRow.classList.remove("hidden");

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageItems = favorites.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (paginationRow) {
    if (totalPages > 1) {
      paginationRow.classList.remove("hidden");
      if (pageInfo) pageInfo.textContent = `${safePage} / ${totalPages}`;
      const prev = document.getElementById("fav-prev-btn");
      const next = document.getElementById("fav-next-btn");
      if (prev) prev.disabled = safePage === 1;
      if (next) next.disabled = safePage === totalPages;
    } else {
      paginationRow.classList.add("hidden");
    }
  }

  grid.querySelectorAll(".favorite-card").forEach(el => el.remove());

  grid.insertAdjacentHTML("afterbegin", pageItems.map(city => {
    const config = getWeatherConfig(city.weather[0].main);
    return `
      <div class="nes-container is-rounded favorite-card"
           data-city-id="${city.id}" data-city-name="${city.name}">
        <div class="fav-city-info">
          <span class="fav-city-name">${city.name}, ${city.sys.country}</span>
          <span class="fav-city-meta">${formatTemp(city.main.temp)} · ${city.weather[0].main}</span>
        </div>
        <div class="fav-icon-col">
          <span class="fav-weather-icon">${config.icon}</span>
          <i class="nes-icon is-small close fav-remove-btn" data-city-id="${city.id}" title="Remove"></i>
        </div>
      </div>
    `;
  }).join(""));

  window._favPage = safePage;

  grid.querySelectorAll(".fav-remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      removeFavorite(parseInt(btn.dataset.cityId));
      renderFavorites(getFavorites(), window._favPage);
    });
  });

  grid.querySelectorAll(".favorite-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.classList.contains("fav-remove-btn")) return;
      const name = card.dataset.cityName;
      if (name) {
        document.getElementById("search-input").value = name;
        loadWeatherForCity(name);
      }
    });
  });
}

/** updateWeatherBackground — Swaps body bg class + triggers particles. */
function updateWeatherBackground(condition) {
  const config = getWeatherConfig(condition);
  ["weather-clear","weather-cloudy","weather-rain","weather-storm","weather-snow","weather-fog"]
    .forEach(cls => document.body.classList.remove(cls));
  document.body.classList.add(config.bg);

  const container = document.getElementById("weather-animation");
  container.innerHTML = "";

  if (config.particles) createWeatherParticles(config.particles, 40);

  if (config.bg === "weather-fog") {
    const fog = document.createElement("div");
    fog.classList.add("fog-overlay");
    container.appendChild(fog);
  }

  if (condition === "Thunderstorm") {
    const flash = document.createElement("div");
    flash.classList.add("lightning-overlay");
    container.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });
  }
}

/**
 * createWeatherParticles — Generates rain/snow DOM elements.
 * Uses Array.from + .forEach() — no for loops.
 */
function createWeatherParticles(type, count = 40) {
  const container = document.getElementById("weather-animation");
  Array.from({ length: count }).forEach(() => {
    const p = document.createElement("div");
    p.classList.add(type === "rain" ? "rain-drop" : "snow-flake");
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 1.5 + 0.8}s`;
    p.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(p);
  });
}
