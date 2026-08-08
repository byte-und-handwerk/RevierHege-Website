const navigationToggle = document.querySelector("[data-nav-toggle]");
const mobileNavigation = document.querySelector("[data-mobile-nav]");

function setNavigation(open) {
  if (!navigationToggle || !mobileNavigation) return;
  navigationToggle.setAttribute("aria-expanded", String(open));
  navigationToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  mobileNavigation.classList.toggle("is-open", open);
  mobileNavigation.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("nav-open", open);
}

navigationToggle?.addEventListener("click", () => {
  setNavigation(navigationToggle.getAttribute("aria-expanded") !== "true");
});

mobileNavigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavigation(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigation(false);
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const screenshotDialog = document.querySelector("[data-screenshot-dialog]");
const screenshotDialogImage = screenshotDialog?.querySelector("[data-screenshot-dialog-image]");
const screenshotDialogCaption = screenshotDialog?.querySelector("[data-screenshot-dialog-caption]");

document.querySelectorAll("[data-screenshot-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const { screenshotSrc, screenshotAlt, screenshotCaption } = button.dataset;

    if (!screenshotDialog || !screenshotDialogImage || !screenshotDialogCaption || !screenshotSrc) {
      return;
    }

    if (typeof screenshotDialog.showModal !== "function") {
      window.location.href = screenshotSrc;
      return;
    }

    screenshotDialogImage.src = screenshotSrc;
    screenshotDialogImage.alt = screenshotAlt || "Vergrößerte Ansicht der RevierHege-App";
    screenshotDialogCaption.textContent = screenshotCaption || "RevierHege-App";
    screenshotDialog.showModal();
  });
});

screenshotDialog?.querySelector("[data-screenshot-close]")?.addEventListener("click", () => {
  screenshotDialog.close();
});

screenshotDialog?.addEventListener("click", (event) => {
  if (event.target === screenshotDialog) screenshotDialog.close();
});

screenshotDialog?.addEventListener("close", () => {
  if (screenshotDialogImage) screenshotDialogImage.removeAttribute("src");
});
