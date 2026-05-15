## Advanced Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the free **Open-Meteo API** with advanced features.

### ✨ Features

#### 🌡️ **Current Weather Display**
- Real-time temperature and weather conditions
- Feels-like temperature
- Humidity, wind speed, and pressure
- Visibility, cloud cover, and dew point
- Wind direction with compass bearing
- UV Index

#### 🌅 **Sun Times & Solar Data**
- Sunrise and sunset times
- Day length calculation
- UV Index forecast

#### ⏰ **Hourly Forecast**
- Next 24 hours weather prediction
- Temperature, weather condition, and precipitation chance
- Hourly interval updates

#### 📅 **7-Day Forecast**
- Daily weather predictions
- High and low temperatures
- Weather conditions and descriptions
- Precipitation amount and probability

#### 🌍 **Location Features**
- 🔍 Search by city name (e.g., "London", "New York")
- 📍 Geolocation auto-detection of current location
- ⭐ Save favorite locations for quick access
- Support for international locations

#### ⚙️ **Unit Conversion**
- **Temperature**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Wind Speed**: Choose between km/h, mph, or m/s
- Live conversion across all weather displays

#### 🎨 **Theme Support**
- Light theme (default with gradient background)
- Dark theme for comfortable night viewing
- Theme preference saved to local storage

#### 📱 **Responsive Design**
- Works perfectly on mobile, tablet, and desktop
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Weather icons and emojis
- Loading spinner for async operations
- Error handling and user feedback

### 🔑 Key Enhancements

✅ **Temperature & Wind Speed Unit Toggle**
- Real-time conversion without API calls
- Instantly updates all weather displays

✅ **Favorite Locations**
- Save up to unlimited favorite cities
- Click favorite to quickly load weather
- Remove favorites with one click
- Favorites persist across browser sessions

✅ **Geolocation**
- One-click access to current location weather
- Automatic reverse geocoding to get location name
- Graceful fallback if location denied

✅ **Theme Toggle**
- Switch between light and dark themes
- Theme preference saved to local storage
- Smooth transition between themes

✅ **Enhanced Weather Data**
- Wind direction (N, NE, E, etc.) with degree
- Dew point temperature
- UV Index from forecast data
- Sunrise and sunset times
- Day length calculation

### 📊 Data Provided

- Current temperature (with unit conversion)
- Apparent "feels like" temperature
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility distance
- Cloud cover percentage
- Dew point
- UV Index
- Sunrise and sunset times
- Day length
- Hourly forecasts for 24 hours
- Daily forecasts for 7 days

### 🔌 API Integration

**Open-Meteo API** - Free weather API with no authentication required
- Supports global location coverage
- Accurate 7-day forecasts
- High-resolution weather data
- Automatic timezone detection

**Endpoints Used:**
1. **Geocoding API** - Convert city names to coordinates
2. **Reverse Geocoding** - Convert coordinates back to location names
3. **Weather Forecast API** - Fetch current weather and forecasts

### 📁 File Structure

```
weather-dashboard/
├── index.html      # HTML with enhanced UI components
├── styles.css      # Responsive styling with themes
├── script.js       # JavaScript with all features
└── README.md       # This documentation
```

### 🚀 How to Use

1. **Search Weather**
   - Type a city name in the search box
   - Press Enter or click the Search button
   - View current weather and forecasts

2. **Use Geolocation**
   - Click the 📍 button to use your current location
   - Weather loads automatically for your position

3. **Switch Units**
   - Use temperature toggle to switch between °C and °F
   - Use wind speed toggle to choose km/h, mph, or m/s
   - All values update instantly

4. **Save Favorites**
   - Click the ⭐ button to save current location
   - Saved locations appear in "Saved Locations" section
   - Click any saved location to quickly load its weather
   - Click ✕ to remove a favorite

5. **Change Theme**
   - Click the 🌙/☀️ button to toggle dark/light theme
   - Your preference is saved automatically

### 🌐 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### 💾 Local Storage

The dashboard uses browser local storage to save:
- Theme preference (light/dark)
- Favorite locations list
- Unit preferences (if implemented)

### 🔧 Technical Details

**HTML5**
- Semantic markup with enhanced sections
- Accessible form inputs and buttons
- Responsive meta viewport

**CSS3**
- CSS custom properties for theming
- Grid and flexbox layouts
- CSS animations and transitions
- Gradient backgrounds
- Media queries for responsiveness
- Dark theme with color variables

**JavaScript (ES6+)**
- Async/await for API calls
- Fetch API for HTTP requests
- Local storage for persistence
- DOM manipulation
- Error handling
- Unit conversion functions
- Geolocation API integration
- Reverse geocoding
- Dew point calculation

### 📋 Future Enhancements

- [ ] Air quality index (AQI) integration
- [ ] Weather alerts and warnings
- [ ] Historical weather data
- [ ] Weather radar/map view
- [ ] Multiple location comparison
- [ ] Weather notifications
- [ ] Precipitation probability graph
- [ ] Wind gust information
- [ ] Pressure trend indicator
- [ ] Pollen count data
- [ ] Moonrise/Moonset times
- [ ] Moon phase display

### ⚠️ Limitations

- Search requires internet connection
- Location search is case-insensitive
- Coordinates must be valid latitude/longitude values
- Geolocation requires HTTPS on production sites
- Some features require modern browser support

### 📝 License

Free to use and modify. Data provided by Open-Meteo.

### 🙏 Credits

- Weather data: [Open-Meteo.com](https://open-meteo.com/)
- Geocoding: Open-Meteo Geocoding API
- Icons: Unicode emojis
- Design: Modern gradient UI with theme support

---

**Enjoy your advanced weather dashboard!** 🌤️

For more information about Open-Meteo API, visit [open-meteo.com](https://open-meteo.com/)