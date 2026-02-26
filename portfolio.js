"use strict";
const navLinks = document.querySelectorAll("header .nav a[data-section]");
const sections = document.querySelectorAll("section[id]");
function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
navLinks.forEach((link) => {
    const targetId = link.dataset.section;
    if (!targetId)
        return;
    link.addEventListener("click", (event) => {
        event.preventDefault();
        smoothScrollTo(targetId);
    });
});
// Reveal sections on scroll + highlight nav
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const id = entry.target.id;
        const correspondingLink = document.querySelector(`header .nav a[data-section="${id}"]`);
        if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            entry.target.classList.remove("section-hidden");
            if (correspondingLink) {
                navLinks.forEach((l) => l.classList.remove("active"));
                correspondingLink.classList.add("active");
            }
        }
    });
}, {
    threshold: 0.35,
});
sections.forEach((section) => {
    section.classList.add("section-hidden");
    observer.observe(section);
});
// Theme toggle (light / dark)
const themeToggleButton = document.querySelector("#theme-toggle");
const root = document.documentElement;
const THEME_KEY = "ds-theme";
function applyTheme(theme) {
    if (theme === "light") {
        root.classList.add("theme-light");
    }
    else {
        root.classList.remove("theme-light");
    }
    localStorage.setItem(THEME_KEY, theme);
}
function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    applyTheme(initial);
}
if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
        const isLight = root.classList.contains("theme-light");
        applyTheme(isLight ? "dark" : "light");
    });
}
initTheme();
const projects = [
    {
        id: "nova",
        name: "NOVA",
        description: "Smart learning platform connecting teachers and students with role-based access, group chat, schedules, and more.",
        language: "TypeScript",
        tags: ["Web App", "Role-Based Access", "Chat", "Scheduling"],
        githubUrl: "https://github.com/dura-s/NOVA",
        demoUrl: "https://dura-s.github.io/NOVA/",
        featured: true,
        details: [
            "Role-based dashboards for teachers and students",
            "Group chat + productivity features",
            "Designed for clarity and fast navigation",
        ],
    },
    {
        id: "women-security",
        name: "women-security",
        description: "TypeScript project focused on women’s security — built as a learning project with a real-world purpose.",
        language: "TypeScript",
        tags: ["TypeScript", "Safety", "Web"],
        githubUrl: "https://github.com/dura-s/women-security",
        demoUrl: "https://dura-s.github.io/women-security/",
        details: ["Clear UX, simple navigation, and a mission-driven concept."],
    },
    {
        id: "dorm-maintenance",
        name: "Dorm-Maintenace",
        description: "Dorm maintenance UI for submitting requests and tracking progress. Clean layout and component consistency.",
        language: "CSS",
        tags: ["CSS", "UI", "Responsive"],
        githubUrl: "https://github.com/dura-s/Dorm-Maintenace",
        demoUrl: "https://dura-s.github.io/Dorm-Maintenace/",
    },
    {
        id: "portfolio",
        name: "portfolio",
        description: "My personal portfolio website — modern design, smooth animations, and a strong focus on readability.",
        language: "HTML",
        tags: ["HTML", "CSS", "TypeScript"],
        githubUrl: "https://github.com/dura-s/portfolio",
        // demoUrl: "https://your-demo-link-here",
    },
];
const projectGrid = document.querySelector("#project-grid");
const projectEmpty = document.querySelector("#project-empty");
const projectSearch = document.querySelector("#project-search");
const projectFilters = document.querySelector("#project-filters");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDesc = document.querySelector("#modal-desc");
const modalTags = document.querySelector("#modal-tags");
const modalLinks = document.querySelector("#modal-links");
let activeLanguage = "All";
let searchQuery = "";
function createEl(tag, className) {
    const el = document.createElement(tag);
    if (className)
        el.className = className;
    return el;
}
function openModal(project) {
    if (!modal || !modalTitle || !modalDesc || !modalTags || !modalLinks)
        return;
    modalTitle.textContent = project.name;
    modalDesc.textContent = project.description;
    modalTags.innerHTML = "";
    const tagItems = [project.language, ...project.tags];
    tagItems.forEach((t) => {
        const pill = createEl("span");
        pill.textContent = t;
        modalTags.appendChild(pill);
    });
    modalLinks.innerHTML = "";
    const gh = createLink("GitHub", project.githubUrl, true);
    modalLinks.appendChild(gh);
    if (project.demoUrl) {
        modalLinks.appendChild(createLink("Live Demo", project.demoUrl, true));
    }
    else {
        const disabled = createEl("span", "link disabled");
        disabled.textContent = "Live Demo (add link)";
        modalLinks.appendChild(disabled);
    }
    if (project.details?.length) {
        const ul = createEl("ul");
        ul.style.marginTop = "12px";
        ul.style.color = "var(--muted)";
        project.details.forEach((d) => {
            const li = createEl("li");
            li.textContent = d;
            ul.appendChild(li);
        });
        modalLinks.appendChild(ul);
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
    if (!modal)
        return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}
function createLink(label, href, isAccent = false) {
    const a = createEl("a", "link");
    if (isAccent)
        a.style.borderColor = "var(--accent-soft)";
    a.textContent = label;
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
}
function renderFilters() {
    if (!projectFilters)
        return;
    projectFilters.innerHTML = "";
    const languages = [
        "All",
        ...Array.from(new Set(projects.map((p) => p.language))),
    ];
    languages.forEach((lang) => {
        const btn = createEl("button", "filter-chip");
        btn.type = "button";
        btn.textContent = lang;
        if (lang === activeLanguage)
            btn.classList.add("active");
        btn.addEventListener("click", () => {
            activeLanguage = lang;
            renderAll();
        });
        projectFilters.appendChild(btn);
    });
}
function getFilteredProjects() {
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => {
        const langOk = activeLanguage === "All" ? true : p.language === activeLanguage;
        const text = `${p.name} ${p.description} ${p.language} ${p.tags.join(" ")}`.toLowerCase();
        const qOk = !q ? true : text.includes(q);
        return langOk && qOk;
    });
}
function renderProjects(list) {
    if (!projectGrid || !projectEmpty)
        return;
    projectGrid.innerHTML = "";
    if (!list.length) {
        projectEmpty.hidden = false;
        return;
    }
    projectEmpty.hidden = true;
    list.forEach((p) => {
        const card = createEl("article", "project-card");
        const header = createEl("div", "project-header");
        const title = createEl("h3");
        title.textContent = p.name;
        header.appendChild(title);
        if (p.featured) {
            const pill = createEl("span", "project-pill");
            pill.textContent = "Featured";
            header.appendChild(pill);
        }
        const desc = createEl("p");
        desc.textContent = p.description;
        const meta = createEl("div", "project-meta");
        const lang = createEl("span");
        lang.textContent = p.language;
        meta.appendChild(lang);
        p.tags.slice(0, 3).forEach((t) => {
            const s = createEl("span");
            s.textContent = t;
            meta.appendChild(s);
        });
        const links = createEl("div", "project-links");
        links.appendChild(createLink("GitHub", p.githubUrl));
        if (p.demoUrl) {
            links.appendChild(createLink("Live Demo", p.demoUrl));
        }
        else {
            const demoDisabled = createEl("span", "link disabled");
            demoDisabled.textContent = "Live Demo (add link)";
            links.appendChild(demoDisabled);
        }
        const detailsBtn = createEl("button", "link");
        detailsBtn.type = "button";
        detailsBtn.textContent = "Details";
        detailsBtn.addEventListener("click", () => openModal(p));
        links.appendChild(detailsBtn);
        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(meta);
        card.appendChild(links);
        projectGrid.appendChild(card);
    });
}
function renderAll() {
    renderFilters();
    renderProjects(getFilteredProjects());
}
if (projectSearch) {
    projectSearch.addEventListener("input", () => {
        searchQuery = projectSearch.value.trim();
        renderAll();
    });
}
if (modal) {
    modal.addEventListener("click", (event) => {
        const target = event.target;
        if (target?.dataset?.close === "true")
            closeModal();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape")
            closeModal();
    });
    const closeButtons = modal.querySelectorAll("[data-close='true']");
    closeButtons.forEach((el) => el.addEventListener("click", () => closeModal()));
}
renderAll();
// Contact form validation + small UX
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = (formData.get("name") ?? "").toString().trim();
        const email = (formData.get("email") ?? "").toString().trim();
        const message = (formData.get("message") ?? "").toString().trim();
        if (!name || !email || !message) {
            alert("Please fill in all fields before sending your message.");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        alert("Thank you for reaching out! I will get back to you soon.");
        contactForm.reset();
    });
}
