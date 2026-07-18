// =====================================================
// HAMBURGER MENU
// Handles opening/closing the slide-in nav panel.
// Shared across every page — same markup, same behavior.
// =====================================================
function openNav() {
  document.getElementById("nav-panel").classList.add("open");
  document.getElementById("nav-overlay").classList.add("open");
  document.getElementById("nav-panel").setAttribute("aria-hidden", "false");
  document.getElementById("nav-toggle").setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // stops the page scrolling behind the menu

  document.body.classList.add("nav-open");
}

function closeNav() {
  document.getElementById("nav-panel").classList.remove("open");
  document.getElementById("nav-overlay").classList.remove("open");
  document.getElementById("nav-panel").setAttribute("aria-hidden", "true");
  document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  document.body.classList.remove("nav-open");
}
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("nav-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", openNav);

  // Escape key closes the menu too, standard expected behavior
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
});