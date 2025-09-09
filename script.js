/* Util: clamp helpers, qs, etc. */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/* Year stamp */
$("#year").textContent = new Date().getFullYear();

/* Mobile menu toggle */
const toggleBtn = $(".nav__toggle");
const navList = $("#nav-list");
if (toggleBtn && navList) {
  toggleBtn.addEventListener("click", () => {
    const open = navList.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(open));
  });
}

/* Theme: auto/light/dark with storage and system sync */
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;
const THEME_KEY = "theme";
function applyTheme(mode) {
  // mode: 'light' | 'dark' | 'auto'
  root.setAttribute("data-theme", mode);
  localStorage.setItem(THEME_KEY, mode);
  document.querySelector('meta[name="theme-color"][media*="dark"]')?.setAttribute("content", "#0b0f14");
  document.querySelector('meta[name="theme-color"][media*="light"]")?.setAttribute("content", "#ffffff");
}
function currentTheme() { return localStorage.getItem(THEME_KEY) || "auto"; }
function resolveTheme() {
  const t = currentTheme();
  if (t === "auto") return prefersDark.matches ? "dark" : "light";
  return t;
}
function setResolvedTheme() {
  const resolved = resolveTheme();
  root.dataset.resolvedTheme = resolved;
}
setResolvedTheme();
prefersDark.addEventListener("change", setResolvedTheme);

const themeBtn = $("#theme-toggle");
const cycle = { auto: "dark", dark: "light", light: "auto" };
function updateThemeButton() {
  const t = currentTheme();
  themeBtn.textContent = t === "auto" ? "Auto" : t[0].toUpperCase() + t.slice(1);
  themeBtn.setAttribute("aria-label", `Theme: ${t}. Click to change.`);
}
if (themeBtn) {
  updateThemeButton();
  themeBtn.addEventListener("click", () => {
    const next = cycle[currentTheme()];
    applyTheme(next);
    updateThemeButton();
    setResolvedTheme();
  });
}

/* Scroll spy + active link */
const sections = $$("[data-section]");
const navLinks = $$(".nav__list a[href^='#']");
const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute("id");
    const link = $(`.nav__list a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove("is-active"));
      link.classList.add("is-active");
      history.replaceState(null, "", `#${id}`);
    }
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
sections.forEach(s => obs.observe(s));

/* Reveal-on-scroll with Reduced Motion respect */
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  const revealables = $$(".card, .stack__group, .note, .hero__copy, .hero__media");
  revealables.forEach(el => el.classList.add("reveal"));
  const ro = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
  }, { threshold: 0.15 });
  revealables.forEach(el => ro.observe(el));
}

/* Form validation (progressive enhancement) */
const form = $(".form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = $(".form__status");
    const data = new FormData(form);
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const message = data.get("message")?.toString().trim();
    const errors = [];
    if (!name) errors.push("Name");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("Valid email");
    if (!message) errors.push("Message");
    if (errors.length) {
      status.textContent = `Please provide: ${errors.join(", ")}.`;
      status.style.color = "crimson";
      return;
    }
    // Fake submit; swap with your endpoint
    setTimeout(() => {
      status.textContent = "Thanks — I’ll reply soon.";
      status.style.color = "inherit";
      form.reset();
    }, 400);
  });
}

/* Performance: measure first paint-ish */
performance.mark("loaded");
requestIdleCallback?.(() => {
  const t = performance.now().toFixed(0);
  console.info(`Loaded in ~${t}ms`);
});

/* PWA: register service worker */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(console.warn);
  });
}
