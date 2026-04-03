/* js/app.js — Entry point: wires all modules on DOMContentLoaded */

/** loadWeatherForCity — Fetches + renders weather and forecast in parallel. */
async function loadWeatherForCity(city) {
  showLoading();
  try {
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
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
}

/** applyFavoritesView — Applies current filter + sort and re-renders. */
function applyFavoritesView() {
  const condition = document.getElementById("filter-select").value;
  const { criteria, order } = parseSortSelect(document.getElementById("sort-select").value);
  renderFavorites(sortCities(filterByCondition(getFavorites(), condition), criteria, order));
}

/** applyFavoritesViewPage — Same as above but for a specific page. */
function applyFavoritesViewPage(page) {
  const condition = document.getElementById("filter-select").value;
  const { criteria, order } = parseSortSelect(document.getElementById("sort-select").value);
  renderFavorites(sortCities(filterByCondition(getFavorites(), condition), criteria, order), page);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSearch();

  // Load last searched city
  const lastCity = getLastCity();
  if (lastCity) {
    document.getElementById("search-input").value = lastCity;
    loadWeatherForCity(lastCity);
  }

  // Render favorites sidebar
  applyFavoritesView();

  // Event listeners
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("filter-select").addEventListener("change", applyFavoritesView);
  document.getElementById("sort-select").addEventListener("change", applyFavoritesView);
  document.getElementById("respawn-btn").addEventListener("click", hideError);

  const clearAllBtn = document.getElementById("clear-all-btn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      localStorage.removeItem("pixelweather_favorites");
      renderFavorites([]);
    });
  }

  const prevBtn = document.getElementById("fav-prev-btn");
  const nextBtn = document.getElementById("fav-next-btn");
  if (prevBtn) prevBtn.addEventListener("click", () => applyFavoritesViewPage((window._favPage || 1) - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => applyFavoritesViewPage((window._favPage || 1) + 1));
});
