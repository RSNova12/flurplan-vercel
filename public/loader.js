// 🔄 loader.js – lädt automatisch flurplan_v3.json von Vercel
const VERCEL_URL = "https://flurplan-vercel.vercel.app/flurplan_v3.json";

async function loadFlurplan() {
  try {
    const response = await fetch(VERCEL_URL);
    const data = await response.json();
    console.log("📦 Geladene Daten:", data);

    const body = document.getElementById("flurplanBody");
    const agentSelect = document.getElementById("agentSelect");
    const statusSelect = document.getElementById("statusSelect");
    const searchInput = document.getElementById("searchInput");

    const agents = [...new Set(data.map(room => room.agent))];
    agents.sort().forEach(agent => {
      const option = document.createElement("option");
      option.value = agent;
      option.textContent = agent;
      agentSelect.appendChild(option);
    });

    function render() {
      const agentFilter = agentSelect.value;
      const statusFilter = statusSelect.value;
      const searchText = searchInput.value.toLowerCase();

      const filtered = data.filter(room =>
        (agentFilter === "Alle" || room.agent === agentFilter) &&
        (statusFilter === "Alle" || room.status === statusFilter) &&
        room.title.toLowerCase().includes(searchText)
      );

      body.innerHTML = "";
      filtered.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${room.title}</td>
          <td>${room.agent}</td>
          <td>${room.status}</td>
          <td>${room.impact || "-"}</td>
          <td>${room.urgency || "-"}</td>
          <td>${room.theme || "-"}</td>
          <td>${room.location}</td>
          <td>${room.created_at}</td>
        `;
        body.appendChild(row);
      });
    }

    agentSelect.addEventListener("change", render);
    statusSelect.addEventListener("change", render);
    searchInput.addEventListener("input", render);
    render();
  } catch (err) {
    console.error("❌ Fehler beim Laden von flurplan_v3.json:", err);
  }
}

window.onload = loadFlurplan;

