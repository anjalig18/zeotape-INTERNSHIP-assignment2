const searchBox = document.querySelector(".search input");
const searchBtn = document.getElementById("search-btn");
const weatherIcons = document.querySelector(".weather-icon");
const tempUnit = document.getElementById("temp-unit"); // Dropdown for temperature unit
const chartCanvas = document.getElementById("weatherChart").getContext("2d");

// Add event listener to the search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    if (city) {
        checkWeather(city);
        fetchDailySummary(city);
    }
});

// Function to fetch and display weather data
async function checkWeather(city) {
    const response = await fetch(`/weather/stored/${city}`);
    
    if (response.status === 404) {
        document.querySelector(".alert").innerHTML = "Invalid city name.";
        document.querySelector(".alert").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return;
    }

    const data = await response.json();
    displayWeather(data);
}

// Function to display the weather data
function displayWeather(data) {
    let temp = Math.round(data.temperature);  // Default in Celsius
    const unit = tempUnit.value;

    // Convert to Fahrenheit if selected
    if (unit === "F") {
        temp = (temp * 9/5) + 32;
    }

    document.querySelector(".city").innerHTML = data.city;
    document.querySelector(".temperature").innerHTML = `${temp}°${unit}`;
    document.querySelector(".humidity").innerHTML = data.humidity + "%";
    document.querySelector(".wind").innerHTML = data.windSpeed + "km/h";

    // Update the weather icon based on the condition
    if (data.weatherCondition == "Clouds") {
        weatherIcons.src = "images/clouds.png";
    } else if (data.weatherCondition == "Rain") {
        weatherIcons.src = "images/rain.png";
    } else if (data.weatherCondition == "Clear") {
        weatherIcons.src = "images/clear.png";
    } else if (data.weatherCondition == "Drizzle") {
        weatherIcons.src = "images/drizzle.png";
    } else if (data.weatherCondition == "Mist") {
        weatherIcons.src = "images/mist.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".alert").style.display = "none";
}

// Function to fetch daily weather summaries
async function fetchDailySummary(city) {
    const response = await fetch(`/daily-summary/${city}`);
    
    if (response.status === 404) {
        console.log(`No summary available for ${city}`);
        document.querySelector(".chart-container").style.display = "none";
        return;
    }

    const data = await response.json();
    visualizeWeatherData(city, data);
}

// Function to visualize the daily weather summaries using Chart.js
function visualizeWeatherData(city, data) {
    const weatherChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: ['Average Temp', 'Max Temp', 'Min Temp'],  // X-axis labels
            datasets: [{
                label: `Weather Trends for ${city}`,
                data: [data.avgTemp, data.maxTemp, data.minTemp],  // Data points for each summary
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}
