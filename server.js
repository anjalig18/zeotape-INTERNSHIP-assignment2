import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storeWeatherData, getWeatherData, storeDailySummaryInDB, getStoredWeatherData, getDailySummary } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = "3e9bbc82248dcb8b2c146e5de210ce2b";  // OpenWeatherMap API Key
const pollingInterval = 5 * 60 * 1000;  // Polling interval set to 5 minutes

// Helper to get the directory name (ESM doesn't support __dirname natively)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of Indian cities to monitor
const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for previous temperatures to track consecutive breaches
let previousTemperatures = {}; 
let consecutiveExceedances = {};

// Store user-defined thresholds
let userThresholds = {
    tempThreshold: 35,        // Default temperature threshold
    alertConsecutive: 2       // Default consecutive breach count
};

// Function to update user thresholds via POST request
app.post('/set-threshold', express.json(), (req, res) => {
    const { tempThreshold, alertConsecutive } = req.body;
    if (tempThreshold) userThresholds.tempThreshold = tempThreshold;
    if (alertConsecutive) userThresholds.alertConsecutive = alertConsecutive;
    res.json({ message: "Thresholds updated successfully" });
});

// Function to check if temperature exceeds threshold for consecutive updates
function checkTemperatureThreshold(city, currentTemp) {
    const previousTemp = previousTemperatures[city];
    const { tempThreshold, alertConsecutive } = userThresholds; // Configurable thresholds

    // Check if temperature exceeded the threshold for consecutive updates
    if (previousTemp && previousTemp > tempThreshold && currentTemp > tempThreshold) {
        consecutiveExceedances[city] = (consecutiveExceedances[city] || 0) + 1;

        if (consecutiveExceedances[city] >= alertConsecutive) {
            console.log(`ALERT: Temperature in ${city} has exceeded ${tempThreshold}°C for ${alertConsecutive} consecutive updates.`);
            document.querySelector(".alert").innerHTML = `ALERT: Temperature in ${city} has exceeded ${tempThreshold}°C for ${alertConsecutive} consecutive updates.`;
        }
    } else {
        consecutiveExceedances[city] = 0;  // Reset if the threshold is not breached
    }

    // Update the previous temperature
    previousTemperatures[city] = currentTemp;
}


// Fetch weather data from OpenWeatherMap API and handle threshold checks and data storage
async function fetchWeatherForCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            console.log(`City ${city} not found`);
            return;
        }

        // Convert temperature from Kelvin to Celsius
        const currentTemp = data.main.temp - 273.15;  // Convert to Celsius
        data.main.temp = currentTemp;
        data.main.temp_max = data.main.temp_max - 273.15;
        data.main.temp_min = data.main.temp_min - 273.15;

        // Check for threshold breach
        checkTemperatureThreshold(city, currentTemp);

        // Store the weather data in the database
        storeWeatherData(city, data);

        // Calculate and store daily summaries (average, min, max, dominant condition)
        calculateDailyAggregates(city);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to calculate daily aggregates for a city
function calculateDailyAggregates(city) {
    getStoredWeatherData(city, (err, weatherData) => {
        if (err || !weatherData.length) {
            console.error(`No data found for ${city}`);
            return;
        }

        let totalTemp = 0;
        let maxTemp = -Infinity;
        let minTemp = Infinity;
        let conditionCounts = {};

        // Calculate aggregates based on the stored data throughout the day
        weatherData.forEach((data) => {
            const temp = data.temperature;
            totalTemp += temp;

            if (temp > maxTemp) {
                maxTemp = temp;
            }

            if (temp < minTemp) {
                minTemp = temp;
            }

            const condition = data.weatherCondition;
            conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        });

        // Calculate average temperature for the day
        const avgTemp = totalTemp / weatherData.length;

        // Find the dominant weather condition (most frequent)
        const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
            conditionCounts[a] > conditionCounts[b] ? a : b
        );

        // Store the daily summary in the database
        const dailySummary = {
            city,
            avgTemp: avgTemp.toFixed(2),  // Round to 2 decimal places
            maxTemp,
            minTemp,
            dominantCondition,
            date: new Date().toISOString().split('T')[0]  // Store the date as YYYY-MM-DD
        };

        storeDailySummaryInDB(dailySummary);
        console.log(`Stored daily summary for ${city}:`, dailySummary);
    });
}

// Poll the API for all cities at a configured interval
function startPollingWeatherData() {
    cities.forEach(city => {
        fetchWeatherForCity(city);
    });
}

setInterval(startPollingWeatherData, pollingInterval); // Poll every 5 minutes
startPollingWeatherData(); // Start polling immediately

// Endpoint to fetch stored daily summary for a city
app.get('/daily-summary/:city', (req, res) => {
    const city = req.params.city;

    getDailySummary(city, (err, data) => {
        if (err || !data) {
            res.status(404).json({ message: `No daily summary found for city ${city}` });
        } else {
            res.json(data);
        }
    });
});

// Endpoint to fetch current weather data (stored in the database)
app.get('/weather/stored/:city', (req, res) => {
    const city = req.params.city;

    getWeatherData(city, (err, data) => {
        if (err || !data) {
            res.status(404).json({ message: `No stored data found for city ${city}` });
        } else {
            res.json(data);
        }
    });
});

// Fallback for unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
