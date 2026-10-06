/* =========================================================
   MUSEU DIGITAL DA MATEMÁTICA — script.js
   Vanilla JS puro, sem dependências externas.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initSearch();
  initScrollSpy();
  initBackToTop();
  initFadeInAnimations();
  initFooterYear();
});

/* ---------------------------------------------------------
   1. DARK MODE + localStorage
   --------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  const STORAGE_KEY = "museu-matematica-theme";

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  }
  updateToggleIcon();

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    }
    updateToggleIcon();
  });

  function updateToggleIcon() {
    if (!toggleBtn) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    toggleBtn.setAttribute(
      "aria-label",
      isDark ? "Alternar para tema claro" : "Alternar para tema escuro"
    );
    toggleBtn.title = isDark ? "Alternar para tema claro" : "Alternar para tema escuro";
  }
}

/* ---------------------------------------------------------
   2. MENU MOBILE (sidebar)
   --------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector("[data-hamburger]");
  const sidebar = document.querySelector("[data-sidebar]");
  const overlay = document.querySelector("[data-sidebar-overlay]");
  const closeBtn = document.querySelector("[data-sidebar-close]");
  const searchToggle = document.querySelector("[data-search-toggle]");

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener("click", () => openSidebar());
    overlay.addEventListener("click", () => closeSidebar());
    if (closeBtn) closeBtn.addEventListener("click", () => closeSidebar());

    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeSidebar());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      const term = window.prompt("Pesquisar no Museu Digital da Matemática:");
      if (term !== null) runSearch(term);
    });
  }

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    hamburger.setAttribute("aria-expanded", "false");
  }
}

/* ---------------------------------------------------------
   3. BUSCA INTERNA (sem backend)
   --------------------------------------------------------- */
function initSearch() {
  const form = document.querySelector("[data-search-form]");
  if (!form) return;

  const input = form.querySelector("input[type='search']");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(input.value);
  });
}

function runSearch(rawTerm) {
  const term = (rawTerm || "").trim().toLowerCase();
  const feedback = document.querySelector("[data-search-feedback]");

  if (!term) return;

  let message;
  let destination = null;

  if (term.includes("turing")) {
    message = "Alan Turing — página disponível";
    destination = "index.html";
  } else if (term.includes("ada") || term.includes("lovelace")) {
    message = "Ada Lovelace — página disponível";
    destination = "ada-lovelace.html";
  } else {
    message = "Não encontramos uma página correspondente.";
  }

  showSearchFeedback(message, feedback);

  if (destination) {
    const alreadyOnPage = window.location.pathname.endsWith(destination);
    if (!alreadyOnPage) {
      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    }
  }
}

function showSearchFeedback(message, feedbackEl) {
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  feedbackEl.classList.add("visible");
  clearTimeout(showSearchFeedback._timer);
  showSearchFeedback._timer = setTimeout(() => {
    feedbackEl.classList.remove("visible");
  }, 2500);
}

/* ---------------------------------------------------------
   4. DESTAQUE DA SEÇÃO ATUAL NA SIDEBAR (IntersectionObserver)
   --------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main article .article-section, main article .article-intro-section");
  const sidebarLinks = document.querySelectorAll("[data-sidebar] .sidebar-list a[href^='#']");

  if (!sections.length || !sidebarLinks.length) return;

  const linkMap = new Map();
  sidebarLinks.forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    linkMap.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = linkMap.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          sidebarLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => {
    if (section.id) observer.observe(section);
  });
}

/* ---------------------------------------------------------
   5. BOTÃO VOLTAR AO TOPO
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------
   6. PEQUENAS ANIMAÇÕES DE ENTRADA
   --------------------------------------------------------- */
function initFadeInAnimations() {
  const targets = document.querySelectorAll(".fade-in");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   7. ANO ATUAL NO FOOTER
   --------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
