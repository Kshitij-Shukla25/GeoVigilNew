// Function to generate a random seismic frequency value
// Simulates a value between 0 and 100 Hz
function generateSeismicValue() {
    return Math.random() * 100;
}

// Initial data for the graph
const initialData = {
    labels: [],
    datasets: [{
        label: 'Seismic Frequency (Hz)',
        data: [],
        borderColor: '#54b83f', // A green color to match your design
        borderWidth: 2,
        fill: false,
        tension: 0.4 // Makes the line curved for a smoother look
    }]
};

// Configuration options for the graph
const config = {
    type: 'line',
    data: initialData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency (Hz)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
};

// Create the chart instance
const ctx = document.getElementById('seismicGraph');

// Check if the canvas element exists before creating the chart
if (ctx) {
    const seismicChart = new Chart(ctx, config);

    const MAX_DATA_POINTS = 20;

    // Function to update the chart with new data
    function updateChart() {
        const newValue = generateSeismicValue();
        const newLabel = new Date().toLocaleTimeString();

        // Add new data to the chart
        seismicChart.data.labels.push(newLabel);
        seismicChart.data.datasets[0].data.push(newValue);

        // Remove the oldest data point to keep the graph window from growing indefinitely
        if (seismicChart.data.labels.length > MAX_DATA_POINTS) {
            seismicChart.data.labels.shift();
            seismicChart.data.datasets[0].data.shift();
        }

        // Update the chart with the new data
        seismicChart.update();
    }

    // Update the chart every 2 seconds (2000 milliseconds)
    setInterval(updateChart, 2000);
}