function corsHeaders() {
	return {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "https://adameknovacek.netlify.app",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	};
}

async function listModels(apiKey) {
	const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
	const response = await fetch(url, { method: "GET" });
	if (!response.ok) {
		const text = await response.text();
		return {
			ok: false,
			status: response.status,
			body: { error: "ListModels selhalo", details: text }
		};
	}

	const data = await response.json();
	const models = Array.isArray(data.models) ? data.models : [];
	const available = models
		.filter((model) => Array.isArray(model.supportedGenerationMethods) && model.supportedGenerationMethods.includes("generateContent"))
		.map((model) => model.name);

	return {
		ok: true,
		status: 200,
		body: { models: available }
	};
}

exports.handler = async function (event, context) {
	const isListModelsRequest = event.httpMethod === "GET" && event.queryStringParameters?.listModels === "1";

	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: corsHeaders(),
			body: ''
		};
	}

	if (!isListModelsRequest && event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: corsHeaders(),
			body: 'Metoda není povolena'
		};
	}

	try {
		const systemPrompt = `Jsi inteligentní virtuální asistent portfolia Adama Nováka. Reprezentuj Adama profesionálně a stručno; odpovídej maximálně 2–3 větami.

	### PROFIL ADAMA NOVÁKA:
	- Web Development: HTML5, CSS3, JavaScript (moderní frontendové přístupy).
	- Programování: C++ a C#.
	- Infrastruktura: zkušenosti se systémovou prací a terminálem.
	- Kreativa: 3D modelování v Blenderu, velmi kreativní.
	- Aktuální status: stáž se zaměřením na webový vývoj.

	### KOMUNIKAČNÍ STRATEGIE:
	1. Používej hovorový a přátelský tón.
	2. Do odpovědí lze občas vložit krátkou technickou zajímavost související s dotazem.
	3. Pokud uživatel položí nesouvisející otázku, odpověz a udělej "oslí můstek" zpět k portfoliu nebo kontaktu.
	4. Cílem je motivovat návštěvníka k prohlédnutí projektů nebo k zaslání zprávy.`;
		if (!process.env.GEMINI_API_KEY) {
			return {
				statusCode: 500,
				headers: corsHeaders(),
				body: JSON.stringify({ error: 'GEMINI_API_KEY není nastaven' })
			};
		}

		if (isListModelsRequest) {
			const result = await listModels(process.env.GEMINI_API_KEY);
			return {
				statusCode: result.status,
				headers: corsHeaders(),
				body: JSON.stringify(result.body)
			};
		}

		const body = event.body || '{}';
		const { message } = JSON.parse(body);

		if (!message) {
			return {
				statusCode: 400,
				headers: corsHeaders(),
				body: JSON.stringify({ error: 'Chybějící zpráva' })
			};
		}

		const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
		const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1' +
			'/models/' + GEMINI_MODEL + ':generateContent' +
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
					headers: corsHeaders(),
					body: JSON.stringify({ error: 'Rate limit', details: text, retryAfter })
				};
			}

			return {
				statusCode: response.status || 500,
				headers: corsHeaders(),
				body: JSON.stringify({ error: 'Žádost selhala', details: text })
			};
		}

		const data = await response.json();
		const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Omlouvám se, ale na toto nedokážu odpovědět.';

		return {
			statusCode: 200,
			headers: corsHeaders(),
			body: JSON.stringify({ reply })
		};
	} catch (err) {
		return {
			statusCode: 500,
			headers: corsHeaders(),
			body: JSON.stringify({ error: err.message })
		};
	}
};

