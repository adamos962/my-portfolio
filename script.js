function greetVisitor() {
    const e = document.querySelector("h1.typewriter");
    e && (e.textContent += " Vítejte!");
}
const weatherEls = {
    message: document.querySelector("#weather-message"),
    cityName: document.querySelector("#weather-city-name"),
    temperature: document.querySelector("#weather-temperature"),
    description: document.querySelector("#weather-description"),
    humidity: document.querySelector("#weather-humidity"),
    wind: document.querySelector("#weather-wind"),
};
let chatCooldownUntil = 0,
    chatCooldownTimer = null;
function clearWeatherCard() {
    weatherEls.cityName && (weatherEls.cityName.textContent = "—"),
        weatherEls.temperature && (weatherEls.temperature.textContent = "—"),
        weatherEls.description && (weatherEls.description.textContent = "—"),
        weatherEls.humidity && (weatherEls.humidity.textContent = "—"),
        weatherEls.wind && (weatherEls.wind.textContent = "—");
}
function showWeatherMessage(e) {
    weatherEls.message && (weatherEls.message.textContent = e);
}
function extractRetrySeconds(e) {
    if (!e) return null;
    const t = String(e).match(/retry in\s*(\d+\.?\d*)s/i) || String(e).match(/retryDelay\"?\s*:\s*\"?(\d+)s/i);
    return t ? Math.ceil(parseFloat(t[1])) : null;
}
function disableSendFor(e) {
    const t = document.querySelector("#chat-send"),
        n = document.querySelector("#chat-input");
    if (!t) return;
    let a = e;
    (chatCooldownUntil = Date.now() + 1e3 * e),
        chatCooldownTimer && clearInterval(chatCooldownTimer),
        (t.disabled = !0);
    const o = t.textContent;
    chatCooldownTimer = setInterval(() => {
        if (a <= 0)
            return (
                clearInterval(chatCooldownTimer),
                (chatCooldownTimer = null),
                (chatCooldownUntil = 0),
                (t.disabled = !1),
                (t.textContent = o),
                void (n && n.focus())
            );
        (t.textContent = `${o} (${a}s)`), (a -= 1);
    }, 1e3);
}
function buildRepoCard(e) {
    const t = document.createElement("article");
    t.className = "github-project-card";
    const n = document.createElement("h3");
    if (
        ((n.className = "github-project-card__title"), (n.textContent = e.name), t.appendChild(n), null !== e.language)
    ) {
        const n = document.createElement("span");
        (n.className = "github-project-card__badge"),
            (n.textContent = e.language),
            (n.style.backgroundColor = "#e0a35f"),
            t.appendChild(n);
    }
    const a = document.createElement("p");
    (a.className = "github-project-card__description"),
        (a.textContent = e.description ? e.description : "Bez popisu."),
        t.appendChild(a);
    const o = document.createElement("a");
    return (
        (o.className = "github-project-card__link"),
        (o.href = e.html_url),
        (o.target = "_blank"),
        (o.rel = "noopener noreferrer"),
        (o.textContent = "Otevřít na GitHubu"),
        t.appendChild(o),
        t
    );
}
async function loadGitHubProjects(e) {
    const t = document.querySelector("#projects");
    if (!t) return;
    t.replaceChildren();
    const n = document.createElement("h2");
    (n.id = "github-projects-heading"), (n.textContent = "GitHub projekty"), t.appendChild(n);
    const a = document.createElement("p");
    (a.className = "github-projects__message"), (a.textContent = "Načítám repozitáře..."), t.appendChild(a);
    try {
        const n = await fetch(
            `https://api.github.com/users/${encodeURIComponent(e)}/repos?sort=updated&per_page=100&direction=desc`
        );
        if (!n.ok) throw new Error(`GitHub API chyba: ${n.status}`);
        const o = await n.json(),
            r = document.createElement("div");
        (r.className = "github-projects__grid"),
            o.forEach((e) => {
                r.appendChild(buildRepoCard(e));
            }),
            a.remove(),
            t.appendChild(r);
    } catch (e) {
        console.error("Nepodařilo se načíst GitHub projekty:", e),
            (a.textContent = "GitHub projekty se nepodařilo načíst.");
    }
}
async function loadWeather(e) {
    const t = e.trim();
    if (!t) return clearWeatherCard(), void showWeatherMessage("Zadej název města.");
    if (t.length > 100) return clearWeatherCard(), void showWeatherMessage("Název města je příliš dlouhý.");
    if (!/^[\p{L}\p{N}\s'.-]+$/u.test(t))
        return clearWeatherCard(), void showWeatherMessage("Název obsahuje nepovolené znaky.");
    try {
        const e = await fetch(`/.netlify/functions/weather?city=${encodeURIComponent(t)}`);
        if (!e.ok) {
            if (404 === e.status) throw new Error("Město nebylo nalezeno.");
            if (401 === e.status) throw new Error("OpenWeather API klíč není platný nebo ještě není aktivní.");
            throw new Error(`HTTP chyba: ${e.status}`);
        }
        const n = await e.json(),
            a = n.name ? `${n.name}${n.sys?.country ? `, ${n.sys.country}` : ""}` : t,
            o = Math.round(10 * n.main.temp) / 10;
        weatherEls.cityName && (weatherEls.cityName.textContent = a),
            weatherEls.temperature && (weatherEls.temperature.textContent = `${o} °C`),
            weatherEls.description &&
                (weatherEls.description.textContent = n.weather?.[0]?.description ?? "Bez popisu"),
            weatherEls.humidity && (weatherEls.humidity.textContent = `${n.main.humidity} %`),
            weatherEls.wind && (weatherEls.wind.textContent = `${n.wind.speed} m/s`),
            showWeatherMessage(`Aktualizováno pro ${a}.`);
    } catch (e) {
        console.error("Chyba počasí:", e),
            clearWeatherCard(),
            showWeatherMessage(e.message || "Počasí se nepodařilo načíst. Zkus to znovu.");
    }
}
async function sendChatMessage(e) {
    const t = document.querySelector("#chat-response"),
        n = document.querySelector("#chat-input"),
        a = document.querySelector("#chat-send");
    if (!(Date.now() < chatCooldownUntil) && e.trim() && !a.disabled) {
        (a.disabled = !0), (t.textContent = "Načítám..."), (t.className = "chat-response loading");
        try {
            const a = await fetch("/.netlify/functions/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: e.trim() }),
                }),
                o = await a.text();
            let r = {};
            if (o)
                try {
                    r = JSON.parse(o);
                } catch (e) {
                    r = { error: o };
                }
            if (!a.ok) {
                if (404 === a.status)
                    throw new Error(
                        "Chat function nebyla na této doméně nalezena. Znovu musíš spustit netlify site s funkcí chat."
                    );
                if (429 === a.status) {
                    const e = r.retryAfter || extractRetrySeconds(r.details) || extractRetrySeconds(r.error) || null;
                    let n = "Příliš mnoho požadavků. Počkej chvíli a zkus to znovu.";
                    if (
                        (e && !isNaN(parseInt(e)) && (n = `Příliš mnoho požadavků. Počkej ${parseInt(e)} s.`),
                        (t.textContent = n),
                        (t.className = "chat-response error"),
                        e && !isNaN(parseInt(e)))
                    ) {
                        disableSendFor(Math.min(600, parseInt(e)));
                    }
                    return;
                }
                throw new Error(r.error || `Chyba ${a.status}`);
            }
            (t.textContent = r.reply || "Chyba."), (t.className = "chat-response"), (n.value = ""), n.focus();
        } catch (e) {
            (t.textContent = e.message), (t.className = "chat-response error");
        } finally {
            Date.now() >= chatCooldownUntil && (a.disabled = !1);
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    "undefined" != typeof gtag
        ? console.log("✓ Google Analytics loaded successfully")
        : console.warn("⚠ Google Analytics script not yet available on DOMContentLoaded"),
        greetVisitor();
    const e = document.querySelector("[data-weather-search]"),
        t = document.querySelector("#weather-city-input"),
        n = document.querySelector("[data-theme-toggle]");
    e && t && (clearWeatherCard(), e.addEventListener("click", () => loadWeather(t.value)));
    const a = document.querySelector("#chat-bubble"),
        o = document.querySelector("#chat-modal"),
        r = document.querySelector("#chat-close"),
        s = document.querySelector("#chat-send"),
        c = document.querySelector("#chat-input");
    a &&
        a.addEventListener("click", (e) => {
            e.stopPropagation(), o.removeAttribute("hidden"), a.setAttribute("aria-expanded", "true"), c?.focus();
        }),
        r &&
            r.addEventListener("click", (e) => {
                e.stopPropagation(), o.setAttribute("hidden", ""), a.setAttribute("aria-expanded", "false");
            }),
        document.addEventListener("keydown", (e) => {
            "Escape" === e.key && (o.setAttribute("hidden", ""), a?.setAttribute("aria-expanded", "false"));
        }),
        s && s.addEventListener("click", () => sendChatMessage(c?.value)),
        c &&
            c.addEventListener("keypress", (e) => {
                "Enter" === e.key && sendChatMessage(c.value);
            });
    const i = (function () {
        try {
            return localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    })();
    var d;
    i && ((d = i), document.body.classList.toggle("dark-mode", "dark" === d)),
        n &&
            n.addEventListener("click", function () {
                const e = document.body.classList.toggle("dark-mode");
                try {
                    localStorage.setItem("theme", e ? "dark" : "light");
                } catch (e) {}
            }),
        loadGitHubProjects("adamos962");
    const l = document.querySelector("form[name=kontaktni-formular]");
    function u(e, t = {}) {
        const n = (a = 0) => {
            "undefined" != typeof gtag
                ? (console.log("✓ GA Event sent:", e, t), gtag("event", e, t))
                : a < 10
                  ? setTimeout(() => n(a + 1), 100)
                  : console.warn("✗ gtag not available after retries for:", e);
        };
        n();
    }
    l &&
        l.addEventListener("submit", (e) => {
            const t = l.querySelector("button[type=submit]") || l.querySelector("button");
            t && ((t.dataset.origText = t.textContent), (t.textContent = "Odesílám..."), (t.disabled = !0));
            const n = new FormData(l),
                a = { name: n.get("name") || "", email: n.get("email") || "", message: n.get("message") || "" };
            try {
                if (navigator && "function" == typeof navigator.sendBeacon) {
                    const t = new Blob([JSON.stringify(a)], { type: "application/json" });
                    try {
                        navigator.sendBeacon("/.netlify/functions/save-message", t);
                    } catch (e) {
                        fetch("/.netlify/functions/save-message", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(a),
                            keepalive: !0,
                        }).catch(() => {});
                    }
                } else
                    fetch("/.netlify/functions/save-message", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(a),
                        keepalive: !0,
                    }).catch(() => {});
            } catch (e) {}
            setTimeout(() => {
                t &&
                    document.body.contains(t) &&
                    ((t.disabled = !1), (t.textContent = t.dataset.origText || t.textContent));
            }, 15e3);
        });
    const h = document.querySelector("form[name=kontaktni-formular]");
    h &&
        h.addEventListener("submit", () => {
            u("form_submit", { event_category: "engagement", event_label: "contact_form" });
        });
    const m = document.querySelector("#chat-send");
    m &&
        m.addEventListener("click", () => {
            u("ai_chat_used", { event_category: "engagement" });
        }),
        document.querySelectorAll('a[href*="github.com"]').forEach((e) => {
            e.addEventListener("click", () => {
                u("github_click", { event_category: "outbound" });
            });
        });
}); // --- Reveal on scroll (IntersectionObserver) ---
(function () {
    const selector = [
        ".hero__topbar",
        ".hero__brand",
        ".hero__subtitle",
        ".hero h1",
        ".karta",
        ".projekt-karta",
        ".work-item",
        ".weather-widget",
        ".github-projects",
        ".chat-modal",
        ".chat-bubble",
    ].join(", ");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
        document.querySelectorAll(selector).forEach((el) => el.classList.add("reveal", "is-visible"));
        return;
    }
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(selector).forEach((el) => el.classList.add("reveal", "is-visible"));
        return;
    }
    const obs = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("reveal")) el.classList.add("reveal");
        obs.observe(el);
    });
    const mo = new MutationObserver((muts) => {
        muts.forEach((m) => {
            m.addedNodes.forEach((n) => {
                if (n.nodeType === 1) {
                    if (n.matches && n.matches(selector)) {
                        if (!n.classList.contains("reveal")) n.classList.add("reveal");
                        obs.observe(n);
                    }
                    n.querySelectorAll &&
                        n.querySelectorAll(selector).forEach((el) => {
                            if (!el.classList.contains("reveal")) el.classList.add("reveal");
                            obs.observe(el);
                        });
                }
            });
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
})();
