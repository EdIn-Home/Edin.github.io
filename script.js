const demoUser = {
  username: "admin",
  password: "admin123",
};

const mockData = {
  institutions: [
    { name: "MIT Media Lab", usage: 97, country: "USA" },
    { name: "Stanford AI Hub", usage: 92, country: "USA" },
    { name: "ETH Zurich", usage: 89, country: "Switzerland" },
    { name: "Oxford Future Lab", usage: 84, country: "UK" },
    { name: "NUS Quantum Compute", usage: 79, country: "Singapore" },
  ],
  fields: [
    { name: "Bioinformatics", usage: 95 },
    { name: "Climate Modeling", usage: 88 },
    { name: "Computational Neuroscience", usage: 83 },
    { name: "Material Discovery", usage: 81 },
    { name: "Quantum Simulation", usage: 76 },
  ],
  entities: [
    {
      type: "institution",
      name: "MIT Media Lab",
      identifier: "OSI-MIT-4021",
      focus: "Human-AI Systems",
    },
    {
      type: "author",
      name: "Dr. Leila Kerr",
      identifier: "DOI:10.8921/edin.2026.19",
      focus: "AI in Climate Systems",
    },
    {
      type: "institution",
      name: "Oxford Future Lab",
      identifier: "OSI-OXF-2304",
      focus: "Medical Foundation Models",
    },
    {
      type: "author",
      name: "Prof. Elias Khan",
      identifier: "DOI:10.7404/edin.2026.44",
      focus: "AI Governance",
    },
    {
      type: "institution",
      name: "ETH Zurich",
      identifier: "OSI-ETH-7811",
      focus: "Robotics + AI",
    },
  ],
};

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const institutionList = document.getElementById("institutionList");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

let institutionChart;
let fieldChart;

function setView(isLoggedIn) {
  loginView.classList.toggle("active", !isLoggedIn);
  dashboardView.classList.toggle("active", isLoggedIn);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function validateLogin(username, password) {
  return username === demoUser.username && password === demoUser.password;
}

function renderInstitutionList() {
  institutionList.innerHTML = "";

  mockData.institutions.forEach((institution) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${institution.name}</span><strong>${institution.usage}%</strong>`;
    li.addEventListener("click", () => {
      showToast(`${institution.name} • ${institution.country} • Usage ${institution.usage}%`);
    });
    institutionList.appendChild(li);
  });
}

function renderSearchResults(query = "") {
  const lower = query.trim().toLowerCase();
  const filtered = mockData.entities.filter((item) => {
    return (
      item.name.toLowerCase().includes(lower) ||
      item.identifier.toLowerCase().includes(lower) ||
      item.focus.toLowerCase().includes(lower)
    );
  });

  searchResults.innerHTML = "";

  if (!filtered.length) {
    searchResults.innerHTML = '<p class="sub">No matching records found.</p>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <small>${item.type.toUpperCase()}</small>
      <h4>${item.name}</h4>
      <p>${item.focus}</p>
      <code>${item.identifier}</code>
    `;
    card.addEventListener("click", () => showToast(`Opened ${item.name}`));
    searchResults.appendChild(card);
  });
}

function buildCharts() {
  const institutionCtx = document.getElementById("institutionChart");
  const fieldCtx = document.getElementById("fieldChart");

  if (institutionChart) institutionChart.destroy();
  if (fieldChart) fieldChart.destroy();

  institutionChart = new Chart(institutionCtx, {
    type: "line",
    data: {
      labels: mockData.institutions.map((i) => i.name),
      datasets: [
        {
          label: "AI Integration Index",
          data: mockData.institutions.map((i) => i.usage),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          tension: 0.38,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 1100, easing: "easeOutQuart" },
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(120,120,120,0.2)" } },
      },
    },
  });

  fieldChart = new Chart(fieldCtx, {
    type: "pie",
    data: {
      labels: mockData.fields.map((f) => f.name),
      datasets: [
        {
          label: "AI Activity",
          data: mockData.fields.map((f) => f.usage),
          backgroundColor: [
            "#2563eb",
            "#0ea5e9",
            "#06b6d4",
            "#14b8a6",
            "#8b5cf6",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutExpo" },
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, boxWidth: 10, color: "#374151" },
        },
      },
    },
  });
}

function loadDashboard() {
  renderInstitutionList();
  renderSearchResults();
  buildCharts();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!validateLogin(username, password)) {
    loginMessage.textContent = "Invalid credentials. Try admin / admin123.";
    loginMessage.className = "status error";
    return;
  }

  localStorage.setItem("edin_session", "active");
  loginMessage.textContent = "Login successful. Redirecting to dashboard...";
  loginMessage.className = "status success";

  setTimeout(() => {
    setView(true);
    loadDashboard();
    showToast("Welcome to EdIn");
  }, 450);
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("edin_session");
  setView(false);
  loginForm.reset();
  loginMessage.textContent = "";
  showToast("Logged out");
});

searchInput.addEventListener("input", (event) => {
  renderSearchResults(event.target.value);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("edin_theme", dark ? "dark" : "light");
  themeToggle.innerHTML = `<span>${dark ? "Dark" : "Light"}</span>`;
  buildCharts();
});

document.querySelectorAll(".nav-btn:not(.danger)").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    showToast(`${btn.textContent.trim()} section loaded`);
  });
});

(function init() {
  const savedTheme = localStorage.getItem("edin_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerHTML = "<span>Dark</span>";
  }

  const hasSession = localStorage.getItem("edin_session") === "active";
  setView(hasSession);
  if (hasSession) loadDashboard();
})();
