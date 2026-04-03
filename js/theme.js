/* js/theme.js — Day/Night theme toggle */

const THEME_KEY = "pixelweather_theme";

function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "day");
}

/** applyTheme — Sets data-theme, swaps is-dark on .theme-aware containers. */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  document.querySelectorAll(".nes-container.theme-aware").forEach(el => {
    theme === "night" ? el.classList.add("is-dark") : el.classList.remove("is-dark");
  });

  const btn = document.querySelector("#theme-toggle");
  if (btn) btn.textContent = theme === "day" ? "Night Mode" : "Day Mode";
}

function toggleTheme() {
  applyTheme(document.documentElement.getAttribute("data-theme") === "day" ? "night" : "day");
}
