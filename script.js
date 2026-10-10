async function getWeather() {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        // 1. Find the city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            alert("City not found. Try another city.");
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // 2. Get current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // 3. Display location
        document.getElementById("location").innerText =
            `📍 ${location.name}, ${location.country}`;

        // 4. Display real weather data
        document.getElementById("temperature").innerText =
            `${current.temperature_2m} °C`;

        document.getElementById("humidity").innerText =
            `${current.relative_humidity_2m} %`;

        document.getElementById("wind").innerText =
            `${current.wind_speed_10m} km/h`;

        // 5. Convert weather code to condition
        document.getElementById("condition").innerText =
            getWeatherCondition(current.weather_code);

    } catch (error) {

        console.log(error);

        alert("Unable to get weather data. Check your internet connection.");

    }
}


// Weather code conversion
function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "⛅ Partly Cloudy";
    }

    if (code === 45 || code === 48) {
        return "🌫️ Fog";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️ Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "Unknown";
}