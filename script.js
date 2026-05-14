const weatherEls = {
        message: document.querySelector("#weather-message"),
        cityName: document.querySelector("#weather-city-name"),
        temperature: document.querySelector("#weather-temperature"),
        description: document.querySelector("#weather-description"),
        humidity: document.querySelector("#weather-humidity"),
        wind: document.querySelector("#weather-wind"),
    },
    LANGUAGE_STORAGE_KEY = "portfolio-language",
    SUPPORTED_LANGUAGES = ["cs", "en", "es"],
    LANGUAGE_LABELS = { cs: "Čeština", en: "English", es: "Español" },
    LANGUAGE_LABELS_COMPACT = { cs: "CS", en: "EN", es: "ES" },
    MOBILE_LANGUAGE_SWITCHER_QUERY = window.matchMedia("(max-width: 760px)"),
    LANGUAGE_PACKS = {
        cs: {
            nav: { home: "Domů", projects: "Projekty a Práce", skills: "Dovednosti", cv: "Životopis", contact: "Kontakt" },
            theme: { dark: "Tmavý režim", light: "Světlý režim" },
            heroGreeting: "Vítejte!",
            chat: {
                open: "Otevřít chat",
                title: "Zeptej se mě",
                intro: "Ptej se na mé dovednosti, projekty nebo pozadí.",
                placeholder: "např. Jaké jazyky znáš?",
                send: "Poslat",
                close: "Zavřít chat",
                loading: "Načítám...",
            },
            github: {
                heading: "GitHub projekty",
                loading: "Načítám repozitáře...",
                button: "Otevřít na GitHubu",
                error: "GitHub projekty se nepodařilo načíst.",
            },
            weather: {
                title: "Počasí",
                intro: "Zadej město a načti aktuální data z OpenWeather.",
                placeholder: "Napiš město",
                button: "Vyhledat",
                prompt: "Zadej město a klikni na hledat.",
                enterCity: "Zadej název města.",
                tooLong: "Název města je příliš dlouhý.",
                invalid: "Název obsahuje nepovolené znaky.",
                notFound: "Město nebylo nalezeno.",
                apiKeyInvalid: "OpenWeather API klíč není platný nebo ještě není aktivní.",
                failed: "Počasí se nepodařilo načíst. Zkus to znovu.",
                updated: (e) => `Aktualizováno pro ${e}.`,
                labels: ["Město", "Teplota", "Popis", "Vlhkost", "Vítr"],
            },
            index: {
                title: "Vítejte!",
                subtitle: "Adam Novák – Webový Vývojář & Programátor",
                aboutTitle: "O mně",
                about: [
                    "Jsem nadšenec do webových technologií, který momentálně staví své základy na HTML a CSS. Baví mě proces, jak se z čistého kódu stává funkční stránka. Na mém GitHubu najdete mé první krůčky i komplexnější mini-projekty, na kterých se učím nejen kódovat, ale i efektivně využívat Git pro správu verzí.",
                    "Aktuálně se soustředím hlavně na dokončení mého studia a přípravu na vysokou školu.",
                    "Baví mě proces, jak se z čistého kódu stává funkční stránka. Na mém GitHubu najdete mé první krůčky i složitější mini-projekty, na kterých se učím nejen kódovat, ale i efektivně využívat Git pro správu verzí.",
                ],
                timelineTitle: "Časová osa",
                timeline: [
                    ["2014-2023", "Studium na ZŠ Český Rudolec"],
                    ["2023", "Začátek studia na SPŠ Třebíč, rozvíjení základních dovedností a znalostí v oblasti IT"],
                    ["2026", "Dlouhodobá tříměsíční stáž ve Španělsku, Sevilla"],
                    ["Budoucnost", "Maturita, pokračování studia na VŠ se zaměřením na bioinformatiku"],
                ],
                contactTitle: "Kontakt",
                contactIntro: "Ozvi se mi a probereme spolupráci, projekty nebo jakýkoli dotaz.",
                contactFields: ["Jméno", "Email", "Zpráva"],
                submit: "Odeslat",
            },
            projects: {
                title: "Projekty",
                subtitle: "Přehled projektů, na kterých jsem se podílel.",
                featuredTitle: "Vybrané Projekty",
                workTitle: "Práce",
                workSubtitle: "Věci, na kterých aktivně pracuji.",
                contactTitle: "Kontakt",
                projectCards: [
                    {
                        title: "Objednávkový formulář – Full-Stack Projekt",
                        description:
                            "Full-stack objednávkový formulář od frontendu v HTML/CSS/JS po backend v PHP a databázi MySQL.",
                    },
                    {
                        title: "3D Hra – High-to-Low Poly Asset Pipeline",
                        description:
                            "Tvorba herních 3D assetů v rámci high-to-low poly pipeline s optimalizací pro herní engine.",
                    },
                ],
                workItems: [
                    [
                        "Programování v C++ & C#",
                        "Momentálně se učím programovat v C++ a C# (OOP, algoritmy, datové struktury, datum a čas, výjimky a další).",
                    ],
                    [
                        "Mikroelektronika & Řízení Mikrokontrolérů",
                        "V rámci školního programu vyvíjím jednoduché programy pro mikrokontroléry (čtečka čipů, senzory).",
                    ],
                    ["Počítačové Sítě", "V rámci školy se věnuji také konfiguraci síťových infrastruktur."],
                    [
                        "3D Modelování v Blenderu",
                        "Snažím se rozšiřovat své dovednosti v 3D modelování se zaměřením na foto-realističnost a herní assety.",
                    ],
                    [
                        "Kybernetická bezpečnost",
                        "Součástí výuky také objevuji základy kybernetické bezpečnosti na jednoduchých sandboxových cvičeních (TryHackMe, Butca).",
                    ],
                    ["Operační systémy", "Nesmíme opomenout práci s Linuxem i Windows servery."],
                ],
            },
            skills: {
                title: "Dovednosti",
                subtitle: "Přehled technických dovedností a nástrojů, které ovládám.",
                techTitle: "Technické dovednosti",
                softTitle: "Osobní schopnosti",
                technical: [
                    "HTML a sémantika",
                    "CSS (Flexbox, Grid)",
                    "Responzivní design",
                    "JavaScript",
                    "Atmel Studio",
                    "Wireshark",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git & GitHub",
                    "Blender (3D modelování)",
                ],
                soft: [
                    "Komunikace a týmová spolupráce",
                    "Řešení problémů a debugging",
                    "Zájem o nové technologie a trendy ve vývoji",
                ],
            },
            cv: {
                title: "Životopis",
                subtitle: "Přehled studia, dovedností a vybraných zkušeností.",
                profileTitle: "Profil",
                profileText:
                    "Jsem student se zaměřením na webový vývoj, programování a technické projekty. Baví mě stavět čisté a funkční weby a zároveň si rozšiřovat záběr i do oblasti hardwaru, sítí a bezpečnosti.",
                educationTitle: "Vzdělání",
                educationItems: [
                    ["2014–2023", "Základní škola Český Rudolec"],
                    ["2023 – současnost", "SPŠ Třebíč, obor s IT zaměřením"],
                ],
                skillsTitle: "Dovednosti",
                skillsItems: [
                    "HTML, CSS, JavaScript",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git & GitHub",
                    "Blender",
                    "Základy kybernetické bezpečnosti a sítí",
                ],
                projectsTitle: "Vybrané oblasti",
                projectsItems: [
                    "Webové projekty a formuláře",
                    "3D modelování a asset pipeline",
                    "Mikrokontroléry, hardware a sítě",
                ],
                contactTitle: "Kontakt",
                contactText: "Adam Novák • novaka.07@spst.eu",
                cvButton: "Stáhnout životopis",
            },
            thanks: {
                title: "Zpráva přijata!",
                subtitle: "Brzy se ozvu s odpovědí na vaši zprávu.",
                back: "Zpět na hlavní stránku",
            },
        },
        en: {
            nav: { home: "Home", projects: "Projects & Work", skills: "Skills", cv: "CV", contact: "Contact" },
            theme: { dark: "Dark mode", light: "Light mode" },
            heroGreeting: "Welcome!",
            chat: {
                open: "Open chat",
                title: "Ask me",
                intro: "Ask about my skills, projects, or background.",
                placeholder: "e.g. What languages do you know?",
                send: "Send",
                close: "Close chat",
                loading: "Loading...",
            },
            github: {
                heading: "GitHub projects",
                loading: "Loading repositories...",
                button: "Open on GitHub",
                error: "GitHub projects could not be loaded.",
            },
            weather: {
                title: "Weather",
                intro: "Enter a city and load live data from OpenWeather.",
                placeholder: "Type a city",
                button: "Search",
                prompt: "Enter a city and click search.",
                enterCity: "Enter a city name.",
                tooLong: "The city name is too long.",
                invalid: "The name contains unsupported characters.",
                notFound: "City not found.",
                apiKeyInvalid: "The OpenWeather API key is invalid or not active yet.",
                failed: "Weather could not be loaded. Please try again.",
                updated: (e) => `Updated for ${e}.`,
                labels: ["City", "Temperature", "Description", "Humidity", "Wind"],
            },
            index: {
                title: "Welcome!",
                subtitle: "Adam Novák – Web Developer & Programmer",
                aboutTitle: "About me",
                about: [
                    "I am passionate about web technologies and am currently building my foundations on HTML and CSS. I enjoy watching clean code turn into a working page. On my GitHub you can find my first steps as well as more complex mini-projects, where I am learning not only to code but also to use Git effectively for version control.",
                    "Right now I am focusing mainly on finishing my studies and preparing for university.",
                    "I enjoy watching a page grow from plain code into something functional. On my GitHub you can find my first steps as well as more advanced mini-projects, where I am learning both coding and version control.",
                ],
                timelineTitle: "Timeline",
                timeline: [
                    ["2014-2023", "Studies at Český Rudolec elementary school"],
                    ["2023", "Started studying at SPŠ Třebíč and developed core IT skills"],
                    ["2026", "A three-month internship in Seville, Spain"],
                    ["Future", "Graduation and continued study at university with a focus on bioinformatics"],
                ],
                contactTitle: "Contact",
                contactIntro: "Reach out and we can discuss collaboration, projects, or any question.",
                contactFields: ["Name", "Email", "Message"],
                submit: "Send",
            },
            projects: {
                title: "Projects",
                subtitle: "An overview of the projects I have contributed to.",
                featuredTitle: "Selected Projects",
                workTitle: "Work",
                workSubtitle: "Things I am actively working on.",
                contactTitle: "Contact",
                projectCards: [
                    {
                        title: "Order Form – Full-Stack Project",
                        description:
                            "A full-stack order form from an HTML/CSS/JS frontend to a PHP backend and MySQL database.",
                    },
                    {
                        title: "3D Game – High-to-Low Poly Asset Pipeline",
                        description:
                            "Creating game-ready 3D assets with a high-to-low poly workflow and engine-friendly optimization.",
                    },
                ],
                workItems: [
                    [
                        "Programming in C++ & C#",
                        "I am currently learning C++ and C# (OOP, algorithms, data structures, dates and time, exceptions, and more).",
                    ],
                    [
                        "Microelectronics & Microcontroller Control",
                        "As part of school work I build simple microcontroller programs (chip reader, sensors).",
                    ],
                    ["Computer Networks", "At school I also work on configuring network infrastructure."],
                    [
                        "3D Modeling in Blender",
                        "I am expanding my 3D modeling skills with a focus on photorealism and game assets.",
                    ],
                    [
                        "Cybersecurity",
                        "I am also exploring cybersecurity basics through simple sandbox exercises (TryHackMe, Butca).",
                    ],
                    ["Operating Systems", "We also work with Linux and Windows Server systems."],
                ],
            },
            skills: {
                title: "Skills",
                subtitle: "An overview of the technical skills and tools I use.",
                techTitle: "Technical skills",
                softTitle: "Personal skills",
                technical: [
                    "HTML and semantics",
                    "CSS (Flexbox, Grid)",
                    "Responsive design",
                    "JavaScript",
                    "Atmel Studio",
                    "Wireshark",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git & GitHub",
                    "Blender (3D modeling)",
                ],
                soft: [
                    "Communication and teamwork",
                    "Problem solving and debugging",
                    "Interest in new technologies and development trends",
                ],
            },
            cv: {
                title: "CV",
                subtitle: "A summary of my studies, skills, and selected experience.",
                profileTitle: "Profile",
                profileText:
                    "I am a student focused on web development, programming, and technical projects. I enjoy building clean and functional websites while expanding into hardware, networking, and security.",
                educationTitle: "Education",
                educationItems: [
                    ["2014–2023", "Český Rudolec elementary school"],
                    ["2023 – present", "SPŠ Třebíč, IT-oriented program"],
                ],
                skillsTitle: "Skills",
                skillsItems: [
                    "HTML, CSS, JavaScript",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git & GitHub",
                    "Blender",
                    "Basics of cybersecurity and networking",
                ],
                projectsTitle: "Selected areas",
                projectsItems: [
                    "Web projects and forms",
                    "3D modeling and asset pipeline",
                    "Microcontrollers, hardware, and networks",
                ],
                contactTitle: "Contact",
                contactText: "Adam Novák • novaka.07@spst.eu",
                cvButton: "Download CV",
            },
            thanks: {
                title: "Message received!",
                subtitle: "I will get back to you soon with a reply to your message.",
                back: "Back to the homepage",
            },
        },
        es: {
            nav: { home: "Inicio", projects: "Proyectos y trabajo", skills: "Habilidades", cv: "CV", contact: "Contacto" },
            theme: { dark: "Modo oscuro", light: "Modo claro" },
            heroGreeting: "¡Bienvenido!",
            chat: {
                open: "Abrir chat",
                title: "Pregúntame",
                intro: "Pregunta por mis habilidades, proyectos o experiencia.",
                placeholder: "p. ej. ¿Qué idiomas hablas?",
                send: "Enviar",
                close: "Cerrar chat",
                loading: "Cargando...",
            },
            github: {
                heading: "Proyectos en GitHub",
                loading: "Cargando repositorios...",
                button: "Abrir en GitHub",
                error: "No se pudieron cargar los proyectos de GitHub.",
            },
            weather: {
                title: "Clima",
                intro: "Escribe una ciudad y carga datos en vivo de OpenWeather.",
                placeholder: "Escribe una ciudad",
                button: "Buscar",
                prompt: "Escribe una ciudad y pulsa buscar.",
                enterCity: "Escribe el nombre de una ciudad.",
                tooLong: "El nombre de la ciudad es demasiado largo.",
                invalid: "El nombre contiene caracteres no permitidos.",
                notFound: "No se encontró la ciudad.",
                apiKeyInvalid: "La clave de OpenWeather no es válida o aún no está activa.",
                failed: "No se pudo cargar el clima. Inténtalo de nuevo.",
                updated: (e) => `Actualizado para ${e}.`,
                labels: ["Ciudad", "Temperatura", "Descripción", "Humedad", "Viento"],
            },
            index: {
                title: "¡Bienvenido!",
                subtitle: "Adam Novák – Desarrollador web y programador",
                aboutTitle: "Sobre mí",
                about: [
                    "Me apasionan las tecnologías web y actualmente estoy construyendo mis bases con HTML y CSS. Disfruto ver cómo un código limpio se convierte en una página funcional. En mi GitHub encontrarás mis primeros pasos y mini proyectos más complejos, donde aprendo no solo a programar sino también a usar Git de forma eficaz para el control de versiones.",
                    "Ahora mismo me estoy centrando sobre todo en terminar mis estudios y prepararme para la universidad.",
                    "Disfruto ver cómo una página crece desde un código simple hasta algo funcional. En mi GitHub encontrarás mis primeros pasos y mini proyectos más avanzados, donde aprendo tanto programación como control de versiones.",
                ],
                timelineTitle: "Cronología",
                timeline: [
                    ["2014-2023", "Estudios en la escuela primaria de Český Rudolec"],
                    ["2023", "Comienzo de estudios en SPŠ Třebíč y desarrollo de habilidades IT básicas"],
                    ["2026", "Pasantía de tres meses en Sevilla, España"],
                    ["Futuro", "Graduación y continuación de estudios universitarios con enfoque en bioinformática"],
                ],
                contactTitle: "Contacto",
                contactIntro: "Escríbeme y hablaremos de colaboración, proyectos o cualquier consulta.",
                contactFields: ["Nombre", "Correo electrónico", "Mensaje"],
                submit: "Enviar",
            },
            projects: {
                title: "Proyectos",
                subtitle: "Un resumen de los proyectos en los que he participado.",
                featuredTitle: "Proyectos destacados",
                workTitle: "Trabajo",
                workSubtitle: "Cosas en las que estoy trabajando activamente.",
                contactTitle: "Contacto",
                projectCards: [
                    {
                        title: "Formulario de pedido – proyecto full-stack",
                        description:
                            "Un formulario de pedido full-stack desde el frontend en HTML/CSS/JS hasta el backend en PHP y la base de datos MySQL.",
                    },
                    {
                        title: "Juego 3D – flujo de assets high-to-low poly",
                        description:
                            "Creación de assets 3D para videojuegos con un flujo high-to-low poly y optimización para el motor.",
                    },
                ],
                workItems: [
                    [
                        "Programación en C++ y C#",
                        "Actualmente estoy aprendiendo C++ y C# (POO, algoritmos, estructuras de datos, fechas y horas, excepciones y más).",
                    ],
                    [
                        "Microelectrónica y control de microcontroladores",
                        "En el ámbito escolar desarrollo programas sencillos para microcontroladores (lector de chips, sensores).",
                    ],
                    [
                        "Redes informáticas",
                        "En la escuela también trabajo con la configuración de infraestructuras de red.",
                    ],
                    [
                        "Modelado 3D en Blender",
                        "Estoy ampliando mis habilidades de modelado 3D con enfoque en fotorrealismo y assets para videojuegos.",
                    ],
                    [
                        "Ciberseguridad",
                        "También estoy explorando los fundamentos de ciberseguridad con ejercicios sandbox simples (TryHackMe, Butca).",
                    ],
                    ["Sistemas operativos", "También trabajamos con Linux y Windows Server."],
                ],
            },
            skills: {
                title: "Habilidades",
                subtitle: "Resumen de las habilidades técnicas y herramientas que utilizo.",
                techTitle: "Habilidades técnicas",
                softTitle: "Habilidades personales",
                technical: [
                    "HTML y semántica",
                    "CSS (Flexbox, Grid)",
                    "Diseño adaptable",
                    "JavaScript",
                    "Atmel Studio",
                    "Wireshark",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git y GitHub",
                    "Blender (modelado 3D)",
                ],
                soft: [
                    "Comunicación y trabajo en equipo",
                    "Resolución de problemas y debugging",
                    "Interés por nuevas tecnologías y tendencias de desarrollo",
                ],
            },
            cv: {
                title: "CV",
                subtitle: "Resumen de mis estudios, habilidades y experiencia seleccionada.",
                profileTitle: "Perfil",
                profileText:
                    "Soy un estudiante centrado en desarrollo web, programación y proyectos técnicos. Me gusta construir sitios limpios y funcionales mientras amplío mis conocimientos en hardware, redes y seguridad.",
                educationTitle: "Educación",
                educationItems: [
                    ["2014–2023", "Escuela primaria Český Rudolec"],
                    ["2023 – presente", "SPŠ Třebíč, programa orientado a IT"],
                ],
                skillsTitle: "Habilidades",
                skillsItems: [
                    "HTML, CSS, JavaScript",
                    "C++ / C#",
                    "MySQL / SQL",
                    "Git y GitHub",
                    "Blender",
                    "Bases de ciberseguridad y redes",
                ],
                projectsTitle: "Áreas destacadas",
                projectsItems: [
                    "Proyectos web y formularios",
                    "Modelado 3D y pipeline de assets",
                    "Microcontroladores, hardware y redes",
                ],
                contactTitle: "Contacto",
                contactText: "Adam Novák • novaka.07@spst.eu",
                cvButton: "Descargar CV",
            },
            thanks: {
                title: "¡Mensaje recibido!",
                subtitle: "Me pondré en contacto contigo pronto con una respuesta a tu mensaje.",
                back: "Volver a la página principal",
            },
        },
    };
let currentLanguage = "cs";
function getLanguagePack(e = currentLanguage) {
    return LANGUAGE_PACKS[e] || LANGUAGE_PACKS.cs;
}
function readStoredLanguage() {
    try {
        const e = localStorage.getItem("portfolio-language");
        return SUPPORTED_LANGUAGES.includes(e) ? e : null;
    } catch (e) {
        return null;
    }
}
function detectBrowserLanguage() {
    return (
        [...(navigator.languages || []), navigator.language || ""]
            .map((e) => String(e || "").toLowerCase())
            .map((e) => e.slice(0, 2))
            .find((e) => SUPPORTED_LANGUAGES.includes(e)) || "cs"
    );
}
function saveLanguage(e) {
    try {
        localStorage.setItem("portfolio-language", e);
    } catch (e) {}
}
function getCurrentPageKey() {
    return document.body.classList.contains("thank-you-page")
        ? "thanks"
                : document.body.classList.contains("cv-page")
                    ? "cv"
        : document.querySelector(".skills-list")
          ? "skills"
          : document.querySelector(".projekty-grid")
            ? "projects"
            : document.querySelector("#weather")
              ? "index"
              : "generic";
}
function setThemeToggleLabel() {
    const e = document.querySelector("[data-theme-toggle]");
    if (!e) return;
    const t = getLanguagePack();
    e.textContent = document.body.classList.contains("dark-mode") ? t.theme.light : t.theme.dark;
}
function setNavigationLabels() {
    const e = document.querySelector(".hero__topbar nav");
    if (!e) return;
    const t = getLanguagePack(),
        o = Array.from(e.querySelectorAll("a")),
        a = (target) =>
            o.find((link) => {
                const raw = link.getAttribute("href") || "";
                try {
                    const abs = link.href || "";
                    return (
                        raw === target ||
                        raw === `/${target}` ||
                        raw.endsWith(target) ||
                        abs.endsWith(target) ||
                        (target.includes("#") && raw === target.split("#")[1] ? `#${raw}` === target : false)
                    );
                } catch (e) {
                    return raw === target || raw.endsWith(target);
                }
            });

    (a("index.html") || a("/")) && ((a("index.html") || a("/")).textContent = t.nav.home),
        a("projekty.html") && (a("projekty.html").textContent = t.nav.projects),
        a("dovednosti.html") && (a("dovednosti.html").textContent = t.nav.skills),
        a("zivotopis.html") && (a("zivotopis.html").textContent = t.nav.cv),
        (a("index.html#kontakt") || a("#kontakt") || a("index.html#kontakt")) &&
            ((a("index.html#kontakt") || a("#kontakt") || a("index.html#kontakt")).textContent = t.nav.contact),
        setThemeToggleLabel();
}
function setTextIfExists(e, t) {
    const o = document.querySelector(e);
    o && (o.textContent = t);
}
function setTimelineItems(e) {
    document.querySelectorAll(".study-timeline__list li").forEach((t, o) => {
        const a = e[o];
        a && (t.innerHTML = `<span>${a[0]}</span>${a[1]}`);
    });
}
function setWeatherTexts() {
    const e = getLanguagePack();
    setTextIfExists("#weather h2", e.weather.title);
    const t = document.querySelector(".weather-widget__intro p");
    t && (t.textContent = e.weather.intro);
    const o = document.querySelector("#weather-city-input");
    o && (o.placeholder = e.weather.placeholder);
    const a = document.querySelector("[data-weather-search]");
    a && (a.textContent = e.weather.button),
        weatherEls.message &&
            !weatherEls.message.dataset.customWeatherMessage &&
            (weatherEls.message.textContent = e.weather.prompt),
        document.querySelectorAll(".weather-card__item dt").forEach((t, o) => {
            void 0 !== e.weather.labels[o] && (t.textContent = e.weather.labels[o]);
        });
}
function setChatTexts() {
    const e = getLanguagePack(),
        t = document.querySelector("#chat-bubble");
    t && t.setAttribute("aria-label", e.chat.open);
    const o = document.querySelector(".chat-modal__header h2");
    o && (o.textContent = e.chat.title);
    const a = document.querySelector("#chat-close");
    a && a.setAttribute("aria-label", e.chat.close);
    const n = document.querySelector(".chat-modal__intro");
    n && (n.textContent = e.chat.intro);
    const r = document.querySelector("#chat-input");
    r && (r.placeholder = e.chat.placeholder);
    const s = document.querySelector("#chat-send");
    s && (s.textContent = e.chat.send);
}
function setLanguageSwitcherState(e) {
    document.querySelectorAll("[data-language-option]").forEach((t) => {
        const o = t.dataset.languageOption === e;
        t.classList.toggle("is-active", o), t.setAttribute("aria-pressed", o ? "true" : "false");
    });
}
function getLanguageSwitcherLabel(e) {
    return MOBILE_LANGUAGE_SWITCHER_QUERY.matches ? LANGUAGE_LABELS_COMPACT[e] || LANGUAGE_LABELS[e] : LANGUAGE_LABELS[e];
}
function updateLanguageSwitcherLabels() {
    document.querySelectorAll("[data-language-option]").forEach((e) => {
        const t = e.dataset.languageOption;
        t && (e.textContent = getLanguageSwitcherLabel(t));
    });
}
function buildLanguageSwitcher() {
    if (document.querySelector("[data-language-switcher]")) return;
    const e = document.createElement("div");
    (e.className = "language-switcher"),
        e.setAttribute("data-language-switcher", ""),
        e.setAttribute("aria-label", "Výběr jazyka"),
        SUPPORTED_LANGUAGES.forEach((t) => {
            const o = document.createElement("button");
            (o.type = "button"),
                (o.className = "language-switcher__button"),
                (o.dataset.languageOption = t),
                (o.textContent = getLanguageSwitcherLabel(t)),
                o.setAttribute("aria-pressed", "false"),
                o.addEventListener("click", () => applyLanguage(t)),
                e.appendChild(o);
        });
    (document.querySelector(".hero__topbar") || document.body).appendChild(e);
}
function greetVisitor() {
    const e = document.querySelector("h1.typewriter");
    e && (e.textContent = getLanguagePack().heroGreeting);
}
function applyLanguage(e) {
    (currentLanguage = SUPPORTED_LANGUAGES.includes(e) ? e : "cs"),
        saveLanguage(currentLanguage),
        buildLanguageSwitcher(),
        (document.documentElement.lang = currentLanguage),
        (document.documentElement.dataset.language = currentLanguage),
        setNavigationLabels(),
        setChatTexts(),
        setWeatherTexts(),
        setLanguageSwitcherState(currentLanguage),
        updateLanguageSwitcherLabels();
    const t = getCurrentPageKey(),
        o = getLanguagePack();
    if ("index" === t) {
        setTextIfExists("h1.typewriter", o.index.title),
            setTextIfExists(".hero__subtitle", o.index.subtitle),
            setTextIfExists("#o-mne h2", o.index.aboutTitle),
            document.querySelectorAll("#o-mne > div p").forEach((e, t) => {
                void 0 !== o.index.about[t] && (e.textContent = o.index.about[t]);
            }),
            setTextIfExists(".study-timeline h2", o.index.timelineTitle),
            setTimelineItems(o.index.timeline),
            setTextIfExists("#kontakt h2", o.index.contactTitle),
            setTextIfExists("#kontakt > p", o.index.contactIntro),
            document.querySelectorAll(".contact-form__field label").forEach((e, t) => {
                void 0 !== o.index.contactFields[t] && (e.textContent = o.index.contactFields[t]);
            });
        const e = document.querySelector('.contact-submit-btn span');
        e && (e.textContent = o.index.submit);
    } else if ("projects" === t) {
        setTextIfExists(".hero h1", o.projects.title), setTextIfExists(".work-section-title", o.projects.workTitle);
        const t = document.querySelectorAll(".hero__subtitle");
        t[0] && (t[0].textContent = o.projects.subtitle), t[1] && (t[1].textContent = o.projects.workSubtitle);
        const a = document.querySelectorAll(".karta h2");
        a[0] && (a[0].textContent = o.projects.featuredTitle),
            a[1] && (a[1].textContent = o.projects.contactTitle),
            document.querySelectorAll(".projekt-karta article h3").forEach((e, t) => {
                o.projects.projectCards[t] && (e.textContent = o.projects.projectCards[t].title);
            }),
            document.querySelectorAll(".projekt-karta .projekt-popis").forEach((e, t) => {
                o.projects.projectCards[t] && (e.textContent = o.projects.projectCards[t].description);
            }),
            document.querySelectorAll(".work-item h3").forEach((e, t) => {
                o.projects.workItems[t] && (e.textContent = o.projects.workItems[t][0]);
            }),
            document.querySelectorAll(".work-item .work-text").forEach((e, t) => {
                o.projects.workItems[t] && (e.textContent = o.projects.workItems[t][1]);
            });
    } else if ("skills" === t) {
        setTextIfExists("h1", o.skills.title), setTextIfExists(".hero__subtitle", o.skills.subtitle);
        const e = document.querySelectorAll(".karta h2");
        e[0] && (e[0].textContent = o.skills.techTitle),
            e[1] && (e[1].textContent = o.skills.softTitle),
            document.querySelectorAll(".skills-list .skill").forEach((e, t) => {
                o.skills.technical[t] && (e.textContent = o.skills.technical[t]);
            }),
            document.querySelectorAll(".karta ul li").forEach((e, t) => {
                o.skills.soft[t] && (e.textContent = o.skills.soft[t]);
            });
    } else if ("cv" === t) {
        setTextIfExists("h1", o.cv.title), setTextIfExists(".hero__subtitle", o.cv.subtitle);
        setTextIfExists("#cv-profile h2", o.cv.profileTitle);
        setTextIfExists("#cv-profile p", o.cv.profileText);
        setTextIfExists("#cv-education h2", o.cv.educationTitle);
        document.querySelectorAll("#cv-education .cv-list li").forEach((e, t) => {
            o.cv.educationItems[t] && (e.innerHTML = `<span>${o.cv.educationItems[t][0]}</span>${o.cv.educationItems[t][1]}`);
        });
        setTextIfExists("#cv-skills h2", o.cv.skillsTitle);
        document.querySelectorAll("#cv-skills .cv-list li").forEach((e, t) => {
            o.cv.skillsItems[t] && (e.textContent = o.cv.skillsItems[t]);
        });
        setTextIfExists("#cv-projects h2", o.cv.projectsTitle);
        document.querySelectorAll("#cv-projects .cv-list li").forEach((e, t) => {
            o.cv.projectsItems[t] && (e.textContent = o.cv.projectsItems[t]);
        });
        setTextIfExists("#cv-contact h2", o.cv.contactTitle);
        setTextIfExists("#cv-contact p", o.cv.contactText);
        const tBtn = document.querySelector("#cv-download");
        tBtn && (tBtn.textContent = o.cv.cvButton);
    } else if ("thanks" === t) {
        setTextIfExists("h1", o.thanks.title), setTextIfExists(".hero__subtitle", o.thanks.subtitle);
        const e = document.querySelector(".back-link");
        e && (e.textContent = o.thanks.back);
    }
    const a = {
        index: {
            cs: "Adam Novák | Portfolio – Webový Vývojář & Programátor",
            en: "Adam Novák | Portfolio – Web Developer & Programmer",
            es: "Adam Novák | Portfolio – Desarrollador web y programador",
        },
        projects: {
            cs: "Projekty & Práce | Adam Novák",
            en: "Projects & Work | Adam Novák",
            es: "Proyectos y trabajo | Adam Novák",
        },
        skills: { cs: "Dovednosti | Adam Novák", en: "Skills | Adam Novák", es: "Habilidades | Adam Novák" },
        cv: { cs: "Životopis | Adam Novák", en: "CV | Adam Novák", es: "CV | Adam Novák" },
        thanks: { cs: "Zpráva přijata!", en: "Message received!", es: "¡Mensaje recibido!" },
    };
    a[t] && (document.title = a[t][currentLanguage] || a[t].cs), greetVisitor();
}
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
    weatherEls.message &&
        ((weatherEls.message.textContent = e), (weatherEls.message.dataset.customWeatherMessage = "1"));
}
function extractRetrySeconds(e) {
    if (!e) return null;
    const t = String(e).match(/retry in\s*(\d+\.?\d*)s/i) || String(e).match(/retryDelay\"?\s*:\s*\"?(\d+)s/i);
    return t ? Math.ceil(parseFloat(t[1])) : null;
}
function disableSendFor(e) {
    const t = document.querySelector("#chat-send"),
        o = document.querySelector("#chat-input");
    if (!t) return;
    let a = e;
    (chatCooldownUntil = Date.now() + 1e3 * e),
        chatCooldownTimer && clearInterval(chatCooldownTimer),
        (t.disabled = !0);
    const n = t.textContent;
    chatCooldownTimer = setInterval(() => {
        if (a <= 0)
            return (
                clearInterval(chatCooldownTimer),
                (chatCooldownTimer = null),
                (chatCooldownUntil = 0),
                (t.disabled = !1),
                (t.textContent = n),
                void (o && o.focus())
            );
        (t.textContent = `${n} (${a}s)`), (a -= 1);
    }, 1e3);
}
function buildRepoCard(e) {
    const t = document.createElement("article");
    t.className = "github-project-card";
    const o = document.createElement("h3");
    if (
        ((o.className = "github-project-card__title"), (o.textContent = e.name), t.appendChild(o), null !== e.language)
    ) {
        const o = document.createElement("span");
        (o.className = "github-project-card__badge"),
            (o.textContent = e.language),
            (o.style.backgroundColor = "#e0a35f"),
            t.appendChild(o);
    }
    const a = document.createElement("p");
    (a.className = "github-project-card__description"),
        (a.textContent = e.description ? e.description : "Bez popisu."),
        t.appendChild(a);
    const n = document.createElement("a");
    (n.className = "btn-github"),
        (n.href = e.html_url),
        (n.target = "_blank"),
        (n.rel = "noopener noreferrer"),
        (n.setAttribute("aria-label", getLanguagePack().github.button + " - " + e.name)),
        (n.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99992 1.33331C7.12444 1.33331 6.25753 1.50575 5.4487 1.84078C4.63986 2.17581 3.90493 2.66688 3.28587 3.28593C2.03563 4.53618 1.33325 6.23187 1.33325 7.99998C1.33325 10.9466 3.24659 13.4466 5.89325 14.3333C6.22659 14.3866 6.33325 14.18 6.33325 14C6.33325 13.8466 6.33325 13.4266 6.33325 12.8733C4.48659 13.2733 4.09325 11.98 4.09325 11.98C3.78659 11.2066 3.35325 11 3.35325 11C2.74659 10.5866 3.39992 10.6 3.39992 10.6C4.06659 10.6466 4.41992 11.2866 4.41992 11.2866C4.99992 12.3 5.97992 12 6.35992 11.84C6.41992 11.4066 6.59325 11.1133 6.77992 10.9466C5.29992 10.78 3.74659 10.2066 3.74659 7.66665C3.74659 6.92665 3.99992 6.33331 4.43325 5.85998C4.36659 5.69331 4.13325 4.99998 4.49992 4.09998C4.49992 4.09998 5.05992 3.91998 6.33325 4.77998C6.85992 4.63331 7.43325 4.55998 7.99992 4.55998C8.56659 4.55998 9.13992 4.63331 9.66659 4.77998C10.9399 3.91998 11.4999 4.09998 11.4999 4.09998C11.8666 4.99998 11.6333 5.69331 11.5666 5.85998C11.9999 6.33331 12.2533 6.92665 12.2533 7.66665C12.2533 10.2133 10.6933 10.7733 9.20659 10.94C9.44659 11.1466 9.66659 11.5533 9.66659 12.1733C9.66659 13.0666 9.66659 13.7866 9.66659 14C9.66659 14.18 9.77325 14.3933 10.1133 14.3333C12.7599 13.44 14.6666 10.9466 14.6666 7.99998C14.6666 7.1245 14.4941 6.25759 14.1591 5.44876C13.8241 4.63992 13.333 3.90499 12.714 3.28593C12.0949 2.66688 11.36 2.17581 10.5511 1.84078C9.7423 1.50575 8.8754 1.33331 7.99992 1.33331V1.33331Z" fill="currentcolor"></path>
            </svg>
            <span>${getLanguagePack().github.button}</span>
        `),
        t.appendChild(n);
    return t;
}
async function loadGitHubProjects(e) {
    const t = document.querySelector("#projects");
    if (!t) return;
    t.replaceChildren();
    const o = document.createElement("h2");
    (o.id = "github-projects-heading"), (o.textContent = getLanguagePack().github.heading), t.appendChild(o);
    const a = document.createElement("p");
    (a.className = "github-projects__message"), (a.textContent = getLanguagePack().github.loading), t.appendChild(a);
    try {
        const o = await fetch(
            `https://api.github.com/users/${encodeURIComponent(e)}/repos?sort=updated&per_page=100&direction=desc`
        );
        if (!o.ok) throw new Error(`GitHub API chyba: ${o.status}`);
        const n = await o.json(),
            r = document.createElement("div");
        (r.className = "github-projects__grid"),
            n.forEach((e) => {
                r.appendChild(buildRepoCard(e));
            }),
            a.remove(),
            t.appendChild(r);
    } catch (e) {
        console.error("Nepodařilo se načíst GitHub projekty:", e), (a.textContent = getLanguagePack().github.error);
    }
}
async function loadWeather(e) {
    const t = e.trim(),
        o = getLanguagePack();
    if (!t) return clearWeatherCard(), void showWeatherMessage(o.weather.enterCity);
    if (t.length > 100) return clearWeatherCard(), void showWeatherMessage(o.weather.tooLong);
    if (!/^[\p{L}\p{N}\s'.-]+$/u.test(t)) return clearWeatherCard(), void showWeatherMessage(o.weather.invalid);
    try {
        const e = await fetch(
            `/.netlify/functions/weather?city=${encodeURIComponent(t)}&lang=${encodeURIComponent(currentLanguage)}`
        );
        if (!e.ok) {
            if (404 === e.status) throw new Error(o.weather.notFound);
            if (401 === e.status) throw new Error(o.weather.apiKeyInvalid);
            throw new Error(`HTTP chyba: ${e.status}`);
        }
        const a = await e.json(),
            n = a.name ? `${a.name}${a.sys?.country ? `, ${a.sys.country}` : ""}` : t,
            r = Math.round(10 * a.main.temp) / 10;
        weatherEls.cityName && (weatherEls.cityName.textContent = n),
            weatherEls.temperature && (weatherEls.temperature.textContent = `${r} °C`),
            weatherEls.description &&
                (weatherEls.description.textContent = a.weather?.[0]?.description ?? "Bez popisu"),
            weatherEls.humidity && (weatherEls.humidity.textContent = `${a.main.humidity} %`),
            weatherEls.wind && (weatherEls.wind.textContent = `${a.wind.speed} m/s`),
            showWeatherMessage(o.weather.updated(n));
    } catch (e) {
        console.error("Chyba počasí:", e),
            clearWeatherCard(),
            showWeatherMessage(e.message || getLanguagePack().weather.failed);
    }
}
async function sendChatMessage(e) {
    const t = document.querySelector("#chat-response"),
        o = document.querySelector("#chat-input"),
        a = document.querySelector("#chat-send");
    if (!(Date.now() < chatCooldownUntil) && e.trim() && !a.disabled) {
        const n = getLanguagePack();
        (a.disabled = !0), (t.textContent = n.chat.loading), (t.className = "chat-response loading");
        try {
            const a = await fetch("/.netlify/functions/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: e.trim() }),
                }),
                n = await a.text();
            let r = {};
            if (n)
                try {
                    r = JSON.parse(n);
                } catch (e) {
                    r = { error: n };
                }
            if (!a.ok) {
                if (404 === a.status)
                    throw new Error(
                        "Chat function nebyla na této doméně nalezena. Znovu musíš spustit netlify site s funkcí chat."
                    );
                if (429 === a.status) {
                    const e = r.retryAfter || extractRetrySeconds(r.details) || extractRetrySeconds(r.error) || null;
                    let o = "Příliš mnoho požadavků. Počkej chvíli a zkus to znovu.";
                    return (
                        e && !isNaN(parseInt(e)) && (o = `Příliš mnoho požadavků. Počkej ${parseInt(e)} s.`),
                        (t.textContent = o),
                        (t.className = "chat-response error"),
                        void (e && !isNaN(parseInt(e)) && disableSendFor(Math.min(600, parseInt(e))))
                    );
                }
                throw new Error(r.error || `Chyba ${a.status}`);
            }
            (t.textContent = r.reply || "Chyba."), (t.className = "chat-response"), (o.value = ""), o.focus();
        } catch (e) {
            (t.textContent = e.message), (t.className = "chat-response error");
        } finally {
            Date.now() >= chatCooldownUntil && (a.disabled = !1);
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    (currentLanguage = readStoredLanguage() || detectBrowserLanguage()),
        applyLanguage(currentLanguage),
        loadGitHubProjects("adamos962"),
        "undefined" != typeof gtag
            ? console.log("✓ Google Analytics loaded successfully")
            : console.warn("⚠ Google Analytics script not yet available on DOMContentLoaded");
    const e = document.querySelector("[data-weather-search]"),
        t = document.querySelector("#weather-city-input"),
        o = document.querySelector("[data-theme-toggle]");
    e && t && (clearWeatherCard(), e.addEventListener("click", () => loadWeather(t.value)));
    MOBILE_LANGUAGE_SWITCHER_QUERY.addEventListener
        ? MOBILE_LANGUAGE_SWITCHER_QUERY.addEventListener("change", updateLanguageSwitcherLabels)
        : MOBILE_LANGUAGE_SWITCHER_QUERY.addListener(updateLanguageSwitcherLabels);
    window.addEventListener("resize", updateLanguageSwitcherLabels);
    const a = document.querySelector("#chat-bubble"),
        n = document.querySelector("#chat-modal"),
        r = document.querySelector("#chat-close"),
        s = document.querySelector("#chat-send"),
        i = document.querySelector("#chat-input");
    a &&
        a.addEventListener("click", (e) => {
            e.stopPropagation(), n.removeAttribute("hidden"), a.setAttribute("aria-expanded", "true"), i?.focus();
        }),
        r &&
            r.addEventListener("click", (e) => {
                e.stopPropagation(), n.setAttribute("hidden", ""), a.setAttribute("aria-expanded", "false");
            }),
        document.addEventListener("keydown", (e) => {
            "Escape" === e.key && (n.setAttribute("hidden", ""), a?.setAttribute("aria-expanded", "false"));
        }),
        s && s.addEventListener("click", () => sendChatMessage(i?.value)),
        i &&
            i.addEventListener("keypress", (e) => {
                "Enter" === e.key && sendChatMessage(i.value);
            });
    const c = (function () {
        try {
            return localStorage.getItem("theme");
        } catch (e) {
            return null;
        }
    })();
    var l;
    c && ((l = c), document.body.classList.toggle("dark-mode", "dark" === l)),
        o &&
            o.addEventListener("click", function () {
                const e = document.body.classList.toggle("dark-mode");
                try {
                    localStorage.setItem("theme", e ? "dark" : "light");
                } catch (e) {}
                setThemeToggleLabel();
            });
    const d = document.querySelector("form[name=kontaktni-formular]");
    function u(e, t = {}) {
        const o = (a = 0) => {
            "undefined" != typeof gtag
                ? (console.log("✓ GA Event sent:", e, t), gtag("event", e, t))
                : a < 10
                  ? setTimeout(() => o(a + 1), 100)
                  : console.warn("✗ gtag not available after retries for:", e);
        };
        o();
    }
    d &&
        d.addEventListener("submit", (e) => {
            const t = d.querySelector("button[type=submit]") || d.querySelector("button");
            t && ((t.dataset.origText = t.textContent), (t.textContent = "Odesílám..."), (t.disabled = !0));
            const o = new FormData(d),
                a = { name: o.get("name") || "", email: o.get("email") || "", message: o.get("message") || "" };
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
    const m = document.querySelector("form[name=kontaktni-formular]");
    m &&
        m.addEventListener("submit", () => {
            u("form_submit", { event_category: "engagement", event_label: "contact_form" });
        });
    const h = document.querySelector("#chat-send");
    h &&
        h.addEventListener("click", () => {
            u("ai_chat_used", { event_category: "engagement" });
        }),
        document.querySelectorAll('a[href*="github.com"]').forEach((e) => {
            e.addEventListener("click", () => {
                u("github_click", { event_category: "outbound" });
            });
        });
}),
    (function () {
        const e = [
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
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return void document.querySelectorAll(e).forEach((e) => e.classList.add("reveal", "is-visible"));
        if (!("IntersectionObserver" in window))
            return void document.querySelectorAll(e).forEach((e) => e.classList.add("reveal", "is-visible"));
        const t = new IntersectionObserver(
            (e, t) => {
                e.forEach((e) => {
                    e.isIntersecting && (e.target.classList.add("is-visible"), t.unobserve(e.target));
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );
        document.querySelectorAll(e).forEach((e) => {
            e.classList.contains("reveal") || e.classList.add("reveal"), t.observe(e);
        });
        new MutationObserver((o) => {
            o.forEach((o) => {
                o.addedNodes.forEach((o) => {
                    1 === o.nodeType &&
                        (o.matches &&
                            o.matches(e) &&
                            (o.classList.contains("reveal") || o.classList.add("reveal"), t.observe(o)),
                        o.querySelectorAll &&
                            o.querySelectorAll(e).forEach((e) => {
                                e.classList.contains("reveal") || e.classList.add("reveal"), t.observe(e);
                            }));
                });
            });
        }).observe(document.body, { childList: !0, subtree: !0 });
    })();
