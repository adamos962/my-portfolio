exports.handler = async (event) => {
	const city = event.queryStringParameters?.city;

	if (!city || city.trim() === "") {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "City name is required" }),
		};
	}

	const apiKey = process.env.WEATHER_API_KEY;
	if (!apiKey) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "API key not configured" }),
		};
	}

	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=cs`
		);

		if (!response.ok) {
			const errorData = await response.json();
			return {
				statusCode: response.status,
				body: JSON.stringify(errorData),
			};
		}

		const data = await response.json();
		return {
			statusCode: 200,
			body: JSON.stringify(data),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
};
