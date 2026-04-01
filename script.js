const state = { query: "", discipline: "", institution: "", year: "", minRepro: 0, charts: {} };

const papers = [
  { id: 1, title: "AI Attribution in Clinical NLP", author: "Dr. Leila Kerr", institution: "MIT Media Lab", country: "USA", journal: "Nature MI", field: "Health", year: 2026, ai: 42, repro: 84, integrity: 89, doi: "10.1000/edin.001" },
  { id: 2, title: "Transparent Agent Pipelines", author: "Prof. Elias Khan", institution: "Oxford Future Lab", country: "UK", journal: "JMLR", field: "Computer", year: 2025, ai: 63, repro: 78, integrity: 85, doi: "10.1000/edin.002" },
  { id: 3, title: "Reproducible Climate ML Models", author: "Dr. Tolu Ade", institution: "NUS Quantum Compute", country: "Singapore", journal: "Climate Data", field: "Climate", year: 2026, ai: 37, repro: 91, integrity: 92, doi: "10.1000/edin.003" },
  { id: 4, title: "Bias Audits in LLM Evaluation", author: "Dr. Mei Li", institution: "Stanford AI Hub", country: "USA", journal: "AI Ethics", field: "Ethics", year: 2024, ai: 55, repro: 76, integrity: 80, doi: "10.1000/edin.004" },
  { id: 5, title: "Computational Neuroscience with AI", author: "Dr. Omar Noor", institution: "ETH Zurich", country: "Switzerland", journal: "Neuro Comp", field: "Neuroscience", year: 2026, ai: 48, repro: 82, integrity: 84, doi: "10.1000/edin.005" },
  { id: 6, title: "AI-Supported Genomics Verification", author: "Dr. Sara Mensah", institution: "University of Lagos", country: "Nigeria", journal: "Genome Works", field: "Biology", year: 2025, ai: 45, repro: 87, integrity: 90, doi: "10.1000/edin.006" }
];

const authors = [
  { name: "Dr. Leila Kerr", institution: "MIT Media Lab", orcid: "0000-0001-5555-3322", papers: 32, h: 33, focus: "Clinical NLP, AI transparency" },
  { name: "Prof. Elias Khan", institution: "Oxford Future Lab", orcid: "0000-0002-8888-1022", papers: 44, h: 39, focus: "Agent workflows, policy, governance" },
  { name: "Dr. Sara Mensah", institution: "University of Lagos", orcid: "0000-0005-1222-9911", papers: 21, h: 19, focus: "AI genomics, reproducibility" },
  { name: "Dr. Mei Li", institution: "Stanford AI Hub", orcid: "0000-0003-4400-1112", papers: 29, h: 28, focus: "Evaluation bias and integrity metrics" }
];

const institutions = [
  { name: "MIT Media Lab", country: "USA", field: "Health", papers: 970, ai: "58%", integrity: 89 },
  { name: "Oxford Future Lab", country: "UK", field: "Computer", papers: 812, ai: "61%", integrity: 87 },
  { name: "ETH Zurich", country: "Switzerland", field: "Neuroscience", papers: 701, ai: "55%", integrity: 86 },
  { name: "University of Lagos", country: "Nigeria", field: "Biology", papers: 522, ai: "47%", integrity: 84 }
];

const byId = (id) => document.getElementById(id);

function toast(msg) {
  const t = byId("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  byId(`page-${page}`).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach((n) => n.classList.toggle("active", n.dataset.page === page));
}

function kpi(label, value, delta) {
  return `<div class="kpi"><div class="label">${label}</div><div class="value">${value}</div><div class="delta">${delta}</div></div>`;
}

function showDetail(title, html) {
  byId("detailTitle").textContent = title;
  byId("detailBody").innerHTML = html;
  byId("detailModal").showModal();
}

function renderHome() {
  byId("kpiGrid").innerHTML = [
    kpi("Papers Indexed", "4.28M", "+12% month"),
    kpi("AI Verified", "2.31M", "+28% YoY"),
    kpi("AI Index", "58.3", "+2.2 points"),
    kpi("Human Contribution", "52%", "high-quality baseline")
  ].join("");

  byId("recentPapers").innerHTML = papers
    .map((p) => `
      <tr>
        <td><span class="clickable" data-paper="${p.id}">${p.title}</span></td>
        <td><span class="clickable" data-author="${p.author}">${p.author}</span></td>
        <td><span class="clickable" data-inst="${p.institution}">${p.institution}</span></td>
        <td>${p.field}</td><td>${p.ai}%</td><td>${p.repro}</td><td>${p.integrity}</td>
      </tr>
    `).join("");
}

function getFilteredPapers() {
  const q = state.query.toLowerCase();
  return papers.filter((p) => {
    const hit = `${p.title} ${p.author} ${p.institution} ${p.doi} ${p.field}`.toLowerCase().includes(q);
    const d = !state.discipline || p.field === state.discipline;
    const i = !state.institution || p.institution === state.institution;
    const y = !state.year || String(p.year) === state.year;
    const r = p.repro >= state.minRepro;
    return hit && d && i && y && r;
  });
}

function renderSearch() {
  const fields = [...new Set(papers.map((p) => p.field))];
  const insts = [...new Set(papers.map((p) => p.institution))];
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  byId("filterDiscipline").innerHTML = '<option value="">All</option>' + fields.map((x) => `<option>${x}</option>`).join("");
  byId("filterInstitution").innerHTML = '<option value="">All</option>' + insts.map((x) => `<option>${x}</option>`).join("");
  byId("filterYear").innerHTML = '<option value="">Any</option>' + years.map((x) => `<option>${x}</option>`).join("");

  const list = getFilteredPapers();
  byId("searchMeta").textContent = `${list.length} result(s)`;
  byId("searchBody").innerHTML = list.map((p) => `
    <tr>
      <td><span class="clickable" data-paper="${p.id}">${p.title}</span></td>
      <td><span class="clickable" data-author="${p.author}">${p.author}</span></td>
      <td><span class="clickable" data-inst="${p.institution}">${p.institution}</span></td>
      <td>${p.year}</td><td>${p.field}</td><td>${p.ai}%</td><td>${p.repro}</td><td>${p.integrity}</td>
    </tr>
  `).join("");
}

function renderSources() {
  byId("sourcesBody").innerHTML = institutions.map((i) => `
    <tr>
      <td><span class="clickable" data-inst="${i.name}">${i.name}</span></td>
      <td>${i.country}</td><td>${i.field}</td><td>${i.papers}</td><td>${i.ai}</td><td>${i.integrity}</td>
    </tr>
  `).join("");
}

function renderAuthors() {
  byId("authorsGrid").innerHTML = authors.map((a) => `
    <article class="author-card">
      <h4><span class="clickable" data-author="${a.name}">${a.name}</span></h4>
      <p>${a.institution}</p>
      <p>ORCID: ${a.orcid}</p>
      <p>Papers: <b>${a.papers}</b> • h-index: <b>${a.h}</b></p>
      <p>${a.focus}</p>
    </article>
  `).join("");
}

function renderDashKpis() {
  byId("dashKpis").innerHTML = [
    kpi("Top Institutions", "4", "updated live"),
    kpi("Avg Integrity", "86.5", "+1.8 pts"),
    kpi("Avg Reproducibility", "83.0", "+2.4 pts"),
    kpi("AI Active Fields", "6", "cross-disciplinary")
  ].join("");
}

function drawCharts() {
  Object.values(state.charts).forEach((c) => c?.destroy?.());

  state.charts.discipline = new Chart(byId("disciplineChart"), {
    type: "bar",
    data: { labels: ["Health", "Computer", "Biology", "Climate", "Ethics", "Neuro"], datasets: [{ label: "Avg AI %", data: [44, 63, 47, 37, 55, 48], borderRadius: 10, backgroundColor: ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#8b5cf6"] }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
  });

  state.charts.contrib = new Chart(byId("contribPieChart"), {
    type: "doughnut",
    data: { labels: ["Human-written", "AI-assisted", "AI-generated"], datasets: [{ data: [52, 31, 17], backgroundColor: ["#16a34a", "#f59e0b", "#ef4444"], borderColor: "#ffffff", borderWidth: 3, hoverOffset: 8 }] },
    options: {
      cutout: "58%",
      plugins: {
        legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 10 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` } }
      }
    }
  });

  state.charts.inst = new Chart(byId("instChart"), {
    type: "line",
    data: { labels: institutions.map((i) => i.name), datasets: [{ label: "Institution AI Index", data: [97, 84, 89, 78], borderColor: "#2563eb", tension: 0.35, backgroundColor: "rgba(37,99,235,.1)", fill: true }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  state.charts.dept = new Chart(byId("deptPie"), {
    type: "pie",
    data: { labels: ["Computer", "Health", "Biology", "Climate", "Ethics"], datasets: [{ data: [31, 24, 18, 14, 13], backgroundColor: ["#2563eb", "#0ea5e9", "#22c55e", "#8b5cf6", "#f59e0b"], borderColor: "#fff", borderWidth: 2 }] },
    options: { plugins: { legend: { position: "bottom", labels: { usePointStyle: true } } } }
  });
}

function bindInteractions() {
  document.querySelectorAll(".nav-btn,[data-page]").forEach((b) => {
    b.addEventListener("click", () => {
      const page = b.dataset.page;
      if (page) navigate(page);
    });
  });

  byId("globalSearch").addEventListener("input", (e) => { state.query = e.target.value; renderSearch(); });
  byId("filterDiscipline").addEventListener("change", (e) => { state.discipline = e.target.value; renderSearch(); });
  byId("filterInstitution").addEventListener("change", (e) => { state.institution = e.target.value; renderSearch(); });
  byId("filterYear").addEventListener("change", (e) => { state.year = e.target.value; renderSearch(); });
  byId("reproSlider").addEventListener("input", (e) => { state.minRepro = Number(e.target.value); byId("reproVal").textContent = state.minRepro; renderSearch(); });

  document.body.addEventListener("click", (e) => {
    const paperId = e.target.dataset.paper;
    const authorName = e.target.dataset.author;
    const instName = e.target.dataset.inst;

    if (paperId) {
      const p = papers.find((x) => x.id === Number(paperId));
      showDetail(p.title, `<p><b>Author:</b> ${p.author}</p><p><b>Institution:</b> ${p.institution} (${p.country})</p><p><b>Journal:</b> ${p.journal}</p><p><b>DOI:</b> ${p.doi}</p><p><b>AI:</b> ${p.ai}% | <b>Repro:</b> ${p.repro} | <b>Integrity:</b> ${p.integrity}</p>`);
    }

    if (authorName) {
      const a = authors.find((x) => x.name === authorName);
      const authored = papers.filter((p) => p.author === authorName).map((p) => `<li>${p.title} (${p.year})</li>`).join("");
      showDetail(a.name, `<p><b>Institution:</b> ${a.institution}</p><p><b>ORCID:</b> ${a.orcid}</p><p><b>Papers:</b> ${a.papers} | <b>h-index:</b> ${a.h}</p><p><b>Focus:</b> ${a.focus}</p><p><b>Recent Works:</b></p><ul>${authored || '<li>No recent papers listed</li>'}</ul>`);
    }

    if (instName) {
      const i = institutions.find((x) => x.name === instName);
      const works = papers.filter((p) => p.institution === instName).map((p) => `<li>${p.title} — ${p.author}</li>`).join("");
      showDetail(i.name, `<p><b>Country:</b> ${i.country}</p><p><b>Top Field:</b> ${i.field}</p><p><b>Total Papers:</b> ${i.papers}</p><p><b>Avg AI:</b> ${i.ai} | <b>Avg Integrity:</b> ${i.integrity}</p><p><b>Indexed Papers:</b></p><ul>${works || '<li>No indexed paper listed</li>'}</ul>`);
    }

    if (e.target.classList.contains("tag")) {
      state.query = e.target.dataset.topic;
      byId("globalSearch").value = state.query;
      navigate("search");
      renderSearch();
      toast(`Loaded topic: ${state.query}`);
    }
  });

  byId("closeModal").addEventListener("click", () => byId("detailModal").close());
  byId("careersBtn").addEventListener("click", () => toast("Careers portal coming soon."));
  byId("contactBtn").addEventListener("click", () => toast("Contact: partnerships@edin.io"));
  byId("privacyBtn").addEventListener("click", () => toast("Privacy policy loading..."));
}

(function init() {
  renderHome();
  renderSearch();
  renderSources();
  renderAuthors();
  renderDashKpis();
  drawCharts();
  bindInteractions();
})();
