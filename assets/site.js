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

const platformSwitch = document.querySelector("[data-platform-switch]");
const platformTabs = [...(platformSwitch?.querySelectorAll("[data-platform-tab]") ?? [])];
const platformPanels = [...document.querySelectorAll("[data-platform-panel]")];

function selectPlatform(platform, focus = false) {
  platformTabs.forEach((tab) => {
    const selected = tab.dataset.platformTab === platform;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  platformPanels.forEach((panel) => {
    panel.hidden = panel.dataset.platformPanel !== platform;
  });
}

if (platformSwitch && platformTabs.length > 1 && platformPanels.length === platformTabs.length) {
  platformSwitch.setAttribute("role", "tablist");
  platformSwitch.setAttribute("aria-label", "Plattform der App-Ansichten");
  platformTabs.forEach((tab) => tab.setAttribute("role", "tab"));
  platformPanels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `plattform-${panel.dataset.platformPanel}`);
    panel.querySelectorAll("[data-platform-title]").forEach((title) => {
      title.hidden = true;
    });
  });

  platformTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPlatform(tab.dataset.platformTab));
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      let target;
      if (step) target = platformTabs[(index + step + platformTabs.length) % platformTabs.length];
      if (event.key === "Home") target = platformTabs[0];
      if (event.key === "End") target = platformTabs[platformTabs.length - 1];
      if (!target) return;
      event.preventDefault();
      selectPlatform(target.dataset.platformTab, true);
    });
  });

  platformSwitch.hidden = false;
  selectPlatform(platformTabs[0].dataset.platformTab);
}
