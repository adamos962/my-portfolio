exports.handler = async function (event, context) {
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: { 'Allow': 'POST' },
			body: 'Metoda není povolena'
		};
	}

	try {
		const body = event.body || '{}';
		const { message } = JSON.parse(body);

		if (!message) {
			return {
				statusCode: 400,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ error: 'Chybějící zpráva' })
			};
		}

		const systemPrompt = `Jsi nápomocný asistent na portfoliu Adama Nováka. Adam ovládá HTML, CSS, JavaScript, C++, C#, Linux a Blender. Probíhá mu Erasmus+ stáž v oblasti webového vývoje. Odpovídej stručně a profesionálně o Adamovi v češtině. Pokud budeš tázán na něco nesouvisejícího, řekni nějaký vtip a poté přesměruj k Adamovým dovednostem nebo projektům. `;

		if (!process.env.GEMINI_API_KEY) {
			return {
				statusCode: 500,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ error: 'GEMINI_API_KEY není nastaven' })
			};
		}

		const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta' +
			'/models/gemini-2.0-flash:generateContent' +
			'?key=' + process.env.GEMINI_API_KEY;

		const response = await fetch(GEMINI_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ parts: [{ text: systemPrompt + '\n\nUser: ' + message }] }]
			})
		});

		if (!response.ok) {
			const text = await response.text();
			const retryAfter = response.headers ? response.headers.get('Retry-After') : null;
			if (response.status === 429) {
				return {
					statusCode: 429,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ error: 'Rate limit', details: text, retryAfter })
				};
			}

			return {
				statusCode: response.status || 500,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ error: 'Žádost selhala', details: text })
			};
		}

		const data = await response.json();
		const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Omlouvám se, ale na toto nedokážu odpovědět.';

		return {
			statusCode: 200,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reply })
		};
	} catch (err) {
		return {
			statusCode: 500,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ error: err.message })
		};
	}
};

