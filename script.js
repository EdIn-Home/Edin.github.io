const demoUser = { username: "admin", password: "admin123" };
const state = { charts: {}, query: "", discipline: "", year: "", minRepro: 0 };

const papers = [
  { title: "AI Attribution in Clinical NLP", author: "L. Kerr", journal: "Nature MI", field: "Health", year: 2026, ai: 42, repro: 84, integrity: 89 },
  { title: "Transparent Agent Pipelines", author: "E. Khan", journal: "JMLR", field: "Computer", year: 2025, ai: 63, repro: 78, integrity: 85 },
  { title: "Reproducible Climate ML Models", author: "T. Ade", journal: "Climate Data", field: "Climate", year: 2026, ai: 37, repro: 91, integrity: 92 },
  { title: "Bias Audits in LLM Evaluation", author: "S. Li", journal: "AI Ethics", field: "Ethics", year: 2024, ai: 55, repro: 76, integrity: 80 },
  { title: "Scalable Neuro-Symbolic Workflows", author: "M. Noor", journal: "Neuro Comp", field: "Computer", year: 2026, ai: 48, repro: 82, integrity: 84 },
];

const sources = [
  ["Nature MI", "Springer", "Health", "24.5", "38%", "82"],
  ["PLOS CB", "PLOS", "Biology", "3.8", "42%", "89"],
  ["NeuroImage", "Elsevier", "Neuroscience", "5.7", "46%", "80"],
  ["AI & Society", "Springer", "Ethics", "4.3", "34%", "86"],
];

const authors = [
  { name: "Dr. Kwame Okonkwo", inst: "University of Lagos", orcid: "0000-0002-1002-2234", ai: "42%", h: 28 },
  { name: "Dr. Bayo Adeyemi", inst: "OAU", orcid: "0000-0003-4442-9111", ai: "29%", h: 22 },
  { name: "Dr. Leila Kerr", inst: "MIT", orcid: "0000-0001-5555-3322", ai: "37%", h: 33 },
  { name: "Prof. Elias Khan", inst: "Oxford", orcid: "0000-0002-8888-1022", ai: "51%", h: 39 },
];

const byId = (id) => document.getElementById(id);

function toast(msg) {
  const t = byId("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function setLoggedIn(logged) {
  byId("loginView").classList.toggle("active", !logged);
  byId("platformView").style.display = logged ? "grid" : "none";
  byId("app").classList.toggle("locked", !logged);
}

function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  byId(`page-${page}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.page === page));
}

function kpiCard(label, value, delta) {
  return `<div class="kpi"><div class="label">${label}</div><div class="value">${value}</div><div class="delta">${delta}</div></div>`;
}

function renderHome() {
  byId("kpiGrid").innerHTML = [
    kpiCard("Papers Indexed", "4.28M", "+12% this month"),
    kpiCard("Journals Covered", "18,420", "+340 new"),
    kpiCard("AI Verified", "2.31M", "+28% YoY"),
    kpiCard("Indexed Authors", "2.9M", "+180k new"),
  ].join("");

  byId("recentPapers").innerHTML = papers
    .map((p) => `<tr><td>${p.title}</td><td>${p.author}</td><td>${p.field}</td><td>${p.ai}%</td><td>${p.repro}</td><td>${p.integrity}</td></tr>`)
    .join("");
}

function renderSearch() {
  const fields = [...new Set(papers.map((p) => p.field))];
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);
  byId("filterDiscipline").innerHTML = `<option value="">All</option>` + fields.map((f) => `<option>${f}</option>`).join("");
  byId("filterYear").innerHTML = `<option value="">Any</option>` + years.map((y) => `<option>${y}</option>`).join("");
  applySearchFilters();
}

function applySearchFilters() {
  const q = state.query.toLowerCase();
  const list = papers.filter((p) => {
    const hit = `${p.title} ${p.author} ${p.journal} ${p.field}`.toLowerCase().includes(q);
    const d = !state.discipline || p.field === state.discipline;
    const y = !state.year || String(p.year) === state.year;
    const r = p.repro >= state.minRepro;
    return hit && d && y && r;
  });

  byId("searchBody").innerHTML = list
    .map((p) => `<tr><td>${p.title}</td><td>${p.author}</td><td>${p.journal}</td><td>${p.year}</td><td>${p.ai}%</td><td>${p.repro}</td><td>${p.integrity}</td></tr>`)
    .join("");

  byId("searchMeta").textContent = `${list.length} result(s)`;
}

function renderSources() {
  byId("sourcesBody").innerHTML = sources
    .map((s) => `<tr>${s.map((v) => `<td>${v}</td>`).join("")}</tr>`)
    .join("");
}

function renderAuthors() {
  byId("authorsGrid").innerHTML = authors
    .map(
      (a) => `<article class="author-card"><h4>${a.name}</h4><p>${a.inst}</p><p>ORCID: ${a.orcid}</p><p>Avg AI: <b>${a.ai}</b> • h-index: <b>${a.h}</b></p></article>`
    )
    .join("");
}

function drawCharts() {
  Object.values(state.charts).forEach((c) => c?.destroy?.());

  state.charts.discipline = new Chart(byId("disciplineChart"), {
    type: "bar",
    data: {
      labels: ["Health", "Computer", "Biology", "Climate", "Ethics"],
      datasets: [{ data: [44, 59, 36, 41, 33], backgroundColor: ["#2563eb", "#06b6d4", "#14b8a6", "#8b5cf6", "#22c55e"] }],
    },
    options: { plugins: { legend: { display: false } } },
  });

  state.charts.contrib = new Chart(byId("contribPieChart"), {
    type: "pie",
    data: {
      labels: ["Human-written", "AI-assisted", "AI-generated"],
      datasets: [{ data: [52, 31, 17], backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"], borderColor: "#fff", borderWidth: 2 }],
    },
  });

  state.charts.inst = new Chart(byId("instChart"), {
    type: "line",
    data: {
      labels: ["MIT", "Stanford", "ETH", "Oxford", "NUS"],
      datasets: [{ data: [97, 92, 89, 84, 79], borderColor: "#2563eb", fill: true, backgroundColor: "rgba(37,99,235,0.1)", tension: 0.35 }],
    },
    options: { plugins: { legend: { display: false } } },
  });

  state.charts.dept = new Chart(byId("deptPie"), {
    type: "pie",
    data: {
      labels: ["Computer", "Health", "Engineering", "Social", "Humanities"],
      datasets: [{ data: [33, 24, 21, 14, 8], backgroundColor: ["#2563eb", "#06b6d4", "#8b5cf6", "#f59e0b", "#22c55e"], borderColor: "#fff", borderWidth: 2 }],
    },
  });
}

function renderDashKpis() {
  byId("dashKpis").innerHTML = [
    kpiCard("Total Publications", "1,284", "+14% YoY"),
    kpiCard("AI Verified", "847", "+42% YoY"),
    kpiCard("Avg Integrity", "82.4", "+3.1 pts"),
    kpiCard("Active Researchers", "318", "+28 new"),
  ].join("");
}

function initEvents() {
  byId("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = byId("username").value.trim();
    const p = byId("password").value.trim();
    if (u === demoUser.username && p === demoUser.password) {
      localStorage.setItem("edin_session", "active");
      setLoggedIn(true);
      toast("Welcome to EdIn");
    } else {
      byId("loginMessage").textContent = "Invalid credentials. Use admin / admin123.";
    }
  });

  byId("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("edin_session");
    setLoggedIn(false);
  });

  document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  byId("globalSearch").addEventListener("input", (e) => {
    state.query = e.target.value;
    applySearchFilters();
  });

  byId("filterDiscipline").addEventListener("change", (e) => {
    state.discipline = e.target.value;
    applySearchFilters();
  });

  byId("filterYear").addEventListener("change", (e) => {
    state.year = e.target.value;
    applySearchFilters();
  });

  byId("reproSlider").addEventListener("input", (e) => {
    state.minRepro = Number(e.target.value);
    byId("reproVal").textContent = state.minRepro;
    applySearchFilters();
  });

  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    byId("themeToggle").textContent = dark ? "Dark" : "Light";
    drawCharts();
  });

  byId("quickReport").addEventListener("click", () => toast("AI transparency report generated."));
}

(function init() {
  renderHome();
  renderSearch();
  renderSources();
  renderAuthors();
  renderDashKpis();
  drawCharts();
  initEvents();

  const hasSession = localStorage.getItem("edin_session") === "active";
  setLoggedIn(hasSession);
})();
