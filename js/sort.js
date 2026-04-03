/* js/sort.js — Sort favorites by name, temp, or humidity */

/** sortCities — Uses .sort() on a spread copy. No loops. */
function sortCities(cities, criteria, order = "asc") {
  const sorted = [...cities].sort((a, b) => {
    if (criteria === "name")     return a.name.localeCompare(b.name);
    if (criteria === "temp")     return a.main.temp - b.main.temp;
    if (criteria === "humidity") return a.main.humidity - b.main.humidity;
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}

/** parseSortSelect — Parses "temp-desc" → { criteria: "temp", order: "desc" } */
function parseSortSelect(value) {
  const [criteria, order] = value.split("-");
  return { criteria, order };
}
