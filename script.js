// API Endpoints
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const hourlyForecastSection = document.getElementById('hourlyForecast');
const dailyForecastSection = document.getElementById('dailyForecast');

// Weather code to icon/description mapping (WMO Weather codes)
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

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Main search handler
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
        // Get coordinates from location name
        const coordinates = await getCoordinates(location);
        
        if (!coordinates) {
            showError('Location not found. Please try another search.');
            hideLoader();
            return;
        }

        // Fetch weather data
        const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
        
        // Display data
        displayCurrentWeather(weatherData, coordinates);
        displayHourlyForecast(weatherData);
        displayDailyForecast(weatherData);

        hideLoader();
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch weather data. Please try again.');
        hideLoader();
    }
}

// Fetch coordinates from location name
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

// Fetch weather data
async function getWeatherData(latitude, longitude) {
    try {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,cloud_cover',
            hourly: 'temperature_2m,weather_code,precipitation_probability',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
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

// Display current weather
function displayCurrentWeather(data, coordinates) {
    const current = data.current;
    const weatherCode = current.weather_code;
    const weather = weatherCodes[weatherCode] || { icon: '🌡️', desc: 'Unknown' };

    document.getElementById('locationName').textContent = 
        `${coordinates.name}${coordinates.region ? ', ' + coordinates.region : ''}, ${coordinates.country}`;
    
    document.getElementById('currentDate').textContent = 
        new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('weatherIcon').textContent = weather.icon;
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('weatherDescription').textContent = weather.desc;
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_msl} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudCover').textContent = `${current.cloud_cover}%`;

    currentWeatherSection.classList.remove('hidden');
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyHours = data.hourly.time;
    const hourlyTemps = data.hourly.temperature_2m;
    const hourlyWeatherCodes = data.hourly.weather_code;
    const hourlyPrecipitation = data.hourly.precipitation_probability;

    const container = document.getElementById('hourlyContainer');
    container.innerHTML = '';

    // Show next 24 hours
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
            <div class="hourly-temp">${Math.round(hourlyTemps[i])}°C</div>
            <div class="hourly-condition">${weather.desc}</div>
            <div class="hourly-rain">💧 ${hourlyPrecipitation[i]}%</div>
        `;
        container.appendChild(card);
    }

    hourlyForecastSection.classList.remove('hidden');
}

// Display 7-day forecast
function displayDailyForecast(data) {
    const dailyDates = data.daily.time;
    const dailyMaxTemps = data.daily.temperature_2m_max;
    const dailyMinTemps = data.daily.temperature_2m_min;
    const dailyWeatherCodes = data.daily.weather_code;
    const dailyPrecipitation = data.daily.precipitation_sum;
    const dailyPrecipitationProb = data.daily.precipitation_probability_max;

    const container = document.getElementById('dailyContainer');
    container.innerHTML = '';

    // Show 7 days
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
                <span class="daily-high">${Math.round(dailyMaxTemps[i])}°C</span>
                <span class="daily-low">${Math.round(dailyMinTemps[i])}°C</span>
            </div>
            <div class="daily-rain">💧 ${dailyPrecipitation[i].toFixed(1)}mm (${dailyPrecipitationProb[i]}%)</div>
        `;
        container.appendChild(card);
    }

    dailyForecastSection.classList.remove('hidden');
}

// Utility functions
function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
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