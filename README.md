
# **Application_2_Real-Time_Data_Processing_System_for_Weather_Monitoring**

Based on your project's requirements and the files you've uploaded, I have updated the README content for **Assignment 2** to include all necessary elements such as codebase details, design choices, and dependencies. Here's the comprehensive **README.md** file code:

# **Real-Time Weather Monitoring App**

This project is a real-time weather monitoring application that fetches weather data from the **OpenWeatherMap API** and displays it in a user-friendly interface. It also includes daily weather summaries, alerts for temperature thresholds, and visualizations of weather trends using **Chart.js**.

## **Table of Contents**
1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Installation and Setup](#installation-and-setup)
4. [How to Run](#how-to-run)
5. [Dependencies](#dependencies)
6. [Usage](#usage)
7. [Design Choices](#design-choices)
8. [API Endpoints](#api-endpoints)
9. [Alerts and Thresholds](#alerts-and-thresholds)
10. [Visualization](#visualization)
11. [Contributing](#contributing)
12. [License](#license)

---

## **Features**

- Fetches real-time weather data for Indian metros (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad) at a configurable interval (default: every 5 minutes).
- Converts temperature values from Kelvin to Celsius or Fahrenheit based on user preference.
- Aggregates daily weather data, calculating average, max, min temperatures, and dominant weather condition.
- User-configurable temperature thresholds trigger alerts if breached consecutively.
- Displays daily weather summaries and trends using **Chart.js** for easy visualization.

---

## **Project Structure**

```plaintext
weather-monitoring-app/
├── node_modules/                # Node.js dependencies
├── public/
│   ├── images/                  # Icons for weather conditions (clear, clouds, rain, etc.)
│   │   ├── clear.png
│   │   ├── clouds.png
│   │   ├── drizzle.png
│   │   ├── humidity.png
│   │   ├── mist.png
│   │   ├── rain.png
│   │   ├── search.png
│   │   └── wind.png
│   ├── index.html               # Main HTML file for the user interface
│   └── style.css                # CSS styles for the front-end
├── script.js                    # Front-end logic for fetching and rendering weather data
├── database.js                  # Database functions (storing/retrieving data)
├── server.js                    # Node.js server file, handles API calls and polling
├── package.json                 # Project dependencies and npm scripts
├── package-lock.json            # Version-locked dependencies
├── weather.db                   # SQLite database for storing weather data
└── README.md                    # Documentation file (this file)
```

---

## **Installation and Setup**

To set up the project on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/weather-monitoring-app.git
   cd weather-monitoring-app
   ```

2. **Install dependencies**: Run the following command to install all project dependencies:
   ```bash
   npm install
   ```

3. **Create a `.env` file** for storing your OpenWeatherMap API key:
   ```bash
   API_KEY=your_openweathermap_api_key
   ```

---

## **How to Run**

1. **Start the Node.js server**:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

2. Open your browser and navigate to `http://localhost:3000`. You can enter any Indian city name to get the weather data and visualizations.

---

## **Dependencies**

The following dependencies are required to run the application:

- **Node.js**: Backend server to handle API requests and weather polling.
- **Express.js**: Web framework for Node.js to serve static files and handle routing.
- **node-fetch**: Fetch weather data from the OpenWeatherMap API.
- **sqlite3**: For storing weather data and daily summaries.
- **Chart.js**: Used for visualizing weather trends on the front-end.
- **dotenv**: To handle environment variables (API keys).

---

## **Usage**

1. **Search for Weather Data**:
   - Enter the name of an Indian city (e.g., Delhi, Mumbai) in the search box.
   - The app will fetch the real-time weather data and display it, including temperature, humidity, and wind speed.

2. **Set Temperature Units**:
   - You can toggle between **Celsius** and **Fahrenheit** using the dropdown.

3. **View Daily Summaries**:
   - The app will calculate and display daily summaries including average, max, and min temperatures as well as the dominant weather condition for the day.

4. **Alerts for Temperature Thresholds**:
   - You can set temperature thresholds, and the app will display an alert if the temperature exceeds your threshold for consecutive updates.

---

## **Design Choices**

1. **Modular Structure**: The application is separated into three key components:
   - **Server-side logic** (`server.js`): Handles weather data fetching, polling, and API routes.
   - **Database** (`database.js`): Used for storing weather data and calculating daily summaries.
   - **Front-end** (`index.html`, `script.js`, `Chart.js`): Displays weather data, alerts, and visualizations.

2. **User Preferences**:
   - Users can choose their preferred temperature unit (Celsius or Fahrenheit), and the app will adjust accordingly.
   - Alerts are configurable, allowing users to set custom temperature thresholds.

3. **Polling**:
   - Weather data is fetched from OpenWeatherMap every 5 minutes for predefined Indian cities, ensuring real-time monitoring.

---

## **API Endpoints**

1. **Get Current Weather Data**:
   - Endpoint: `/weather/stored/:city`
   - Fetches the stored weather data for the given city.

2. **Get Daily Weather Summary**:
   - Endpoint: `/daily-summary/:city`
   - Retrieves the daily summary (average, max, min temperatures) for the given city.

3. **Set Alert Thresholds**:
   - Endpoint: `/set-threshold`
   - Method: `POST`
   - Body: `{ "tempThreshold": <number>, "alertConsecutive": <number> }`
   - Sets the user-configurable thresholds for temperature alerts.

---

## **Alerts and Thresholds**

- **Threshold Settings**: You can configure your temperature threshold (e.g., 35°C) via a POST request. The app will monitor temperature updates and display alerts if the temperature exceeds this threshold for consecutive updates.
- **Alert Display**: Alerts will appear on the same page, below the weather data, when thresholds are breached.

---

## **Visualization**

**Chart.js** is used for plotting daily summaries:
- **Line Graph**: Displays average, max, and min temperatures for each day.
- **User-Friendly Interface**: Data is fetched dynamically and visualized to provide clear trends for the selected city.

---

## **Contributing**

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to create an issue or submit a pull request.

---

## **License**

This project is licensed under the MIT License.
