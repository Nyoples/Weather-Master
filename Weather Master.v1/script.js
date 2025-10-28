
const apiKey = "";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityElem = document.getElementById("city");
const tempElem = document.getElementById("temp");
const conditionElem = document.getElementById("condition");
const iconElem = document.getElementById("icon");
const humidityElem = document.getElementById("humidity");
const windElem = document.getElementById("wind");
const dateElem = document.getElementById("date");

const forecastContainer = document.querySelector(".forecast-container");

let isCelsius = true; 


async function fetchWeather(city) {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      handleError("City not found! Try again.");
      return;
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    displayWeather(weatherData);
    displayForecast(forecastData);
  } catch (error) {
    handleError("Connection error. Please check your internet.");
  }
}


function displayWeather(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const iconCode = data.weather[0].icon;

  cityElem.textContent = `${data.name}, ${data.sys.country}`;
  tempElem.textContent = `${Math.round(temp)}°C`;
  conditionElem.textContent = condition;
  humidityElem.textContent = `${humidity}%`;
  windElem.textContent = `${wind} m/s`;
  iconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  dateElem.textContent = new Date().toLocaleDateString();

  document.querySelector(".error")?.remove();
}


function displayForecast(data) {
  forecastContainer.innerHTML = ""; 

  
  const dailyForecast = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecast.forEach(day => {
    const date = new Date(day.dt_txt);
    const temp = Math.round(day.main.temp);
    const condition = day.weather[0].description;
    const icon = day.weather[0].icon;

    const dayCard = document.createElement("div");
    dayCard.classList.add("forecast-day");
    dayCard.innerHTML = `
      <p>${date.toLocaleDateString("en-US", { weekday: "short" })}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}">
      <p>${temp}°C</p>
      <p>${condition}</p>
    `;
    forecastContainer.appendChild(dayCard);
  });
}


function handleError(message) {
  forecastContainer.innerHTML = "";
  const errorMsg = document.createElement("p");
  errorMsg.textContent = message;
  errorMsg.classList.add("error");
  document.querySelector(".container").appendChild(errorMsg);
}


searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});


cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchWeather(cityInput.value.trim());
  }
});
