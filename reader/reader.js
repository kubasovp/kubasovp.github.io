const viewport = document.querySelector(".reader__viewport");
const documentElement = document.querySelector(".reader__document");
const previousButton = document.querySelector("[data-reader-previous]");
const nextButton = document.querySelector("[data-reader-next]");
const progressElement = document.querySelector(".reader__progress");
const reader = document.querySelector(".reader");
const settings = document.querySelector(".reader-settings");
const settingsToggle = document.querySelector("[data-reader-settings-toggle]");
const settingsClose = document.querySelector("[data-reader-settings-close]");
const fontSizeInputs = document.querySelectorAll('input[name="font-size"]');
const fontSizeStorageKey = "reader-font-size";

let currentPage = 0;
let pageCount = 1;
let paginationFrame;

function restoreFontSize() {
  const savedFontSize = localStorage.getItem(fontSizeStorageKey);
  const savedInput = Array.from(fontSizeInputs).find((input) => input.value === savedFontSize);

  if (!savedInput) return;

  savedInput.checked = true;
  reader.dataset.fontSize = savedInput.value;
}

function setSettingsOpen(isOpen) {
  settings.classList.toggle("reader-settings_open", isOpen);
  settings.setAttribute("aria-hidden", String(!isOpen));
  settingsToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    settings.querySelector('input[name="font-size"]:checked').focus();
  } else {
    settingsToggle.focus();
  }
}

function getPageMetrics() {
  const columnGap = Number.parseFloat(getComputedStyle(documentElement).columnGap) || 0;
  const pageWidth = viewport.clientWidth + columnGap;
  const contentWidth = viewport.scrollWidth + columnGap;

  return {
    pageWidth,
    pageCount: Math.max(1, Math.ceil((contentWidth - 1) / pageWidth)),
  };
}

function renderPage() {
  const { pageWidth } = getPageMetrics();

  viewport.scrollLeft = currentPage * pageWidth;
  progressElement.textContent = `${currentPage + 1} из ${pageCount}`;
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pageCount - 1;
}

function showPage(page) {
  currentPage = Math.max(0, Math.min(page, pageCount - 1));
  renderPage();
}

function paginate() {
  const readingProgress = pageCount > 1 ? currentPage / (pageCount - 1) : 0;

  viewport.scrollLeft = 0;
  pageCount = getPageMetrics().pageCount;
  currentPage = Math.round(readingProgress * (pageCount - 1));
  renderPage();
}

function schedulePagination() {
  cancelAnimationFrame(paginationFrame);
  paginationFrame = requestAnimationFrame(paginate);
}

previousButton.addEventListener("click", () => showPage(currentPage - 1));
nextButton.addEventListener("click", () => showPage(currentPage + 1));
settingsToggle.addEventListener("click", () => {
  setSettingsOpen(settingsToggle.getAttribute("aria-expanded") !== "true");
});
settingsClose.addEventListener("click", () => setSettingsOpen(false));
fontSizeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    reader.dataset.fontSize = input.value;
    localStorage.setItem(fontSizeStorageKey, input.value);
    schedulePagination();
  });
});

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.key === "Escape" && settingsToggle.getAttribute("aria-expanded") === "true") {
    event.preventDefault();
    setSettingsOpen(false);
    return;
  }

  if (settingsToggle.getAttribute("aria-expanded") === "true") return;

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    showPage(currentPage - 1);
  }

  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    showPage(currentPage + 1);
  }
});

window.addEventListener("resize", schedulePagination);
document.fonts?.ready.then(schedulePagination);
restoreFontSize();
paginate();
