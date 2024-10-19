import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database file
const dbPath = path.resolve(__dirname, 'weather.db');

// Create and open the SQLite database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables for weather data and daily summaries
db.run(`
    CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        temperature REAL,
        humidity REAL,
        windSpeed REAL,
        weatherCondition TEXT,
        timestamp TEXT
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS daily_summary (
        city TEXT,
        avgTemp REAL,
        maxTemp REAL,
        minTemp REAL,
        dominantCondition TEXT,
        date TEXT
    );
`);

// Store weather data in the database
export function storeWeatherData(city, data) {
    const query = `
        INSERT INTO weather (city, temperature, humidity, windSpeed, weatherCondition, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const timestamp = new Date().toISOString();

    db.run(query, [city, data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].main, timestamp], function (err) {
        if (err) {
            console.error('Error storing weather data:', err.message);
        } else {
            console.log(`Weather data for ${city} stored successfully.`);
        }
    });
}

// Store daily summary (e.g., average, max, min temperatures)
export function storeDailySummary(city, data) {
    const date = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
    
    const query = `
        INSERT INTO daily_summary (city, avgTemp, maxTemp, minTemp, dominantCondition, date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [city, data.main.temp, data.main.temp_max, data.main.temp_min, data.weather[0].main, date], function (err) {
        if (err) {
            console.error('Error storing daily summary:', err.message);
        } else {
            console.log(`Daily summary for ${city} stored successfully.`);
        }
    });
}

// Function to retrieve daily summary for a city
export function getDailySummary(city, callback) {
    const query = `SELECT * FROM daily_summary WHERE city = ? ORDER BY date DESC LIMIT 1`;

    db.get(query, [city], (err, row) => {
        if (err) {
            console.error('Error retrieving daily summary:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}
