// Function to fetch weather data from the API
async function fetchWeather(city) {
    const apiKey = '7f37b13c384a4e39ef078c3d08549c93'; // Your correct API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API issue');
        }
        const data = await response.json();
        // Call the display function with the fetched data
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('location').textContent = "Error";
        document.getElementById('temperature').textContent = "--°C";
        document.getElementById('description').textContent = "Could not get data";
    }
}

// Function to display the fetched weather data and icon
function displayWeather(data) {
    const location = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    // Update the HTML elements
    document.getElementById('location').textContent = location;
    document.getElementById('temperature').textContent = `${Math.round(temperature)}°C`;
    document.getElementById('description').textContent = description;

    // Set the weather icon using the OpenWeatherMap icon URL
    const weatherIconElement = document.querySelector('.weather-icon-placeholder');
    if (weatherIconElement) {
        weatherIconElement.style.backgroundImage = `url('https://openweathermap.org/img/wn/${iconCode}@2x.png')`;
    }
}

// Call the main function to fetch weather data for Prayagraj when the page loads
fetchWeather('America');