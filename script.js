const searchInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchError = document.getElementById('search-error');
const weatherDisplay = document.getElementById('weather-display');
const initialState = document.getElementById('initial-state');
const loadingSpinner = document.getElementById('loading-spinner');
const themeToggleBtn = document.getElementById('theme-toggle');

// DOM Elements for Weather Data
const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition-text');
const locationEl = document.getElementById('location-text');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const pressureEl = document.getElementById('pressure');
const weatherIconEl = document.getElementById('weather-icon');

// API Configuration
const API_KEY = '2f69e3b782d44fa6887195857250312';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Map Variable
let map = null;
let mapTileLayer = null;

// Theme State (Default to Light Mode now)
let isDarkMode = localStorage.getItem('theme') === 'dark';

// Initialize Theme
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggleBtn.innerHTML = '<i class="ph ph-sun"></i>';
} else {
    // Default Light Mode
    themeToggleBtn.innerHTML = '<i class="ph ph-moon"></i>';
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');

    // Update Icon
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';

    // Save Preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update Map Tiles if map exists
    if (map && mapTileLayer) {
        updateMapTiles();
    }
}

async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) return;

    // Reset UI
    searchError.classList.add('hidden');
    initialState.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        const weatherData = await getWeatherData(city);
        updateUI(weatherData);

        loadingSpinner.classList.add('hidden');
        weatherDisplay.classList.remove('hidden');

        // Trigger reflow for animations
        void weatherDisplay.offsetWidth;

    } catch (error) {
        console.error(error);
        loadingSpinner.classList.add('hidden');
        searchError.classList.remove('hidden');
        if (weatherDisplay.classList.contains('hidden')) {
            initialState.classList.remove('hidden');
        }
    }
}

async function getWeatherData(city) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('City not found or API error');
    }

    return await response.json();
}

function updateUI(data) {
    const current = data.current;
    const location = data.location;
    const isDay = current.is_day === 1;

    // Update Text
    locationEl.textContent = `${location.name}, ${location.country}`;
    tempEl.textContent = Math.round(current.temp_c);
    humidityEl.textContent = `${current.humidity}%`;
    windSpeedEl.textContent = `${current.wind_kph} km/h`;
    feelsLikeEl.textContent = `${Math.round(current.feelslike_c)}°C`;
    pressureEl.textContent = `${current.pressure_mb} hPa`;

    // Update Weather Condition
    conditionEl.textContent = current.condition.text;

    // Update Icon
    const iconClass = getWeatherIcon(current.condition.code, isDay);
    weatherIconEl.className = `ph ${iconClass}`;

    // Update Map
    updateMap(location.lat, location.lon);
}

function updateMap(lat, lon) {
    if (!map) {
        // Initialize map
        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView([lat, lon], 10);

        updateMapTiles();
    } else {
        map.setView([lat, lon], 10);
    }

    // Clear existing markers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add marker
    L.marker([lat, lon]).addTo(map);
}

function updateMapTiles() {
    if (mapTileLayer) {
        map.removeLayer(mapTileLayer);
    }

    // Note: isDarkMode is true when dark mode is active
    const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    mapTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
}

function getWeatherIcon(code, isDay) {
    // WeatherAPI.com Condition Codes
    let icon = 'ph-question';

    // Clear / Sunny
    if (code === 1000) {
        return isDay ? 'ph-sun' : 'ph-moon';
    }

    // Cloudy variations
    if ([1003, 1006, 1009].includes(code)) {
        return isDay ? 'ph-cloud-sun' : 'ph-cloud-moon';
    }

    // Mist / Fog
    if ([1030, 1135, 1147].includes(code)) {
        return 'ph-cloud-fog';
    }

    // Rain / Drizzle
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        return 'ph-cloud-rain';
    }

    // Snow / Ice
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
        return 'ph-snowflake';
    }

    // Thunder
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
        return 'ph-lightning';
    }

    // Sleet / Freezing Rain
    if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(code)) {
        return 'ph-cloud-snow';
    }

    return icon;
}
