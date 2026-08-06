// Current year in the sidebar footer
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile nav toggle (sidebar collapses to a top bar under 860px)
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#sidebar-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  // Close the menu after tapping a link
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }
  });
}

// Project context tags — rendered from data-context-* fields on each project row.
// The org name becomes clickable only when a contextUrl is present. Because the
// row itself is an <a>, the link is a role="link" element (nested <a> is invalid)
// that intercepts the click instead of triggering the row's navigation.
document.querySelectorAll(".docket-row[data-context-type]").forEach((row) => {
  const type = row.dataset.contextType;
  const name = row.dataset.contextName;
  const url = row.dataset.contextUrl;
  const body = row.querySelector(".docket-body");
  if (!type || !body) return;

  const tag = document.createElement("span");
  tag.className = "project-context";

  const typeEl = document.createElement("span");
  typeEl.className = "ctx-type";
  typeEl.textContent = type;
  tag.appendChild(typeEl);

  if (name) {
    tag.appendChild(document.createTextNode(" · "));

    const nameEl = document.createElement("span");
    nameEl.textContent = name;

    if (url) {
      nameEl.className = "ctx-link";
      nameEl.setAttribute("role", "link");
      nameEl.setAttribute("tabindex", "0");
      const open = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(url, "_blank", "noopener");
      };
      nameEl.addEventListener("click", open);
      nameEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") open(event);
      });
    } else {
      nameEl.className = "ctx-name";
    }

    tag.appendChild(nameEl);
  }

  body.insertBefore(tag, body.firstChild);
});

// Scrollspy — highlight the nav item for the section in view (home page only)
const navLinks = Array.from(document.querySelectorAll("#sidebar-nav a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = navLinks.find(
          (a) => a.getAttribute("href") === `#${entry.target.id}`
        );
        if (!link) return;
        navLinks.forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}
