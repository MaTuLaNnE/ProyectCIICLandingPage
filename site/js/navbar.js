async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  try {
    const response = await fetch("components/navbar.html");
    const html = await response.text();
    navbarContainer.innerHTML = html;

    activarLinkActual();
    iniciarMenuMobile();

    if (window.feather) {
      feather.replace();
    }
  } catch (error) {
    console.error("Error cargando navbar:", error);
  }
}

function normalizarRuta(path) {
  if (!path || path === "/") return "index.html";

  const cleanPath = path.split("?")[0].split("#")[0];
  const normalizedPath = cleanPath.split("/").pop();

  return normalizedPath || "index.html";
}

function activarLinkActual() {
  const currentPath = normalizarRuta(window.location.pathname);
  const links = document.querySelectorAll("[data-nav-link]");

  links.forEach((link) => {
    const linkPath = normalizarRuta(link.getAttribute("href"));
    const variant = link.dataset.navVariant;
    const isCurrent = linkPath === currentPath;

    link.removeAttribute("aria-current");

    if (variant === "desktop") {
      link.classList.remove("text-blue-700", "font-semibold");
      link.classList.add("text-slate-600");
    } else {
      link.classList.remove("bg-white/15", "text-white");
      link.classList.add("text-white/75");
    }

    if (!isCurrent) return;

    link.setAttribute("aria-current", "page");

    if (variant === "desktop") {
      link.classList.remove("text-slate-600");
      link.classList.add("text-blue-700", "font-semibold");
      return;
    }

    link.classList.remove("text-white/75");
    link.classList.add("bg-white/15", "text-white");
  });
}

function iniciarMenuMobile() {
  const button = document.getElementById("mobile-menu-button");
  const closeButton = document.getElementById("mobile-menu-close");
  const backdrop = document.getElementById("site-mobile-backdrop");
  const drawer = document.getElementById("site-mobile-drawer");
  const closeLinks = document.querySelectorAll("[data-nav-close]");
  const contactButton = document.getElementById("mobile-contact-btn");

  if (!button || !backdrop || !drawer) return;

  const openMenu = () => {
    button.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    backdrop.classList.add("is-open");
    drawer.classList.add("is-open");
    document.body.classList.add("nav-locked");
  };

  const closeMenu = () => {
    button.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    backdrop.classList.remove("is-open");
    drawer.classList.remove("is-open");
    document.body.classList.remove("nav-locked");
  };

  button.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeMenu);
  }

  backdrop.addEventListener("click", closeMenu);

  closeLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (contactButton) {
    contactButton.addEventListener("click", () => {
      closeMenu();

      if (typeof window.openContactModal === "function") {
        window.openContactModal();
      }
    });
  }

  window.closeNavbarMenu = closeMenu;

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", loadNavbar);
