function greetVisitor() {
	const heading = document.querySelector("h1");

	if (heading) {
		heading.textContent += " Vítejte!";
	}
}

const weatherApiKey = process.env.WEATHER_API_KEY;
const weatherEls = {
	message: document.querySelector("#weather-message"),
	cityName: document.querySelector("#weather-city-name"),
	temperature: document.querySelector("#weather-temperature"),
	description: document.querySelector("#weather-description"),
	humidity: document.querySelector("#weather-humidity"),
	wind: document.querySelector("#weather-wind"),
};

function clearWeatherCard() {
	if (weatherEls.cityName) weatherEls.cityName.textContent = "—";
	if (weatherEls.temperature) weatherEls.temperature.textContent = "—";
	if (weatherEls.description) weatherEls.description.textContent = "—";
	if (weatherEls.humidity) weatherEls.humidity.textContent = "—";
	if (weatherEls.wind) weatherEls.wind.textContent = "—";
}

function showWeatherMessage(message) {
	if (weatherEls.message) {
		weatherEls.message.textContent = message;
	}
}

async function loadWeather(city) {
	const name = city.trim();

	if (!name) {
		clearWeatherCard();
		showWeatherMessage("Zadej název města.");
		return;
	}

	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${weatherApiKey}&units=metric&lang=cs`);

		if (!response.ok) {
			if (response.status === 404) throw new Error("Město nebylo nalezeno.");
			if (response.status === 401) throw new Error("OpenWeather API klíč není platný nebo ještě není aktivní.");
			throw new Error(`HTTP chyba: ${response.status}`);
		}

		const data = await response.json();
		const cityName = data.name ? `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ""}` : name;
		const temperature = Math.round(data.main.temp * 10) / 10;

		if (weatherEls.cityName) weatherEls.cityName.textContent = cityName;
		if (weatherEls.temperature) weatherEls.temperature.textContent = `${temperature} °C`;
		if (weatherEls.description) weatherEls.description.textContent = data.weather?.[0]?.description ?? "Bez popisu";
		if (weatherEls.humidity) weatherEls.humidity.textContent = `${data.main.humidity} %`;
		if (weatherEls.wind) weatherEls.wind.textContent = `${data.wind.speed} m/s`;

		showWeatherMessage(`Aktualizováno pro ${cityName}.`);
	} catch (error) {
		console.error("Něco se nepovedlo:", error);
		clearWeatherCard();
		showWeatherMessage(error.message || "Počasí se nepodařilo načíst. Zkus to znovu.");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	greetVisitor();

	const weatherSearchButton = document.querySelector("[data-weather-search]");
	const weatherCityInput = document.querySelector("#weather-city-input");
	const themeToggleButton = document.querySelector("[data-theme-toggle]");

	if (weatherSearchButton && weatherCityInput) {
		clearWeatherCard();
		weatherSearchButton.addEventListener("click", () => loadWeather(weatherCityInput.value));
	}

	if (themeToggleButton) {
		themeToggleButton.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
	}
});