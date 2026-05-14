## Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the free **Open-Meteo API**.

### Features

✨ **Current Weather Display**
- Real-time temperature and weather conditions
- Feels-like temperature
- Humidity, wind speed, and pressure
- Visibility and cloud cover
- Last update timestamp

📊 **Hourly Forecast**
- Next 24 hours weather prediction
- Temperature, weather condition, and precipitation chance
- Hourly interval updates

📅 **7-Day Forecast**
- Daily weather predictions
- High and low temperatures
- Weather conditions and descriptions
- Precipitation amount and probability

🎯 **Location Search**
- Search by city name (e.g., "London", "New York")
- Support for international locations
- Auto-detection of country and region

🎨 **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Weather icons and emojis
- Loading spinner for async operations
- Error handling and user feedback

### API Used

**Open-Meteo API** - Free weather API with no authentication required
- Supports global location coverage
- Accurate 7-day forecasts
- High-resolution weather data
- Automatic timezone detection

### How to Use

1. **Search for a Location**
   - Type a city name in the search box
   - Press Enter or click the Search button
   - The dashboard displays current weather and forecasts

2. **View Weather Details**
   - Current weather with temperature and conditions
   - Hourly forecast for the next 24 hours
   - 7-day weather forecast
   - Detailed weather metrics

3. **Supported Queries**
   - City names: "London", "Tokyo", "New York"
   - With country: "London, UK", "Paris, France"
   - Coordinates: Can be extended to support latitude/longitude

### File Structure

```
weather-dashboard/
├── index.html      # HTML structure
├── styles.css      # Responsive CSS styles
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

### Technical Details

**HTML5**
- Semantic markup with proper sections
- Accessible form inputs
- Responsive meta viewport

**CSS3**
- Grid and flexbox layouts
- CSS animations and transitions
- Gradient backgrounds
- Media queries for responsiveness

**JavaScript (ES6+)**
- Async/await for API calls
- Fetch API for HTTP requests
- DOM manipulation
- Error handling
- Date/time formatting

### API Endpoints Used

1. **Geocoding API**
   ```
   https://geocoding-api.open-meteo.com/v1/search
   ```
   Converts location names to coordinates

2. **Weather Forecast API**
   ```
   https://api.open-meteo.com/v1/forecast
   ```
   Provides current weather and forecasts

### WMO Weather Codes

The dashboard uses WMO (World Meteorological Organization) weather codes for accurate weather interpretation:
- 0: Clear sky ☀️
- 1-2: Mainly clear/Partly cloudy 🌤️
- 3: Overcast ☁️
- 45-48: Fog 🌫️
- 51-82: Rain/Drizzle/Snow 🌧️❄️
- 95-99: Thunderstorm ⚡

### Features to Explore

- Real-time weather updates
- Temperature in Celsius (easily convertible to Fahrenheit)
- Wind speed in km/h
- Precipitation probability and amounts
- Cloud cover percentages
- Atmospheric pressure in hPa

### Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### Limitations

- Search requires internet connection
- Location search is case-insensitive
- Coordinates must be valid latitude/longitude values

### Future Enhancements

- [ ] Temperature unit toggle (Celsius/Fahrenheit)
- [ ] Wind speed units toggle (km/h, mph, m/s)
- [ ] Saved favorites locations
- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] UV index
- [ ] Sunrise/Sunset times
- [ ] Moonrise/Moonset times
- [ ] Historical weather data

### License

Free to use and modify. Data provided by Open-Meteo.

### Credits

- Weather data: [Open-Meteo.com](https://open-meteo.com/)
- Icons: Unicode emojis
- Design: Modern gradient UI

---

Enjoy your weather dashboard! 🌤️