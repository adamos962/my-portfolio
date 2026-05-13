exports.handler = async (event) => {
	const city = event.queryStringParameters?.city;
	const languageParam = event.queryStringParameters?.lang;
	const weatherLanguage = ["cs", "en", "es"].includes(languageParam) ? languageParam : "cs";
	const headers = event.headers || {};
	const clientIp = headers['client-ip'] || headers['x-forwarded-for'] || 'unknown';

	if (!city || city.trim() === "") {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Název města je povinný" }),
			headers: corsHeaders(),
		};
	}

	const trimmedCity = city.trim();

	if (trimmedCity.length > 100) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Název města je příliš dlouhý" }),
			headers: corsHeaders(),
		};
	}

	if (!/^[\p{L}\p{N}\s'.-]+$/u.test(trimmedCity)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Název města obsahuje nepovolené znaky" }),
			headers: corsHeaders(),
		};
	}

	const apiKey = process.env.WEATHER_API_KEY;
	if (!apiKey) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Konfigurační chyba" }),
			headers: corsHeaders(),
		};
	}

	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric&lang=${weatherLanguage}`
		);

		if (!response.ok) {
			const text = await response.text();
			if (response.status === 404) {
				return {
					statusCode: 404,
					body: JSON.stringify({ error: "Město nebylo nalezeno", details: text }),
					headers: corsHeaders(),
				};
			}
			if (response.status === 401) {
				return {
					statusCode: 401,
					body: JSON.stringify({ error: "API klíč je neplatný", details: text }),
					headers: corsHeaders(),
				};
			}
			if (response.status === 429) {
				return {
					statusCode: 429,
					body: JSON.stringify({ error: "Příliš mnoho požadavků", details: text }),
					headers: corsHeaders(),
				};
			}
			return {
				statusCode: 500,
				body: JSON.stringify({ error: "OpenWeather API error", status: response.status, details: text }),
				headers: corsHeaders(),
			};
		}

		const data = await response.json();
		return {
			statusCode: 200,
			body: JSON.stringify(data),
			headers: corsHeaders(),
		};
	} catch (error) {
		console.error(`Weather API error (${clientIp}):`, error.message);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Nepodařilo se načíst počasí" }),
			headers: corsHeaders(),
		};
	}
};

function corsHeaders() {
	return {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "https://adameknovacek.netlify.app",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
}
