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

function activarLinkActual() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    const linkPath = link.getAttribute("href");

    if (linkPath === currentPath) {
      link.classList.remove("text-gray-700");
      link.classList.add("text-blue-600", "font-bold");
    }
  });
}

function iniciarMenuMobile() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);