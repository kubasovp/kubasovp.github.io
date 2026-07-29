const viewport = document.querySelector(".reader__viewport");
const documentElement = document.querySelector(".reader__document");
const previousButton = document.querySelector("[data-reader-previous]");
const nextButton = document.querySelector("[data-reader-next]");
const progressElement = document.querySelector(".reader__progress");

let currentPage = 0;
let pageCount = 1;
let paginationFrame;

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

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

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
paginate();
