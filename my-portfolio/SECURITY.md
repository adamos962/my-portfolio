# Bezpečnost Portfolia

## Implementovaná Opatření Proti Útokům

### 1. XSS (Cross-Site Scripting) - Zabezpečeno ✓

**Implementace:**
- **CSP Headers** (`_headers`): Striktní Content-Security-Policy bez `unsafe-inline` pro scripty
  - `script-src 'self'` — pouze lokální skripty
  - `connect-src` — pouze k api.github.com a api.openweathermap.org
- **Bezpečné DOM metody**: Veškerá externe načtená data (GitHub API, OpenWeather API) jsou vkládána pomocí `textContent`, nikoli `innerHTML`
- **JSON-LD**: Bezpečné datové struktury (nejde o executable kód)

**Příklady v kódu:**
```javascript
// ✓ Bezpečné (vždy)
element.textContent = externalData;

// ✗ Nebezpečné (nikdy!)
// element.innerHTML = externalData;
```

### 2. SQL Injection - Zabezpečeno ✓

**Implementace:**
- Aplikace nemá přímý přístup k databázi (bez formulářů s POST na backend)
- Všechny externí API volání jdou přes serverless funkce s validací
- Weather API proxy validuje vstup regulárním výrazem:
  ```javascript
  if (!/^[a-zA-Z0-9\s\-'áíéóúůčšžĎŇŔŠŽ]+$/u.test(input)) { /* reject */ }
  ```

### 3. Input Validation - Zabezpečeno ✓

**Frontend (`script.js`):**
- Maximální délka: 100 znaků
- Regulární výraz: Jen písmena, čísla, mezery, pomlčky, apostrofy, diakritika
- Prázdné vstupy se zamítají

**Backend (`netlify/functions/weather.js`):**
- Stejná validace jako frontend
- Dodatečné CORS headers
- Logování chyb (bez citlivých dat)

### 4. Security Headers - Implementovány ✓

V `_headers`:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Cross-Origin-Resource-Policy: same-origin
```

### 5. CORS Opatření - Implementovány ✓

Serverless funkce vrací:
```
Access-Control-Allow-Origin: https://adamnovak-portfolio.netlify.app
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Max-Age: 86400
```

## Není v Aplikaci (a není potřeba)

- **CSRF Token**: Aplikace nedělá mutující operace (GET only)
- **Rate Limiting**: GitHub/OpenWeather mají své limity; pro produkci přidat Redis store
- **DDoS Protection**: Netlify má vestavěnou ochranu
- **WAF**: Netlify Pro má vestavěný WAF

## Jak Nasadit

1. **Nastav WEATHER_API_KEY** v Netlify Site Settings → Environment variables
2. **Deploy**: `git push origin main`
3. **Ověř headers**: `curl -I https://adamnovak-portfolio.netlify.app`
4. **Kontrola CSP**: Otevři DevTools → Network → odpověď na stránku, podívej se na `Content-Security-Policy` header

## Budoucí Vylepšení

- Přesunout na serverless formulář (Netlify Forms) pokud bude potřeba
- Přidat rate limiting (IP-based nebo GitHub account-based)
- Subresource Integrity (SRI) pro CDN obsah (pokud přidáš)
- Audit bezpečnosti (npm audit, OWASP)

---
Poslední aktualizace: 2026-05-07
