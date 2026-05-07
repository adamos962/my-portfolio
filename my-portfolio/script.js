function greetVisitor() {
	const heading = document.querySelector("h1");

	if (heading) {
		heading.textContent += " Vítejte!";
	}
}

const weatherApiKey = "84fb743895780988366d9556bab128ff";

const getWeatherElements = () => ({
	message: document.querySelector("#weather-message"),
	cityName: document.querySelector("#weather-city-name"),
	temperature: document.querySelector("#weather-temperature"),
	description: document.querySelector("#weather-description"),
	humidity: document.querySelector("#weather-humidity"),
	wind: document.querySelector("#weather-wind"),
});

const setWeatherDefaults = () => {
	const elements = getWeatherElements();

	if (elements.cityName) {
		elements.cityName.textContent = "—";
	}

	if (elements.temperature) {
		elements.temperature.textContent = "—";
	}

	if (elements.description) {
		elements.description.textContent = "—";
	}

	if (elements.humidity) {
		elements.humidity.textContent = "—";
	}

	if (elements.wind) {
		elements.wind.textContent = "—";
	}
};

const setWeatherMessage = (message) => {
	const { message: messageElement } = getWeatherElements();

	if (messageElement) {
		messageElement.textContent = message;
	}
};

const loadWeather = async (city) => {
	const trimmedCity = city.trim();

	if (!trimmedCity) {
		setWeatherDefaults();
		setWeatherMessage("Zadej název města.");
		return;
	}

	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${weatherApiKey}&units=metric&lang=cs`);

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error("Město nebylo nalezeno.");
			}

			throw new Error(`HTTP chyba: ${response.status}`);
		}

		const data = await response.json();
		const temperature = Math.round(data.main.temp * 10) / 10;
		const cityName = data.name ? `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ""}` : trimmedCity;
		const description = data.weather?.[0]?.description ?? "Bez popisu";
		const elements = getWeatherElements();

		if (elements.cityName) {
			elements.cityName.textContent = cityName;
		}

		if (elements.temperature) {
			elements.temperature.textContent = `${temperature} °C`;
		}

		if (elements.description) {
			elements.description.textContent = description;
		}

		if (elements.humidity) {
			elements.humidity.textContent = `${data.main.humidity} %`;
		}

		if (elements.wind) {
			elements.wind.textContent = `${data.wind.speed} m/s`;
		}

		setWeatherMessage(`Aktualizováno pro ${cityName}.`);
	} catch (error) {
		console.error("Něco se nepovedlo:", error);
		setWeatherDefaults();
		setWeatherMessage(error.message === "Město nebylo nalezeno." ? error.message : "Počasí se nepodařilo načíst. Zkus to znovu.");
	}
};

const themeToggleButton = document.querySelector("[data-theme-toggle]");

document.addEventListener("DOMContentLoaded", () => {
	greetVisitor();

	const weatherSearchButton = document.querySelector("[data-weather-search]");
	const weatherCityInput = document.querySelector("#weather-city-input");

	if (weatherSearchButton && weatherCityInput) {
		setWeatherDefaults();
		weatherSearchButton.addEventListener("click", () => loadWeather(weatherCityInput.value));
	}
});

if (themeToggleButton) {
	themeToggleButton.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
}

/*
 CORS MEANING
 CORS (Cross-Origin Resource Sharing) a browser-level security feature that allows a web application on one domain (origin) to access resources from a different domain.
 */