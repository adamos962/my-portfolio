exports.handler = async (event) => {
	const city = event.queryStringParameters?.city;
	const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';

	// Basic input validation
	if (!city || city.trim() === "") {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Název města je povinný" }),
			headers: corsHeaders(),
		};
	}

	const trimmedCity = city.trim();

	// Sanitize: max length 100 chars, only alphanumeric, spaces, hyphens, apostrophes
	if (trimmedCity.length > 100) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Název města je příliš dlouhý" }),
			headers: corsHeaders(),
		};
	}

	if (!/^[a-zA-Z0-9\s\-'áíéóúůčšžĎŇŔŠŽ]+$/u.test(trimmedCity)) {
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
			`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric&lang=cs`
		);

		if (!response.ok) {
			if (response.status === 404) {
				return {
					statusCode: 404,
					body: JSON.stringify({ error: "Město nebylo nalezeno" }),
					headers: corsHeaders(),
				};
			}
			if (response.status === 401) {
				return {
					statusCode: 401,
					body: JSON.stringify({ error: "API klíč je neplatný" }),
					headers: corsHeaders(),
				};
			}
			throw new Error(`OpenWeather API error: ${response.status}`);
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
		"Access-Control-Allow-Origin": "https://adamnovak-portfolio.netlify.app",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
}
