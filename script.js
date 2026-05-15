// API Endpoints
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_API = 'https://geocoding-api.open-meteo.com/v1/reverse';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// State
let currentLocation = null;
let currentWeatherData = null;
let tempUnit = 'C';
let windUnit = 'kmh';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const hourlyForecastSection = document.getElementById('hourlyForecast');
const dailyForecastSection = document.getElementById('dailyForecast');
const themeToggle = document.getElementById('themeToggle');
const geolocationBtn = document.getElementById('geolocationBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const unitControls = document.getElementById('unitControls');
const favoritesSection = document.getElementById('favoritesSection');

// Weather code to icon/description mapping
const weatherCodes = {
    0: { icon: '☀️', desc: 'Clear sky' },
    1: { icon: '🌤️', desc: 'Mainly clear' },
    2: { icon: '⛅', desc: 'Partly cloudy' },
    3: { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Fog' },
    48: { icon: '🌫️', desc: 'Depositing rime fog' },
    51: { icon: '🌦️', desc: 'Light drizzle' },
    53: { icon: '🌦️', desc: 'Moderate drizzle' },
    55: { icon: '🌧️', desc: 'Dense drizzle' },
    61: { icon: '🌧️', desc: 'Slight rain' },
    63: { icon: '🌧️', desc: 'Moderate rain' },
    65: { icon: '⛈️', desc: 'Heavy rain' },
    71: { icon: '🌨️', desc: 'Slight snow' },
    73: { icon: '🌨️', desc: 'Moderate snow' },
    75: { icon: '🌨️', desc: 'Heavy snow' },
    77: { icon: '🌨️', desc: 'Snow grains' },
    80: { icon: '🌧️', desc: 'Slight rain showers' },
    81: { icon: '🌧️', desc: 'Moderate rain showers' },
    82: { icon: '⛈️', desc: 'Violent rain showers' },
    85: { icon: '🌨️', desc: 'Slight snow showers' },
    86: { icon: '🌨️', desc: 'Heavy snow showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm with slight hail' },
    99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeControls();
    updateFavoritesList();
});

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Geolocation
geolocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const location = await reverseGeocode(latitude, longitude);
                if (location) {
                    locationInput.value = location.name;
                    currentLocation = { latitude, longitude, ...location };
                    handleSearch();
                } else {
                    showError('Could not determine location name');
                    hideLoader();
                }
            },
            (error) => {
                showError('Geolocation access denied. Please search manually.');
                hideLoader();
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
});

// Reverse Geocoding
async function reverseGeocode(latitude, longitude) {
    try {
        const response = await fetch(`${REVERSE_GEO_API}?latitude=${latitude}&longitude=${longitude}&language=en`);
        const data = await response.json();
        if (data.results && data.results[0]) {
            const result = data.results[0];
            return {
                name: result.name,
                country: result.country,
                region: result.admin1,
                latitude: result.latitude,
                longitude: result.longitude
            };
        }
        return null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}

// Unit Controls
function initializeControls() {
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = e.target.parentElement;
            group.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            if (e.target.dataset.temp) {
                tempUnit = e.target.dataset.temp;
            } else if (e.target.dataset.wind) {
                windUnit = e.target.dataset.wind;
            }
            
            if (currentWeatherData) {
                updateWeatherDisplay();
            }
        });
    });
}

// Favorites
favoriteBtn.addEventListener('click', () => {
    if (currentLocation) {
        const locName = `${currentLocation.name}${currentLocation.region ? ', ' + currentLocation.region : ''}`;
        if (!favorites.find(f => f.name === locName)) {
            favorites.push({
                name: locName,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesList();
            showError(`Added ${locName} to favorites!`, false);
        }
    }
});

function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    
    if (favorites.length > 0) {
        favoritesSection.classList.remove('hidden');
        favorites.forEach((fav, index) => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <span class="favorite-name">${fav.name}</span>
                <button class="favorite-remove">✕</button>
            `;
            item.querySelector('.favorite-name').addEventListener('click', () => {
                loadFavorite(fav);
            });
            item.querySelector('.favorite-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                updateFavoritesList();
            });
            favoritesList.appendChild(item);
        });
    } else {
        favoritesSection.classList.add('hidden');
    }
}

function loadFavorite(fav) {
    currentLocation = fav;
    locationInput.value = fav.name;
    handleSearch();
}

// Search Handler
searchBtn.addEventListener('click', handleSearch);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }

    clearError();
    showLoader();
    hideAllSections();

    try {
        if (!currentLocation) {
            const coordinates = await getCoordinates(location);
            if (!coordinates) {
                showError('Location not found. Please try another search.');
                hideLoader();
                return;
            }
            currentLocation = coordinates;
        }

        const weatherData = await getWeatherData(currentLocation.latitude, currentLocation.longitude);
        currentWeatherData = weatherData;
        
        unitControls.classList.remove('hidden');
        favoriteBtn.classList.remove('hidden');
        displayCurrentWeather(weatherData);
        displayHourlyForecast(weatherData);
        displayDailyForecast(weatherData);

        hideLoader();
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch weather data. Please try again.');
        hideLoader();
    }
}

// Get Coordinates
async function getCoordinates(locationName) {
    try {
        const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude,
                name: result.name,
                country: result.country,
                region: result.admin1
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Get Weather Data
async function getWeatherData(latitude, longitude) {
    try {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,cloud_cover,dew_point_2m,uv_index',
            hourly: 'temperature_2m,weather_code,precipitation_probability',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max',
            timezone: 'auto'
        });

        const response = await fetch(`${WEATHER_API}?${params}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather API error:', error);
        throw error;
    }
}

// Unit Conversions
function convertTemp(celsius) {
    return tempUnit === 'F' ? (celsius * 9/5) + 32 : celsius;
}

function convertWind(kmh) {
    if (windUnit === 'mph') return (kmh * 0.621371).toFixed(1);
    if (windUnit === 'ms') return (kmh / 3.6).toFixed(1);
    return Math.round(kmh);
}

function getWindUnit() {
    return windUnit === 'kmh' ? 'km/h' : windUnit === 'mph' ? 'mph' : 'm/s';
}

function getTempUnit() {
    return tempUnit === 'C' ? '°C' : '°F';
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
}

// Display Current Weather
function displayCurrentWeather(data) {
    const current = data.current;
    const daily = data.daily;
    const weatherCode = current.weather_code;
    const weather = weatherCodes[weatherCode] || { icon: '🌡️', desc: 'Unknown' };

    document.getElementById('locationName').textContent = 
        `${currentLocation.name}${currentLocation.region ? ', ' + currentLocation.region : ''}, ${currentLocation.country}`;
    
    document.getElementById('currentDate').textContent = 
        new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('weatherIcon').textContent = weather.icon;
    document.getElementById('temperature').textContent = `${Math.round(convertTemp(current.temperature_2m))}${getTempUnit()}`;
    document.getElementById('weatherDescription').textContent = weather.desc;
    document.getElementById('feelsLike').textContent = `${Math.round(convertTemp(current.apparent_temperature))}${getTempUnit()}`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    
    const windDir = getWindDirection(current.wind_direction_10m);
    document.getElementById('windSpeed').textContent = `${convertWind(current.wind_speed_10m)} ${getWindUnit()}`;
    document.getElementById('windDirection').textContent = `${windDir} (${Math.round(current.wind_direction_10m)}°)`;
    
    const dewPoint = calculateDewPoint(current.temperature_2m, current.relative_humidity_2m);
    document.getElementById('dewPoint').textContent = `${Math.round(convertTemp(dewPoint))}${getTempUnit()}`;
    
    document.getElementById('pressure').textContent = `${current.pressure_msl} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudCover').textContent = `${current.cloud_cover}%`;
    document.getElementById('uvIndex').textContent = `${current.uv_index}`;

    // Sun times
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    const dayLength = (sunset - sunrise) / (1000 * 60 * 60);
    
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('dayLength').textContent = `${Math.floor(dayLength)}h ${Math.round((dayLength % 1) * 60)}m`;

    currentWeatherSection.classList.remove('hidden');
}

function updateWeatherDisplay() {
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
    }
}

// Display Hourly Forecast
function displayHourlyForecast(data) {
    const hourlyHours = data.hourly.time;
    const hourlyTemps = data.hourly.temperature_2m;
    const hourlyWeatherCodes = data.hourly.weather_code;
    const hourlyPrecipitation = data.hourly.precipitation_probability;

    const container = document.getElementById('hourlyContainer');
    container.innerHTML = '';

    for (let i = 0; i < Math.min(24, hourlyHours.length); i++) {
        const time = new Date(hourlyHours[i]);
        const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const weatherCode = hourlyWeatherCodes[i];
        const weather = weatherCodes[weatherCode] || { icon: '🌡️', desc: 'Unknown' };

        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="hourly-time">${timeString}</div>
            <div class="hourly-icon">${weather.icon}</div>
            <div class="hourly-temp">${Math.round(convertTemp(hourlyTemps[i]))}${getTempUnit()}</div>
            <div class="hourly-condition">${weather.desc}</div>
            <div class="hourly-rain">💧 ${hourlyPrecipitation[i]}%</div>
        `;
        container.appendChild(card);
    }

    hourlyForecastSection.classList.remove('hidden');
}

// Display Daily Forecast
function displayDailyForecast(data) {
    const dailyDates = data.daily.time;
    const dailyMaxTemps = data.daily.temperature_2m_max;
    const dailyMinTemps = data.daily.temperature_2m_min;
    const dailyWeatherCodes = data.daily.weather_code;
    const dailyPrecipitation = data.daily.precipitation_sum;
    const dailyPrecipitationProb = data.daily.precipitation_probability_max;

    const container = document.getElementById('dailyContainer');
    container.innerHTML = '';

    for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
        const date = new Date(dailyDates[i]);
        const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const weatherCode = dailyWeatherCodes[i];
        const weather = weatherCodes[weatherCode] || { icon: '🌡️', desc: 'Unknown' };

        const card = document.createElement('div');
        card.className = 'daily-card';
        card.innerHTML = `
            <div class="daily-date">${dateString}</div>
            <div class="daily-icon">${weather.icon}</div>
            <div class="daily-condition">${weather.desc}</div>
            <div class="daily-temps">
                <span class="daily-high">${Math.round(convertTemp(dailyMaxTemps[i]))}${getTempUnit()}</span>
                <span class="daily-low">${Math.round(convertTemp(dailyMinTemps[i]))}${getTempUnit()}</span>
            </div>
            <div class="daily-rain">💧 ${dailyPrecipitation[i].toFixed(1)}mm (${dailyPrecipitationProb[i]}%)</div>
        `;
        container.appendChild(card);
    }

    dailyForecastSection.classList.remove('hidden');
}

// Utility Functions
function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message, isError = true) {
    errorMessage.textContent = message;
    if (isError) {
        errorMessage.classList.add('show');
    } else {
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
}

function clearError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

function hideAllSections() {
    currentWeatherSection.classList.add('hidden');
    hourlyForecastSection.classList.add('hidden');
    dailyForecastSection.classList.add('hidden');
}