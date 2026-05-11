function greetVisitor() {
	const heading = document.querySelector("h1.typewriter");

	if (heading) {
		heading.textContent += " Vítejte!";
	}
}

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

function buildRepoCard(repo) {
	const card = document.createElement("article");
	card.className = "github-project-card";

	const title = document.createElement("h3");
	title.className = "github-project-card__title";
	title.textContent = repo.name;
	card.appendChild(title);

	if (repo.language !== null) {
		const badge = document.createElement("span");
		badge.className = "github-project-card__badge";
		badge.textContent = repo.language;
		badge.style.backgroundColor = "#e0a35f";
		card.appendChild(badge);
	}

	const description = document.createElement("p");
	description.className = "github-project-card__description";
	description.textContent = repo.description ? repo.description : "Bez popisu.";
	card.appendChild(description);

	const link = document.createElement("a");
	link.className = "github-project-card__link";
	link.href = repo.html_url;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	link.textContent = "Otevřít na GitHubu";
	card.appendChild(link);

	return card;
}

async function loadGitHubProjects(username) {
	const projectsSection = document.querySelector("#projects");

	if (!projectsSection) {
		return;
	}

	projectsSection.replaceChildren();

	const heading = document.createElement("h2");
	heading.id = "github-projects-heading";
	heading.textContent = "GitHub projekty";
	projectsSection.appendChild(heading);

	const status = document.createElement("p");
	status.className = "github-projects__message";
	status.textContent = "Načítám repozitáře...";
	projectsSection.appendChild(status);

	try {
		const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&direction=desc`);

		if (!response.ok) {
			throw new Error(`GitHub API chyba: ${response.status}`);
		}

		const repositories = await response.json();
		const projectsGrid = document.createElement("div");
		projectsGrid.className = "github-projects__grid";

		repositories.forEach((repo) => {
			projectsGrid.appendChild(buildRepoCard(repo));
		});

		status.remove();
		projectsSection.appendChild(projectsGrid);
	} catch (error) {
		console.error("Nepodařilo se načíst GitHub projekty:", error);
		status.textContent = "GitHub projekty se nepodařilo načíst.";
	}
}

async function loadWeather(city) {
	const name = city.trim();

	if (!name) {
		clearWeatherCard();
		showWeatherMessage("Zadej název města.");
		return;
	}

	if (name.length > 100) {
		clearWeatherCard();
		showWeatherMessage("Název města je příliš dlouhý.");
		return;
	}

	if (!/^[a-zA-Z0-9\s\-'áíéóúůčšžĎŇŔŠŽ]+$/u.test(name)) {
		clearWeatherCard();
		showWeatherMessage("Název obsahuje nepovolené znaky.");
		return;
	}

	try {
		const response = await fetch(`/.netlify/functions/weather?city=${encodeURIComponent(name)}`);

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
		console.error("Chyba počasí:", error);
		clearWeatherCard();
		showWeatherMessage(error.message || "Počasí se nepodařilo načíst. Zkus to znovu.");
	}
}

async function sendChatMessage(msg) {
	const el = document.querySelector("#chat-response");
	const input = document.querySelector("#chat-input");
	const send = document.querySelector("#chat-send");
	if (!msg.trim() || send.disabled) return;
	send.disabled = true;
	el.textContent = "Načítám...";
	el.className = "chat-response loading";
	try {
		const res = await fetch("/.netlify/functions/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: msg.trim() })
		});
		const data = await res.json();
		if (!res.ok) {
			if (res.status === 429) {
				const retry = data.retryAfter || data.details || null;
				let messageText = "Příliš mnoho požadavků. Počkej chvíli.";
				if (retry && !isNaN(parseInt(retry))) {
					messageText = `Příliš mnoho požadavků. Počkej ${parseInt(retry)} s.`;
				}
				el.textContent = messageText;
				el.className = "chat-response error";
				// if numeric retry, disable send and start countdown
				if (retry && !isNaN(parseInt(retry))) {
					const seconds = Math.min(600, parseInt(retry));
					disableSendFor(seconds);
				}
				return;
			}
			throw new Error(data.error || `Chyba ${res.status}`);
		}
		el.textContent = data.reply || "Chyba.";
		el.className = "chat-response";
		input.value = "";
		input.focus();
	} catch (e) {
		el.textContent = e.message;
		el.className = "chat-response error";
	} finally {
		send.disabled = false;
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

	const bubble = document.querySelector("#chat-bubble");
	const modal = document.querySelector("#chat-modal");
	const closeBtn = document.querySelector("#chat-close");
	const send = document.querySelector("#chat-send");
	const inp = document.querySelector("#chat-input");
	
	if (bubble) {
		bubble.addEventListener("click", (e) => {
			e.stopPropagation();
			modal.removeAttribute("hidden");
			bubble.setAttribute("aria-expanded", "true");
			inp?.focus();
		});
	}
	
	if (closeBtn) {
		closeBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			modal.setAttribute("hidden", "");
			bubble.setAttribute("aria-expanded", "false");
		});
	}
	
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			modal.setAttribute("hidden", "");
			bubble?.setAttribute("aria-expanded", "false");
		}
	});
	
	if (send) send.addEventListener("click", () => sendChatMessage(inp?.value));
	if (inp) inp.addEventListener("keypress", (e) => {
		if (e.key === "Enter") sendChatMessage(inp.value);
	});

// helper to disable send button with visible countdown
function disableSendFor(seconds) {
	const sendBtn = document.querySelector("#chat-send");
 	const input = document.querySelector("#chat-input");
 	if (!sendBtn) return;
 	let remaining = seconds;
 	sendBtn.disabled = true;
 	const originalText = sendBtn.textContent;
 	const iv = setInterval(() => {
 		if (remaining <= 0) {
 			clearInterval(iv);
 			sendBtn.disabled = false;
 			sendBtn.textContent = originalText;
 			if (input) input.focus();
 			return;
 		}
 		sendBtn.textContent = `${originalText} (${remaining}s)`;
 		remaining -= 1;
 	}, 1000);
}

	function applyTheme(theme) {
		document.body.classList.toggle("dark-mode", theme === "dark");
	}

	function storedTheme() {
		try {
			return localStorage.getItem("theme");
		} catch (error) {
			return null;
		}
	}

	function toggleTheme() {
		const isDark = document.body.classList.toggle("dark-mode");

		try {
			localStorage.setItem("theme", isDark ? "dark" : "light");
		} catch (error) {
		}
	}

	const init = storedTheme();
	if (init) applyTheme(init);

	if (themeToggleButton) {
		themeToggleButton.addEventListener("click", toggleTheme);
	}

	loadGitHubProjects("adamos962");
});