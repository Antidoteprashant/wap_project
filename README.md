# PixelWeather

**PixelWeather** is a Minecraft-themed weather dashboard built with Vanilla JavaScript, HTML, and CSS. It allows you to search for any city to get current weather conditions and a 5-day forecast, all wrapped in a nostalgic 8-bit pixel art style using [NES.css](https://nostalgic-css.github.io/NES.css/).

## Features

- **Minecraft/8-Bit Aesthetics:** Uses NES.css to emulate a retro 8-bit visual experience.
- **Current Weather & Forecast:** Fetches the current weather and a 5-day forecast for any city (requires a weather API).
- **Ender Chest (Favorites):** Save your favorite cities locally to easily check them later.
- **Sort & Filter:** Sort your saved cities by name, temperature, or humidity, and filter them by weather conditions.
- **Theme Toggle:** Switch between "Day Mode" and "Night Mode".
- **Dynamic Advice:** Receive fun, Minecraft-themed advice based on the current weather.
- **Weather Animations:** Enjoy dynamic particle animations for rain, snow, etc.
- **Responsive Design:** A layout optimized for both desktop and mobile views.

## Technology Stack

- **HTML5:** Semantic architecture.
- **CSS3:** Custom styling coupled with [NES.css](https://unpkg.com/nes.css/) and [Animate.css](https://animate.style/) for retro, responsive UI.
- **Vanilla JavaScript:** ES6 modules separated by concern (`api.js`, `ui.js`, `favorites.js`, `search.js`, etc.).

## Project Structure

```text
├── index.html           # Main HTML structure
├── package.json         # Project metadata
├── css/                 # Stylesheets directory
│   ├── style.css        # Core styling
│   ├── animations.css   # Keyframe animations and particle effects
│   ├── responsive.css   # Mobile and tablet responsiveness
│   └── weather.css      # Weather-specific styles and icons
└── js/                  # JavaScript logic modules
    ├── api.js           # API communication
    ├── app.js           # Main application entry point
    ├── favorites.js     # Ender chest/local storage logic
    ├── filter.js        # Filtering favorites logic
    ├── search.js        # Search bar functionality
    ├── sort.js          # Sorting favorites logic
    ├── theme.js         # Theme toggling logic
    ├── ui.js            # General UI updates and DOM manipulation
    └── utils.js         # Shared utility functions
```

## Getting Started

Since this is a vanilla HTML/JS/CSS project without build tools, getting started is extremely straightforward.

### Local Development

1. **Clone or Download** this repository.
2. **Open `index.html`**:
   You can run this project locally by opening `index.html` in your web browser. For the best experience (to avoid restrictive CORS issues), use a local server like the **Live Server** extension in VS Code.

### Deployment (Netlify)

This project can be deployed directly to Netlify without any build steps.

1. Create a new site on Netlify.
2. Drag and drop this project folder into Netlify's manual deploy zone, OR link your GitHub repository.
3. Your site will be instantly live!

## License

This project is built for educational and portfolio purposes.
