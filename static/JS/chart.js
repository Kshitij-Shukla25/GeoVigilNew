
    const ctx = document.getElementById('realtimeChart').getContext('2d');

    const data = {
        labels: [], // time labels
        datasets: [{
            label: 'Sensor Value (10–20)',
            data: [],
            borderColor: 'red',
            borderWidth: 2,
            fill: True,
            tension: 0.2
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Time (s)' }
                },
                y: {
                    min: 0,  // optional → Y-axis lower bound
                    max: 30, // optional → Y-axis upper bound
                    title: { display: true, text: 'Random Value' }
                }
            }
        }
    };

    const realtimeChart = new Chart(ctx, config);

    // function to update chart every second
    let time = 0;
    setInterval(() => {
        // generate random value between 10 and 20
        const newValue = (Math.random() * (20 - 10) + 10).toFixed(2);

        // add data
        data.labels.push(time + "s");
        data.datasets[0].data.push(newValue);

        // keep only last 10 points
        if (data.labels.length > 10) {
            data.labels.shift();
            data.datasets[0].data.shift();
        }

        time++;
        realtimeChart.update();
    }, 1000);
