/* js/filter.js — Filter favorites by weather condition */

/** filterByCondition — Uses .filter() HOF. No loops. */
function filterByCondition(cities, condition) {
  if (condition === "all") return cities;
  return cities.filter(city =>
    city.weather[0].main.toLowerCase() === condition.toLowerCase()
  );
}
