/* js/search.js — Search input handling + favorites filtering */

/** searchFavorites — Filters saved cities by query using .filter(). */
function searchFavorites(favorites, query) {
  const q = query.toLowerCase();
  return favorites.filter(city => city.name.toLowerCase().includes(q));
}

/** initSearch — Wires up search input and button. Call once on DOMContentLoaded. */
function initSearch() {
  const input = document.getElementById("search-input");
  const btn   = document.getElementById("search-btn");

  input.addEventListener("input", debounce(e => {
    const query = e.target.value.trim();
    if (query.length >= 2) {
      renderFavorites(searchFavorites(getFavorites(), query));
    } else if (query.length === 0) {
      applyFavoritesView();
    }
  }, 300));

  input.addEventListener("keydown", e => { if (e.key === "Enter") triggerSearch(); });
  btn.addEventListener("click", triggerSearch);
}

function triggerSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (query) loadWeatherForCity(query);
}
