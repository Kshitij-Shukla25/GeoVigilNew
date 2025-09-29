// A single API key for both calls
const API_KEY = 'YOUR_API_KEY';
const CITY = 'London'; // Replace with a dynamic city if you want

// Function to fetch current weather and hourly forecast
async function fetchWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Could not fetch weather data');
        }
        const data = await response.json();
        
        // Display current conditions
        displayCurrentWeather(data.list[0], data.city);

        // Display hourly graph
        displayHourlyGraph(data.list.slice(0, 8)); // Use the next 8 hourly data points

        // Display daily forecast
        displayDailyForecast(data.list);

    } catch (error) {
        console.error("Error:", error);
        // Fallback or error state display
    }
}

// Function to display the current weather details
function displayCurrentWeather(current, city) {
    const time = new Date(current.dt * 1000);
    document.getElementById('weather-location-name').textContent = city.name;
    document.getElementById('weather-time').textContent = `Thursday, ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${current.weather[0].description}`;
    document.getElementById('current-temp-value').textContent = Math.round(current.main.temp);
    document.getElementById('precip-value').textContent = `${(current.pop * 100).toFixed(0)}%`;
    document.getElementById('humidity-value').textContent = `${current.main.humidity}%`;
    document.getElementById('wind-value').textContent = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h
    
    // Set the icon
    const iconCode = current.weather[0].icon;
    const iconElement = document.querySelector('.weather-icon-lg');
    iconElement.style.backgroundImage = `url('https://openweathermap.org/img/wn/${iconCode}@2x.png')`;
}

// Function to create and display the hourly graph
function displayHourlyGraph(hourlyData) {
    const labels = hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }));
    const temperatures = hourlyData.map(item => Math.round(item.main.temp));

    const data = {
        labels: labels,
        datasets: [{
            label: 'Temperature',
            data: temperatures,
            borderColor: 'rgb(255, 204, 0)',
            backgroundColor: 'rgba(255, 204, 0, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgb(255, 204, 0)',
            pointBorderColor: 'white'
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    grid: { display: false },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    };

    const canvas = document.getElementById('weatherHourlyChart');
    if (canvas) {
        new Chart(canvas, config);
    }
}

// Function to display the daily forecast
function displayDailyForecast(forecastData) {
    const dailyForecastContainer = document.querySelector('.daily-forecast');
    dailyForecastContainer.innerHTML = ''; // Clear previous content

    const dailyMap = {};
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyMap[date]) {
            dailyMap[date] = { temps: [], icons: [] };
        }
        dailyMap[date].temps.push(item.main.temp_max);
        dailyMap[date].temps.push(item.main.temp_min);
        dailyMap[date].icons.push(item.weather[0].icon);
    });
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let count = 0;
    for (const date in dailyMap) {
        if (count >= 7) break; // Display only 7 days
        const item = dailyMap[date];
        const maxTemp = Math.round(Math.max(...item.temps));
        const minTemp = Math.round(Math.min(...item.temps));
        const day = days[new Date(date).getDay()];
        const iconCode = item.icons[0]; // Use the icon from the first entry of the day

        const dailyItemHtml = `
            <div class="daily-item">
                <span class="daily-item-day">${day}</span>
                <div class="daily-item-icon" style="background-image: url('https://openweathermap.org/img/wn/${iconCode}@2x.png');"></div>
                <div class="daily-item-temp">
                    <span class="max">${maxTemp}°</span> <span class="min">${minTemp}°</span>
                </div>
            </div>
        `;
        dailyForecastContainer.innerHTML += dailyItemHtml;
        count++;
    }
}

// Initial call to fetch all weather data when the page loads
fetchWeatherData();