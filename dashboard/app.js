// CareFlow Process Mining Dashboard - connected to generated dashboard_data.json

let transitionChart;
let variantChart;
let dashboardData = null;

const transitionLabels = {
    "Emergency Intake|Triage Assessment": "Intake ➔ Triage",
    "Triage Assessment|Vitals Measurement": "Triage ➔ Vitals",
    "Vitals Measurement|Doctor Examination": "Vitals ➔ Doctor Exam",
    "Doctor Examination|Radiology / X-Ray": "Doctor ➔ X-Ray",
    "Doctor Examination|Laboratory Test": "Doctor ➔ Lab",
    "Doctor Examination|Treatment / Medication": "Doctor ➔ Treatment",
    "Radiology / X-Ray|Intake Form Re-Triage": "X-Ray ➔ Re-Triage",
    "Intake Form Re-Triage|Doctor Examination": "Re-Triage ➔ Doctor",
    "Radiology / X-Ray|Laboratory Test": "X-Ray ➔ Lab",
    "Radiology / X-Ray|Treatment / Medication": "X-Ray ➔ Treatment",
    "Laboratory Test|Treatment / Medication": "Lab ➔ Treatment",
    "Treatment / Medication|Billing & Discharge": "Treatment ➔ Discharge"
};

document.addEventListener("DOMContentLoaded", loadDashboardData);

async function loadDashboardData() {
    try {
        const response = await fetch("dashboard_data.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        dashboardData = await response.json();

        document.querySelector(".status-badge").textContent = "● CAREFLOW DATA CONNECTED";
        updateDashboard();
    } catch (error) {
        console.error("Could not load dashboard_data.json:", error);
        document.querySelector(".status-badge").textContent = "● DATA CONNECTION ERROR";
        alert("CareFlow data could not be loaded. Run the dashboard through a local server or GitHub Pages, not by double-clicking index.html.");
    }
}


function getSelectedCases() {
    if (!dashboardData) return [];

    const doctor = document.getElementById("doctorFilter").value;
    const severity = document.getElementById("severityFilter").value;

    return dashboardData.cases.filter(c => {
        const doctorMatches =
            doctor === "ALL" ||
            doctorNameMatches(c.doctor, doctor);

        const severityMatches =
            severity === "ALL" ||
            (c.severity || "").toLowerCase() ===
            severity.toLowerCase();

        return doctorMatches && severityMatches;
    });
}

function doctorNameMatches(name, key) {
    if (!name) return false;

    const normalizedName = name.toLowerCase();

    if (key === "SMITH") return normalizedName.includes("smith");
    if (key === "PATEL") return normalizedName.includes("patel");
    if (key === "JOHNSON") return normalizedName.includes("johnson");

    return true;
}


function getFilteredEvents(selectedCases) {
    const ids = new Set(selectedCases.map(c => c.case_id));
    return dashboardData.events
        .filter(e => ids.has(e.case_id))
        .sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
}


function calculateTransitions(events) {
    const byCase = {};

    events.forEach(e => {
        if (!e.case_id) return;

        if (!byCase[e.case_id]) {
            byCase[e.case_id] = [];
        }

        byCase[e.case_id].push(e);
    });

    const groups = {};

    Object.values(byCase).forEach(path => {
        path.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        for (let i = 0; i < path.length - 1; i++) {
            const source = path[i];
            const target = path[i + 1];

            const sourceTime = new Date(source.timestamp).getTime();
            const targetTime = new Date(target.timestamp).getTime();

            if (
                !Number.isFinite(sourceTime) ||
                !Number.isFinite(targetTime) ||
                targetTime < sourceTime ||
                !source.activity_name ||
                !target.activity_name
            ) {
                continue;
            }

            const wait = (targetTime - sourceTime) / 60000;
            const key =
                `${source.activity_name}|${target.activity_name}`;

            if (!groups[key]) {
                groups[key] = { sum: 0, count: 0 };
            }

            groups[key].sum += wait;
            groups[key].count += 1;
        }
    });

    return Object.entries(groups)
        .map(([key, v]) => ({
            key,
            avg: v.count ? v.sum / v.count : 0,
            count: v.count
        }))
        .sort((a, b) => b.avg - a.avg);
}


function calculateVariants(selectedCases) {
    const counts = {};
    selectedCases.forEach(c => {
        const path = c.path_sequence;

        let label;
        if (path.includes("Intake Form Re-Triage")) {
            label = "Paperwork Loopback (Non-Compliant)";
        } else if (path.includes("Radiology / X-Ray") && path.includes("Laboratory Test")) {
            label = "Lab + X-Ray Path";
        } else if (path.includes("Radiology / X-Ray")) {
            label = "X-Ray Path (Compliant)";
        } else if (path.includes("Laboratory Test")) {
            label = "Lab Path (Compliant)";
        } else {
            label = "Standard Path (Compliant)";
        }

        counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
}

function updateDashboard() {
    const selectedCases = getSelectedCases();
    const events = getFilteredEvents(selectedCases);
    const transitions = calculateTransitions(events);
    const variants = calculateVariants(selectedCases);

    updateKPIs(selectedCases, transitions);
    renderTransitionChart(transitions);
    renderVariantChart(variants);
    updateProcessMap(transitions, selectedCases);
}

function updateKPIs(cases, transitions) {
    const total = cases.length;
    const nonCompliant = cases.filter(c =>
        c.conformance_status !== "COMPLIANT"
    ).length;
    const compliantPct = total ? ((total - nonCompliant) / total * 100) : 0;
    const nonCompliantPct = total ? (nonCompliant / total * 100) : 0;

    const bottleneck = transitions.find(t =>
        t.key === "Radiology / X-Ray|Intake Form Re-Triage"
    );

    document.querySelector(".metric-value").textContent =
        `${nonCompliantPct.toFixed(1)}%`;

    document.querySelector(".card-desc").innerHTML =
        `Patients sent from <strong>Radiology / X-Ray</strong> to <strong>Intake Form Re-Triage</strong> due to the missing-paperwork loop.`;

    document.querySelector(".roi-metric strong").textContent =
        bottleneck
            ? `${bottleneck.avg.toFixed(1)} Mins Avg Transition Delay`
            : "No bottleneck in selected data";

    document.querySelectorAll(".stat-value")[0].textContent =
        `${total.toLocaleString()} Cases`;
    document.querySelectorAll(".stat-value")[1].textContent =
        `${compliantPct.toFixed(1)}%`;
    document.querySelectorAll(".stat-value")[2].textContent =
        `${nonCompliantPct.toFixed(1)}%`;
    document.querySelectorAll(".stat-value")[3].textContent =
        "Not in raw data";
}

function renderTransitionChart(transitions) {
    const labels = transitions.map(t =>
        transitionLabels[t.key] || t.key.replace("|", " ➔ ")
    );
    const values = transitions.map(t => Number(t.avg.toFixed(1)));

    const ctx = document.getElementById("transitionChart").getContext("2d");
    if (transitionChart) transitionChart.destroy();

    transitionChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Avg Transition Duration (Minutes)",
                data: values,
                backgroundColor: values.map((_, i) =>
                    transitions[i].key === "Radiology / X-Ray|Intake Form Re-Triage"
                        ? "#ef4444" : "#3b82f6"
                ),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
                y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } }
            }
        }
    });
}

function renderVariantChart(variants) {
    const labels = Object.keys(variants);
    const values = Object.values(variants);

    const ctx = document.getElementById("variantChart").getContext("2d");
    if (variantChart) variantChart.destroy();

    variantChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: { color: "#94a3b8", font: { size: 10 } }
                }
            }
        }
    });
}

function updateProcessMap(transitions, cases) {
    const avgFor = (source, target, fallback) => {
        const found = transitions.find(t => t.key === `${source}|${target}`);
        return found ? found.avg.toFixed(1) : fallback;
    };

    const nodes = document.querySelectorAll(".flow-node");
    if (nodes.length >= 7) {
        nodes[0].innerHTML = `Emergency Intake<br><small>Avg ${avgFor("Emergency Intake","Triage Assessment","0")}m</small>`;
        nodes[1].innerHTML = `Triage Assessment<br><small>Avg ${avgFor("Triage Assessment","Vitals Measurement","0")}m</small>`;
        nodes[2].innerHTML = `Vitals Measurement<br><small>Avg ${avgFor("Vitals Measurement","Doctor Examination","0")}m</small>`;
        nodes[3].innerHTML = `Doctor Examination<br><small>Avg ${avgFor("Doctor Examination","Radiology / X-Ray","0")}m</small>`;
        nodes[4].innerHTML = `Radiology / X-Ray<br><small>Avg ${avgFor("Doctor Examination","Radiology / X-Ray","0")}m`;
        nodes[5].innerHTML = `Treatment / Meds<br><small>Avg ${avgFor("Treatment / Medication","Billing & Discharge","0")}m</small>`;
        nodes[6].innerHTML = `Billing & Discharge<br><small>Avg ${avgFor("Treatment / Medication","Billing & Discharge","0")}m</small>`;
    }

    const loop = document.querySelector(".loopback-arrow");
    const retriaged = cases.filter(c => c.conformance_status !== "COMPLIANT").length;
    const pct = cases.length ? retriaged / cases.length * 100 : 0;
    loop.innerHTML = `⤴ ${pct.toFixed(1)}% Sent to Re-Triage<br><strong>(Missing Paperwork Loop)</strong>`;
}

function applyFilters() {
    updateDashboard();
}

function runProcessDiscovery() {
    if (!dashboardData) return;
    updateDashboard();
    alert("Process discovery refreshed from the connected CareFlow event data.");
}
