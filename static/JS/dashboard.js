// Get the canvas context
const ctx = document.getElementById('myDynamicChart').getContext('2d');

// Define the chart configuration
const config = {
    type: 'line',
    data: {
        labels: [], // Initial empty labels
        datasets: [{
            label: 'Sensor Reading',
            data: [], // Initial empty data
            // ... styling options
        }]
    },
    // ... chart options like scales, plugins, etc.
};

// Create the chart instance
const myChart = new Chart(ctx, config);

// Function to add new data to the chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update(); // Important: updates the chart with new data
}

// Set up a timer to update the chart every 1.5 seconds
setInterval(() => {
    const newReading = Math.floor(Math.random() * 50) + 20; // Generate a random number

    // Get a new timestamp label
    const newTime = new Date().toLocaleTimeString(); 

    addData(myChart, newTime, newReading);
}, 1500); // 1500ms = 1.5 seconds
// Variables for peak condition
let updateCount = 0;
const PEAK_INTERVAL = 10; // Trigger a peak every 10 updates
const PEAK_THRESHOLD = 90;

setInterval(() => {
    updateCount++;
    let newReading;

    // Generate a peak value every 10 updates
    if (updateCount % PEAK_INTERVAL === 0) {
        newReading = Math.floor(Math.random() * 50) + PEAK_THRESHOLD; // Guaranteed to be high
        console.log("⚠️ ALERT: Peak value detected!");
        alert("🚨 Alert! Peak value detected!"); // Or update a UI element
    } else {
        newReading = Math.floor(Math.random() * 50) + 20; // Normal random value
    }

    const newTime = new Date().toLocaleTimeString();
    addData(myChart, newTime, newReading);
}, 1500);
// Function to fetch weather data
async function fetchWeather(city) {
    const apiKey = '7f37b13c384a4e39ef078c3d08549c93'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API issue');
        }
        const data = await response.json();
        console.log(data); // Log the data to see the full response
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('location').textContent = "Error";
        document.getElementById('temperature').textContent = "--°C";
        document.getElementById('description').textContent = "Could not get data";
    }
}

// Function to display the fetched data
function displayWeather(data) {
    const location = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    document.getElementById('location').textContent = location;
    document.getElementById('temperature').textContent = `${Math.round(temperature)}°C`;
    document.getElementById('description').textContent = description;
}

// Call the function to get the weather for a specific city
// You can make this dynamic later to get the user's location
fetchWeather('New York'); // You can change this to any city
// Replace with your Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; 

const map = new mapboxgl.Map({
    container: 'mapbox-container', // HTML container ID
    style: 'mapbox://styles/mapbox/dark-v11', // A dark theme map style
    center: [-74.5, 40], // Initial map center [longitude, latitude]
    zoom: 9
});

// Example of a heatmap layer
map.on('load', () => {
    // Add a fake data source for the heatmap
    map.addSource('earthquakes', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                // Example data point
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-74.5, 40]
                    },
                    'properties': {
                        'mag': 1
                    }
                },
                // Add more data points here
            ]
        }
    });

    // Add the heatmap layer
    map.addLayer({
        'id': 'earthquakes-heat',
        'type': 'heatmap',
        'source': 'earthquakes',
        'maxzoom': 9,
        'paint': {
            // Adjust heatmap styling
            'heatmap-intensity': [ 'interpolate', ['linear'], ['zoom'], 0, 1, 9, 3 ],
            'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0, 0, 0, 0)',
                0.2, 'rgb(0, 128, 255)', // Blue
                0.4, 'rgb(0, 255, 0)',   // Green
                0.6, 'rgb(255, 255, 0)', // Yellow
                0.8, 'rgb(255, 165, 0)', // Orange
                1, 'rgb(255, 0, 0)'      // Red
            ],
            // ... more styling properties
        }
    }, 'waterway-label');
});