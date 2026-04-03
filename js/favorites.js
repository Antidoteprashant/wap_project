/* js/favorites.js — Favorites CRUD via localStorage */

const FAVORITES_KEY = "pixelweather_favorites";
const LAST_CITY_KEY  = "pixelweather_lastCity";

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/** addFavorite — Adds city if not already saved. */
function addFavorite(cityData) {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === cityData.id)) {
    favorites.push(cityData);
    saveFavorites(favorites);
  }
}

/** removeFavorite — Removes city by id using .filter(). */
function removeFavorite(cityId) {
  saveFavorites(getFavorites().filter(fav => fav.id !== cityId));
}

/** isFavorite — Returns true if city is saved using .some(). */
function isFavorite(cityId) {
  return getFavorites().some(fav => fav.id === cityId);
}

function saveLastCity(city) { localStorage.setItem(LAST_CITY_KEY, city); }
function getLastCity()      { return localStorage.getItem(LAST_CITY_KEY) || ""; }
