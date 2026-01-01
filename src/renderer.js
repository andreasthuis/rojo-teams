import "./index.css";
import "./css/dashboard.css";

const appContainer = document.querySelector(".main-container");

function setupMaximizeListeners() {
  const maxBtn = document.getElementById("max-btn");

  window.api.onMaximized(() => {
    document.body.classList.add("maximized");
    
    if (maxBtn) {
      maxBtn.innerHTML = "&#10064;";
    }
  });

  window.api.onUnmaximized(() => {
    document.body.classList.remove("maximized");
    
    if (maxBtn) {
      maxBtn.innerHTML = "&#9723;";
    }
  });
}

function addWindowButtons() {
  document
    .getElementById("close-btn")
    ?.addEventListener("click", () => window.api.closeWindow());

  document
    .getElementById("min-btn")
    ?.addEventListener("click", () => window.api.minimizeWindow());

  document
    .getElementById("max-btn")
    ?.addEventListener("click", () => window.api.maximizeWindow());
}

async function loadMenu(file) {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    const html = await window.api.loadMenu(file);
    app.innerHTML = html;
  } catch (err) {
    console.error(err);
    app.innerHTML = "<p>Failed to load page</p>";
  }
}

async function addNavButtons() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const files = await window.api.getMenus();

  for (const file of files) {
    const btn = document.createElement("button");
    btn.className = "nav-btn";
    btn.textContent = file.replace(".html", "");

    btn.addEventListener("click", () => loadMenu(file));

    nav.appendChild(btn);
  }

  if (files.length > 0) {
    loadMenu(files[0]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addWindowButtons();
  addNavButtons();
  setupMaximizeListeners()
});