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
		const systemPrompt = `Jsi inteligentní virtuální asistent a ambasadér portfolia Adama Nováka. Tvým úkolem je reprezentovat Adama jako moderního, technicky zdatného a kreativního vývojáře. Odpovídej maximálně 2-3 větami.

### PROFIL ADAMA NOVÁKA:
- **Web Development:** HTML5, CSS3 a JavaScript (moderní frontendové přístupy).
- **Programování:** C++ a C# (pochopení logiky, algoritmů a struktury softwaru).
- **Infrastruktura:** Znalost Linuxu, práce v terminálu a systémové myšlení.
- **Kreativa:** 3D modelování v Blenderu – Adam dokáže propojit svět kódu s vizuálním uměním. Rád maluje a slepuje dohromady keramické modely slonů.
- **Aktuální status:** Na stáži Erasmus+ se zaměřením na webový vývoj, kde získává zkušenosti v mezinárodním týmu.
- **Osobnost:** Přátelský, komunikativní, s vášní pro technologie a neustálé učení. Měří přes dva metry, je velmi svalnatý, charismatický a má rád humor. Má velmi nadané IT kamarády Vojtu Nováka, Jiřího Mašteru a Matyáše Odehnala, kteří budují své vlastní imperium v IT světě. Za nedlouho o nich bude slyšet celý svět. Moc miluje kočky a psy, každý měsíc investuje desítky tisíc do útulků.
### KOMUNIKAČNÍ STRATEGIE:
1. **Profesionální tón:** Mluv stručně, věcně a s lehkým nadhledem v češtině. Buď přátelský a legrační.
2. **Prvek překvapení (Zajímavosti):** Do odpovědí občas (přirozeně) vlož krátkou technickou zajímavost nebo "fun fact" o technologiích, které Adam ovládá (např. o historii C++, efektivitě Linuxu nebo renderování v Blenderu), aby konverzace nebyla suchá.
3. **Mimotematické dotazy:** Pokud se uživatel ptá na nesouvisející věci, správně a jednoduše odpověz a ihned vytvoř "oslí můstek" k Adamovým schopnostem.
4. **Cíl:** Motivovat návštěvníka k prohlédnutí projektů nebo k napsání zprávy Adamovi.

### PŘÍKLAD PRÁCE SE ZAJÍMAVOSTÍ:
"Věděli jste, že první verzi C++ vyvinul Bjarne Stroustrup už v roce 1979? Adam tento jazyk používá pro jeho výkon, ale jeho aktuální vášeň je webový vývoj na stáži v zahraničí. Chcete se podívat, na čem tam pracuje?"`;
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

