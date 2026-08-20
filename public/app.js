const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const main = document.getElementById("main");

function neighbor(id, dir) {
  const i = PATHS.findIndex((p) => p.id === id);
  return PATHS[i + dir];
}

function renderGrid() {
  grid.innerHTML = PATHS.map(
    (p) => `
    <button class="card" data-id="${p.id}" aria-label="Read the ${p.title} guide">
      <div class="cover"><span>Path ${p.id}</span></div>
      <div class="meta">
        <div class="id">Path ${p.id}</div>
        <h3>${p.title}</h3>
        <p>${p.promise}</p>
      </div>
    </button>`
  ).join("");
}

function openGuide(id) {
  const path = PATHS.find((p) => p.id === id);
  const guide = GUIDES[id];
  if (!path || !guide) return;
  const prev = neighbor(id, -1);
  const next = neighbor(id, 1);
  const sections = guide.sections
    .map((s) => {
      const paras = (s.p || []).map((t) => `<p>${t}</p>`).join("");
      const steps = s.steps
        ? `<ol>${s.steps.map((t) => `<li>${t}</li>`).join("")}</ol>`
        : "";
      return `<section class="section"><h2>${s.h}</h2>${paras}${steps}</section>`;
    })
    .join("");

  overlay.innerHTML = `
    <header class="hero-cover">
      <div class="wrap">
        <p class="kicker" style="color:var(--gold);letter-spacing:.42em;text-transform:uppercase;font-size:12px;font-family:'Cormorant Garamond',serif;">Path ${path.id}</p>
        <h1>${path.title}</h1>
        <p class="dek">${guide.dek}</p>
      </div>
    </header>
    <div class="wrap">
      <div class="actions">
        <button class="btn ghost" data-close>All 20 streams</button>
      </div>
      <aside class="promise">
        <p class="id">The promise</p>
        <h2>${guide.promise}</h2>
        <p style="margin-top:12px;color:var(--muted);">${guide.who}</p>
        <p style="margin-top:8px;color:var(--muted);">Price band: ${guide.pricing}</p>
      </aside>
      ${sections}
      <div class="nav">
        ${prev ? `<a href="?path=${prev.id}">${prev.title}</a>` : `<span></span>`}
        ${next ? `<a href="?path=${next.id}" style="text-align:right">${next.title}</a>` : `<a href="#streams" data-close style="text-align:right">All 20 streams</a>`}
      </div>
    </div>`;
  overlay.classList.remove("hidden");
  overlay.scrollTop = 0;
  main.setAttribute("aria-hidden", "true");
  history.pushState({ path: id }, "", `?path=${id}`);
  document.title = `${path.title} · The Operator Suite`;
}

function closeGuide() {
  overlay.classList.add("hidden");
  overlay.innerHTML = "";
  main.removeAttribute("aria-hidden");
  history.pushState({}, "", "/");
  document.title = "The Operator Suite";
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest("[data-id]");
  if (card) openGuide(card.dataset.id);
});

overlay.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) {
    e.preventDefault();
    closeGuide();
    document.getElementById("streams").scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeGuide();
});

window.addEventListener("popstate", () => {
  const id = new URLSearchParams(location.search).get("path");
  if (id) openGuide(id);
  else closeGuide();
});

renderGrid();
const start = new URLSearchParams(location.search).get("path");
if (start) openGuide(start);
