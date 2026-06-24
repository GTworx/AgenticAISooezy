// Application State
let appState = {
  currentPayload: null,
  filteredRestaurants: [],
  activeFilters: {
    radius: 5.0,
    prices: ["$", "$$", "$$$", "$$$$"],
    cuisines: [],
    accessible: false,
    openNow: false,
    liveMusic: false,
    outdoorSeating: false,
    childFriendly: false
  },
  selectedRestaurantId: null,
  mapCanvas: null,
  mapCtx: null,
  mapScale: 40, // pixels per km
  pollVotes: [0, 0, 0]
};

// DOM Elements
const locationInput = document.getElementById("location-input");
const cuisineSelect = document.getElementById("cuisine-select");
const occasionSelect = document.getElementById("occasion-select");
const timeInput = document.getElementById("time-input");
const runBtn = document.getElementById("run-pipeline-btn");
const presetBtns = document.querySelectorAll(".preset-btn");
const consoleLogs = document.getElementById("console-logs");
const clearConsoleBtn = document.getElementById("clear-console-btn");

const dashboardTabBtn = document.querySelector('[data-tab="dashboard-tab"]');
const guideTabBtn = document.getElementById("guide-tab-btn");
const schemaTabBtn = document.getElementById("schema-tab-btn");
const tabBtns = document.querySelectorAll(".tab-nav .tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

const splashScreen = document.getElementById("dashboard-splash");
const dashboardContent = document.getElementById("dashboard-content");

const surpriseBtn = document.getElementById("surprise-btn");
const pollBtn = document.getElementById("poll-btn");
const resultsCount = document.getElementById("results-count");
const restaurantsGrid = document.getElementById("restaurants-grid");

// Filter Inputs
const filterRadius = document.getElementById("filter-radius");
const radiusVal = document.getElementById("radius-val");
const priceBtns = document.querySelectorAll(".price-btn");
const filterCuisinesContainer = document.getElementById("filter-cuisines");
const toggleAccessible = document.getElementById("toggle-accessible");
const toggleOpen = document.getElementById("toggle-open");
const toggleMusic = document.getElementById("toggle-music");
const toggleOutdoor = document.getElementById("toggle-outdoor");
const toggleKids = document.getElementById("toggle-kids");
const sortSelect = document.getElementById("sort-select");

// Modals
const rouletteModal = document.getElementById("roulette-modal");
const closeRoulette = document.getElementById("close-roulette");
const spinStartBtn = document.getElementById("spin-start-btn");
const spinnerWheel = document.getElementById("spinner-wheel");
const spinResultPanel = document.getElementById("spin-result-panel");
const rouletteWinnerCard = document.getElementById("roulette-winner-card");

const pollModal = document.getElementById("poll-modal");
const closePoll = document.getElementById("close-poll");
const simulateVotesBtn = document.getElementById("simulate-votes-btn");
const resetVotesBtn = document.getElementById("reset-votes-btn");
const copyPollLinkBtn = document.getElementById("copy-poll-link-btn");
const pollNomineesContainer = document.getElementById("poll-nominees-container");

// Terminal log coloring utility
function logConsole(agent, message, type = "info") {
  const line = document.createElement("div");
  line.classList.add("console-line");
  if (agent) line.setAttribute("data-agent", agent);
  
  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${agent ? `[${agent}] ` : ''}${message}`;
  
  consoleLogs.appendChild(line);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// Preset locations selection
presetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    presetBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    locationInput.value = btn.getAttribute("data-loc");
    logConsole("SYSTEM", `Preselected location changed to: ${locationInput.value}`);
  });
});

// Clear console
clearConsoleBtn.addEventListener("click", () => {
  consoleLogs.innerHTML = "";
  logConsole("SYSTEM", "Console logs cleared.");
});

// Setup tabs navigation
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetTab = btn.getAttribute("data-tab");
    
    tabBtns.forEach(b => b.classList.remove("active"));
    tabPanes.forEach(pane => pane.classList.remove("active"));
    
    btn.classList.add("active");
    document.getElementById(targetTab).classList.add("active");

    // Redraw map if switching to dashboard tab
    if (targetTab === "dashboard-tab" && appState.currentPayload) {
      setTimeout(drawMap, 50);
    }
  });
});

// Main Pipeline Execution
document.getElementById("pipeline-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const locationVal = locationInput.value.trim();
  const cuisineVal = cuisineSelect.value;
  const occasionVal = occasionSelect.value;
  const timeVal = timeInput.value;

  if (!locationVal) return;

  // UI loading state
  runBtn.disabled = true;
  runBtn.querySelector(".btn-loader").style.display = "inline-block";
  runBtn.querySelector(".btn-text").textContent = "Executing Pipeline...";

  // Reset agent step visuals
  const steps = ["step-01", "step-02", "step-03", "step-00", "step-04"];
  steps.forEach(stepId => {
    const el = document.getElementById(stepId);
    el.className = "agent-step";
    el.querySelector(".step-status").textContent = "Idle";
  });

  // Switch to dashboard tab and show splash awaiting
  dashboardTabBtn.click();
  splashScreen.classList.remove("hidden");
  dashboardContent.classList.add("hidden");

  logConsole("SYSTEM", `Starting sequential agent handshake pipeline for "${locationVal}"...`);

  try {
    // Generate pipeline content using the global simulatePipeline
    const result = window.simulatePipeline(locationVal, cuisineVal, occasionVal, timeVal);
    
    // Asynchronous step simulator to wow the user
    await runAgentStepSimulation("step-01", result.logs.filter(l => l.agent === "01_scout_agent"), 900);
    await runAgentStepSimulation("step-02", result.logs.filter(l => l.agent === "02_ranking_agent"), 800);
    await runAgentStepSimulation("step-03", result.logs.filter(l => l.agent === "03_logistics_agent"), 800);
    await runAgentStepSimulation("step-00", result.logs.filter(l => l.agent === "00_orchestrator_agent"), 900);
    await runAgentStepSimulation("step-04", result.logs.filter(l => l.agent === "04_dashboard_agent"), 600);

    // Save outputs to appState
    appState.currentPayload = result.payload;
    
    // Unlock UI components
    guideTabBtn.disabled = false;
    schemaTabBtn.disabled = false;
    surpriseBtn.disabled = false;
    pollBtn.disabled = false;

    // Reset filtering states
    const defaultCuisines = [...new Set(result.payload.scout_output.raw_discovery_log.map(r => r.cuisine_type))];
    appState.activeFilters = {
      radius: 5.0,
      prices: ["$", "$$", "$$$", "$$$$"],
      cuisines: defaultCuisines,
      accessible: false,
      openNow: false,
      liveMusic: false,
      outdoorSeating: false,
      childFriendly: false
    };

    // Populate filter panel options
    initializeFilters(defaultCuisines);

    // Populate Guide and JSON code panes
    populateGuideView(result.payload.final_guide.curated_dining_guide);
    populateSchemaView(result.payload);

    // Initial render
    applyFiltersAndRender();

    // Transition splash out
    splashScreen.classList.add("hidden");
    dashboardContent.classList.remove("hidden");
    logConsole("SYSTEM", "Dining dashboard synthesized successfully. Map is active.");

    // Draw Map
    setTimeout(initMapCanvas, 100);

  } catch (err) {
    console.error(err);
    logConsole("SYSTEM", `CRITICAL PIPELINE ERROR: ${err.message}`, "error");
  } finally {
    runBtn.disabled = false;
    runBtn.querySelector(".btn-loader").style.display = "none";
    runBtn.querySelector(".btn-text").textContent = "Execute Multi-Agent Pipeline";
  }
});

// Simulate step completion delay
function runAgentStepSimulation(stepId, agentLogs, delay) {
  return new Promise((resolve) => {
    const el = document.getElementById(stepId);
    el.classList.add("active");
    el.querySelector(".step-status").textContent = "Running";

    // Play logs sequentially
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < agentLogs.length) {
        const l = agentLogs[logIndex];
        logConsole(l.agent, l.message);
        logIndex++;
      }
    }, delay / Math.max(1, agentLogs.length));

    setTimeout(() => {
      clearInterval(logInterval);
      // Catch up any remaining logs
      while (logIndex < agentLogs.length) {
        const l = agentLogs[logIndex];
        logConsole(l.agent, l.message);
        logIndex++;
      }
      
      el.classList.remove("active");
      el.classList.add("completed");
      el.querySelector(".step-status").textContent = "Success";
      resolve();
    }, delay);
  });
}

// Initialise Filters Controls
function initializeFilters(cuisines) {
  // Radius
  filterRadius.value = 5.0;
  radiusVal.textContent = "5.0 km";
  
  // Prices
  priceBtns.forEach(btn => btn.classList.add("active"));
  
  // Toggles
  toggleAccessible.checked = false;
  toggleOpen.checked = false;
  toggleMusic.checked = false;
  toggleOutdoor.checked = false;
  toggleKids.checked = false;

  // Cuisines list
  filterCuisinesContainer.innerHTML = "";
  cuisines.forEach(c => {
    const chip = document.createElement("button");
    chip.className = "cuisine-chip active";
    chip.textContent = c;
    chip.setAttribute("data-cuisine", c);
    
    chip.addEventListener("click", () => {
      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        appState.activeFilters.cuisines = appState.activeFilters.cuisines.filter(item => item !== c);
      } else {
        chip.classList.add("active");
        appState.activeFilters.cuisines.push(c);
      }
      applyFiltersAndRender();
    });
    
    filterCuisinesContainer.appendChild(chip);
  });
}

// Map real-time input change listeners
filterRadius.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  radiusVal.textContent = `${val.toFixed(1)} km`;
  appState.activeFilters.radius = val;
  applyFiltersAndRender();
});

priceBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const price = btn.getAttribute("data-price");
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
      appState.activeFilters.prices = appState.activeFilters.prices.filter(p => p !== price);
    } else {
      btn.classList.add("active");
      appState.activeFilters.prices.push(price);
    }
    applyFiltersAndRender();
  });
});

[toggleAccessible, toggleOpen, toggleMusic, toggleOutdoor, toggleKids].forEach(el => {
  el.addEventListener("change", () => {
    appState.activeFilters.accessible = toggleAccessible.checked;
    appState.activeFilters.openNow = toggleOpen.checked;
    appState.activeFilters.liveMusic = toggleMusic.checked;
    appState.activeFilters.outdoorSeating = toggleOutdoor.checked;
    appState.activeFilters.childFriendly = toggleKids.checked;
    applyFiltersAndRender();
  });
});

sortSelect.addEventListener("change", () => {
  applyFiltersAndRender();
});

// Dynamic filtering logic matching standard state operations
function applyFiltersAndRender() {
  if (!appState.currentPayload) return;

  const logs = appState.currentPayload.logistics_output.operational_logs;
  const ranks = appState.currentPayload.ranking_output.ranked_shortlist;
  const scouts = appState.currentPayload.scout_output.raw_discovery_log;
  const pickName = appState.currentPayload.final_guide.scouts_pick.name;

  // Match operational log properties with ranking scores and tags
  let list = ranks.map(rankItem => {
    const logItem = logs.find(l => l.name === rankItem.name);
    const scoutItem = scouts.find(s => s.name === rankItem.name);

    return {
      ...rankItem,
      logistics: logItem,
      scout: scoutItem,
      isPick: rankItem.name === pickName
    };
  });

  // Apply filters
  list = list.filter(item => {
    // Radius filter (compared to raw distance generated in scout stage)
    if (item.scout.distance_km > appState.activeFilters.radius) return false;

    // Price filter
    if (!appState.activeFilters.prices.includes(item.scout.price_range)) return false;

    // Cuisine filter
    if (!appState.activeFilters.cuisines.includes(item.scout.cuisine_type)) return false;

    // Logistics toggles
    if (appState.activeFilters.accessible && !item.logistics.wheelchair_accessible) return false;
    if (appState.activeFilters.openNow && item.logistics.current_status !== "open") return false;
    if (appState.activeFilters.liveMusic && !item.logistics.live_music) return false;
    if (appState.activeFilters.outdoorSeating && !item.logistics.outdoor_seating) return false;
    if (appState.activeFilters.childFriendly && !item.logistics.child_friendly) return false;

    return true;
  });

  // Sort shortlist
  const sortBy = sortSelect.value;
  if (sortBy === "composite") {
    list.sort((a, b) => b.composite_score - a.composite_score);
  } else if (sortBy === "distance") {
    list.sort((a, b) => a.scout.distance_km - b.scout.distance_km);
  } else if (sortBy === "rating") {
    list.sort((a, b) => b.average_rating - a.average_rating);
  } else if (sortBy === "walking") {
    list.sort((a, b) => a.logistics.travel_times.walking_minutes - b.logistics.travel_times.walking_minutes);
  }

  appState.filteredRestaurants = list;
  resultsCount.textContent = `${list.length} Restaurants`;

  // Render cards
  renderRestaurantCards();

  // Render visual graphs
  renderCuisineDistributionChart();
  renderScatterPlot();

  // Redraw canvas map
  drawMap();
}

// Render list cards in HTML matching 04_dashboard_agent card spec
function renderRestaurantCards() {
  restaurantsGrid.innerHTML = "";

  if (appState.filteredRestaurants.length === 0) {
    restaurantsGrid.innerHTML = `
      <div class="no-results-panel">
        <p>No restaurants match your active criteria.</p>
        <span>Try adjusting the sliders or tags to widen your search.</span>
      </div>
    `;
    return;
  }

  appState.filteredRestaurants.forEach(item => {
    const card = document.createElement("div");
    card.className = `restaurant-card ${item.isPick ? 'is-pick' : ''}`;
    card.setAttribute("data-name", item.name);
    if (appState.selectedRestaurantId === item.name) {
      card.classList.add("highlighted");
    }

    // Interactive event to focus maps
    card.addEventListener("click", () => {
      appState.selectedRestaurantId = item.name;
      document.querySelectorAll(".restaurant-card").forEach(c => c.classList.remove("highlighted"));
      card.classList.add("highlighted");
      drawMap(); // redraw to highlight pin
    });

    const isCurrentHourBusy = new Date().getHours();
    // Render busyness bars
    let barsHtml = "";
    item.logistics.hourly_busyness.forEach((val, idx) => {
      const isCurrent = (idx + 11) === isCurrentHourBusy; // roughly mapping indices to operational hours
      barsHtml += `<div class="busy-bar ${isCurrent ? 'current' : ''}" style="height: ${val}%" title="${idx + 11}:00 - Capacity: ${val}%"></div>`;
    });

    // Subcomponents layout
    card.innerHTML = `
      <div class="card-top-row">
        <div class="rank-title">
          <span class="rank-badge">${item.rank}</span>
          <h3 class="rest-name">${item.name}</h3>
        </div>
        <div class="rating-badge">⭐ ${item.average_rating}</div>
      </div>
      
      <div class="rest-meta">
        <span class="rest-cuisine">${item.scout.cuisine_type}</span>
        <span>•</span>
        <span>${item.scout.price_range}</span>
        <span>•</span>
        <span>📍 ${item.scout.distance_km} km</span>
      </div>

      <p class="rest-desc">"${item.rationale}"</p>

      <div class="transit-times-row">
        <div class="transit-item" title="Walking Travel Time">
          <span>🚶 ${item.logistics.travel_times.walking_minutes}m</span>
          Walk
        </div>
        <div class="transit-item" title="Public Transit Time">
          <span>🚇 ${item.logistics.travel_times.transit_minutes}m</span>
          Transit
        </div>
        <div class="transit-item" title="Driving Travel Time">
          <span>🚗 ${item.logistics.travel_times.driving_minutes}m</span>
          Drive
        </div>
      </div>

      <div class="rest-tags">
        ${item.logistics.wheelchair_accessible ? '<span class="tag-badge active">♿ Accessible</span>' : ''}
        ${item.logistics.outdoor_seating ? '<span class="tag-badge active">🌿 Outdoor</span>' : ''}
        ${item.logistics.live_music ? '<span class="tag-badge active">🎵 Live Music</span>' : ''}
        ${item.logistics.child_friendly ? '<span class="tag-badge active">👶 Child-Friendly</span>' : ''}
      </div>

      <div class="busyness-panel">
        <div class="busyness-title">Live Capacity Distribution (11am - 10pm)</div>
        <div class="busyness-bar-chart">
          ${barsHtml}
        </div>
        <div class="busy-label-row">
          <span>11 AM</span>
          <span>5 PM</span>
          <span>10 PM</span>
        </div>
      </div>

      <div class="card-bottom-row">
        <div class="reserve-info">
          <span>Policy:</span>
          <span class="reserve-policy">${item.logistics.reservation_policy}</span>
        </div>
        <span class="contact-info">${item.logistics.booking_contact}</span>
      </div>
    `;

    restaurantsGrid.appendChild(card);
  });
}

// Markdown Synthesis Parser (Simple HTML parser)
function populateGuideView(mdText) {
  const view = document.getElementById("guide-content-view");
  
  // Basic markdown tags replacement
  let html = mdText
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/\n/gim, '<br>');

  view.innerHTML = html;
}

// Code Syntax View
function populateSchemaView(payload) {
  const view = document.getElementById("schema-json-view");
  view.textContent = JSON.stringify(payload, null, 2);
}

// Setup Canvas Map
function initMapCanvas() {
  const canvas = document.getElementById("isochrone-map");
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight || 320;
  
  appState.mapCanvas = canvas;
  appState.mapCtx = canvas.getContext("2d");
  
  drawMap();
}

// Draw dynamic travel-time boundaries and pins
function drawMap() {
  if (!appState.mapCanvas || !appState.mapCtx || !appState.currentPayload) return;

  const ctx = appState.mapCtx;
  const canvas = appState.mapCanvas;
  const centerLat = 40.7308;
  const centerLng = -74.0028;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  // Set scale based on filter radius
  const maxR = appState.activeFilters.radius;
  appState.mapScale = (Math.min(cx, cy) * 0.8) / maxR;

  // Draw Grid Lines
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for (let j = 0; j < canvas.height; j += 40) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
  }

  // Draw 5km Search Scope Outer Boundary
  ctx.strokeStyle = "rgba(0, 242, 254, 0.15)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(cx, cy, 5.0 * appState.mapScale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Active Radius Boundary (User filter slider)
  ctx.fillStyle = "rgba(0, 242, 254, 0.03)";
  ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR * appState.mapScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw 10m Isochrone travel boundary (Simulated polygon shape)
  ctx.fillStyle = "rgba(138, 43, 226, 0.09)";
  ctx.strokeStyle = "rgba(138, 43, 226, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const points = 12;
  const seedString = appState.currentPayload.pipeline_metadata.epicenter.neighborhood;
  let angleStep = (Math.PI * 2) / points;
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const walkDist = 0.95 + Math.sin(angle * 3 + seedString.length) * 0.25; 
    const px = cx + walkDist * appState.mapScale * Math.cos(angle);
    const py = cy + walkDist * appState.mapScale * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw Epicenter Center Marker
  ctx.fillStyle = "#00f2fe";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00f2fe";
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw Restaurant pins
  appState.filteredRestaurants.forEach(item => {
    const seed = item.name.charCodeAt(0) + item.name.charCodeAt(item.name.length - 1);
    const angle = (seed % 360) * Math.PI / 180;
    const px = cx + item.scout.distance_km * appState.mapScale * Math.cos(angle);
    const py = cy + item.scout.distance_km * appState.mapScale * Math.sin(angle);

    const isSelected = appState.selectedRestaurantId === item.name;

    ctx.save();
    
    if (item.isPick) {
      ctx.fillStyle = "gold";
      ctx.shadowColor = "gold";
      ctx.shadowBlur = isSelected ? 15 : 6;
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = isSelected ? "#00f2fe" : "#9ea2c0";
      ctx.shadowColor = isSelected ? "#00f2fe" : "transparent";
      ctx.shadowBlur = isSelected ? 12 : 0;
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#14151f";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (isSelected || item.isPick) {
      ctx.fillStyle = "#f5f6f9";
      ctx.font = "bold 9px var(--font-title)";
      ctx.fillText(item.name, px + 8, py - 4);
    }
    
    ctx.restore();
  });
}

// Window resizing
window.addEventListener("resize", () => {
  if (appState.mapCanvas) {
    appState.mapCanvas.width = appState.mapCanvas.parentElement.clientWidth;
    appState.mapCanvas.height = appState.mapCanvas.parentElement.clientHeight || 320;
    drawMap();
  }
});

// Render Visual Charts via pure SVGs
function renderCuisineDistributionChart() {
  const container = document.getElementById("cuisine-chart-container");
  container.innerHTML = "";

  const list = appState.filteredRestaurants;
  if (list.length === 0) {
    container.textContent = "No data to display";
    return;
  }

  const counts = {};
  list.forEach(r => {
    counts[r.scout.cuisine_type] = (counts[r.scout.cuisine_type] || 0) + 1;
  });

  const keys = Object.keys(counts);
  const data = keys.map(k => ({ label: k, count: counts[k] }));
  const colors = ["#00f2fe", "#ff007f", "#ff8c00", "#00ffcc", "#8a2be2", "#4facfe", "#e100ff"];

  let svgContent = `<svg viewBox="0 0 200 200" class="chart-svg">`;
  let cumulativePercent = 0;
  const total = list.length;
  
  data.forEach((d, idx) => {
    const percent = d.count / total;
    const color = colors[idx % colors.length];
    
    if (percent === 1) {
      svgContent += `<circle cx="100" cy="100" r="60" fill="transparent" stroke="${color}" stroke-width="24"></circle>`;
    } else {
      const x1 = 100 + 60 * Math.cos(2 * Math.PI * cumulativePercent);
      const y1 = 100 + 60 * Math.sin(2 * Math.PI * cumulativePercent);
      cumulativePercent += percent;
      const x2 = 100 + 60 * Math.cos(2 * Math.PI * cumulativePercent);
      const y2 = 100 + 60 * Math.sin(2 * Math.PI * cumulativePercent);
      
      const largeArc = percent > 0.5 ? 1 : 0;
      
      svgContent += `
        <path d="M ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2}" 
              fill="transparent" 
              stroke="${color}" 
              stroke-width="24"
              class="donut-slice"
              style="transition: stroke 0.3s;"
              title="${d.label}: ${d.count}">
        </path>
      `;
    }
  });

  svgContent += `
    <circle cx="100" cy="100" r="48" fill="#14151f"></circle>
    <text x="100" y="98" text-anchor="middle" fill="#f5f6f9" font-size="16" font-family="Outfit" font-weight="700">${total}</text>
    <text x="100" y="112" text-anchor="middle" fill="#676b8a" font-size="8" font-family="Plus Jakarta Sans" font-weight="600" letter-spacing="1">TOTAL SPOTS</text>
  `;
  svgContent += `</svg>`;

  let legendHtml = `<div class="chart-legend-box" style="margin-left: 20px; font-size: 0.7rem; display: flex; flex-direction: column; gap: 8px;">`;
  data.forEach((d, idx) => {
    const color = colors[idx % colors.length];
    legendHtml += `
      <div style="display: flex; align-items: center; gap: 8px; color: #9ea2c0">
        <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background-color:${color}"></span>
        <span>${d.label} (${d.count})</span>
      </div>
    `;
  });
  legendHtml += `</div>`;

  container.innerHTML = `
    <div style="display: flex; align-items: center; width: 100%; height: 100%; padding: 10px;">
      <div style="width: 140px; height: 140px;">${svgContent}</div>
      ${legendHtml}
    </div>
  `;
}

function renderScatterPlot() {
  const container = document.getElementById("scatter-chart-container");
  container.innerHTML = "";

  const list = appState.filteredRestaurants;
  if (list.length === 0) {
    container.textContent = "No data to display";
    return;
  }
  
  const width = 280;
  const height = 160;
  const padding = 25;

  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">`;
  
  svgContent += `
    <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" stroke-width="1"></line>
    <line x1="${padding}" y1="${(height - padding + padding) / 2}" x2="${width - padding}" y2="${(height - padding + padding) / 2}" stroke="rgba(255,255,255,0.03)" stroke-width="1"></line>
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"></line>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"></line>
  `;

  const priceVals = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };
  const getX = (priceStr) => {
    const level = priceVals[priceStr] || 2;
    return padding + ((level - 1) / 3) * (width - padding * 2);
  };

  const getY = (score) => {
    const minS = 5.0;
    const maxS = 10.0;
    const val = Math.max(minS, Math.min(maxS, score));
    return (height - padding) - ((val - minS) / (maxS - minS)) * (height - padding * 2);
  };

  list.forEach(item => {
    const px = getX(item.scout.price_range);
    const py = getY(item.composite_score);
    
    let color = item.isPick ? "gold" : "#00f2fe";
    let size = item.isPick ? 7 : 4.5;
    let titleStr = `${item.name} (${item.scout.price_range}, Score: ${item.composite_score})`;

    svgContent += `
      <circle cx="${px}" cy="${py}" r="${size}" fill="${color}" 
              class="scatter-dot ${item.isPick ? 'pick' : ''}" 
              title="${titleStr}">
        <title>${titleStr}</title>
      </circle>
    `;
  });

  svgContent += `
    <text x="${getX('$')}" y="${height - 8}" fill="#676b8a" font-size="8" text-anchor="middle" font-family="Space Grotesk">$</text>
    <text x="${getX('$$')}" y="${height - 8}" fill="#676b8a" font-size="8" text-anchor="middle" font-family="Space Grotesk">$$</text>
    <text x="${getX('$$$')}" y="${height - 8}" fill="#676b8a" font-size="8" text-anchor="middle" font-family="Space Grotesk">$$$</text>
    <text x="${getX('$$$$')}" y="${height - 8}" fill="#676b8a" font-size="8" text-anchor="middle" font-family="Space Grotesk">$$$$</text>
    
    <text x="5" y="${height / 2}" fill="#676b8a" font-size="8" text-anchor="middle" transform="rotate(-90 5 ${height / 2})" font-family="Space Grotesk">SCORE</text>
    <text x="${width / 2}" y="${height - 2}" fill="#676b8a" font-size="7" text-anchor="middle" letter-spacing="0.5" font-family="Space Grotesk">PRICE RANGE</text>
  `;

  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

// "Surprise Me" roulette module
surpriseBtn.addEventListener("click", () => {
  const options = appState.filteredRestaurants;
  if (options.length === 0) {
    logConsole("SYSTEM", "Roulette cancelled: No matching restaurants are loaded.", "warning");
    return;
  }

  rouletteModal.style.display = "flex";
  spinResultPanel.classList.add("hidden");
  spinnerWheel.style.transform = "rotate(0deg)";
  spinnerWheel.innerHTML = "";

  const sliceAngle = 360 / options.length;
  const colors = ["#ff007f", "#8a2be2", "#00ffcc", "#00f2fe", "#ff8c00", "#e100ff"];

  options.forEach((opt, idx) => {
    const slice = document.createElement("div");
    slice.className = "spinner-slice";
    slice.style.backgroundColor = colors[idx % colors.length];
    slice.style.transform = `rotate(${idx * sliceAngle}deg) skewY(${90 - sliceAngle}deg)`;
    
    const textNode = document.createElement("span");
    textNode.textContent = opt.name.length > 15 ? opt.name.substring(0, 15) + "..." : opt.name;
    textNode.style.transform = `skewY(${-(90 - sliceAngle)}deg) rotate(${sliceAngle / 2} - 10deg) translate(25px, 20px)`;
    textNode.style.display = "inline-block";
    textNode.style.position = "absolute";
    textNode.style.color = "#000";
    
    slice.appendChild(textNode);
    spinnerWheel.appendChild(slice);
  });

  spinStartBtn.onclick = () => {
    spinStartBtn.disabled = true;
    
    const randomRotations = 10 + Math.floor(Math.random() * 5);
    const winningIndex = Math.floor(Math.random() * options.length);
    const targetDeg = (randomRotations * 360) - (winningIndex * sliceAngle) - (sliceAngle / 2);
    
    spinnerWheel.style.transform = `rotate(${targetDeg}deg)`;
    logConsole("04_dashboard_agent", `Roulette spinning! Choosing among ${options.length} candidates...`);

    setTimeout(() => {
      spinStartBtn.disabled = false;
      const winner = options[winningIndex];
      logConsole("04_dashboard_agent", `Roulette Winner Surfaced: "${winner.name}"!`);
      
      spinResultPanel.classList.remove("hidden");
      rouletteWinnerCard.innerHTML = `
        <div class="restaurant-card highlighted" style="background-color: rgba(255,255,255,0.03); margin-top:10px;">
          <div class="card-top-row">
            <h3 class="rest-name">⭐ ${winner.name}</h3>
            <span class="rating-badge">${winner.composite_score}/10</span>
          </div>
          <div class="rest-meta">
            <span>${winner.scout.cuisine_type}</span> | <span>${winner.scout.price_range}</span>
          </div>
          <p class="rest-desc">"${winner.rationale}"</p>
        </div>
      `;

      appState.selectedRestaurantId = winner.name;
      applyFiltersAndRender();
      
      const targetEl = document.querySelector(`.restaurant-card[data-name="${winner.name}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 5100);
  };
});

closeRoulette.addEventListener("click", () => {
  rouletteModal.style.display = "none";
});

// Group Poll Generator Module
pollBtn.addEventListener("click", () => {
  const list = appState.filteredRestaurants.slice(0, 3);
  if (list.length === 0) return;

  pollModal.style.display = "flex";
  appState.pollVotes = [0, 0, 0];
  renderPollNominees(list);
});

function renderPollNominees(list) {
  pollNomineesContainer.innerHTML = "";
  const totalVotes = appState.pollVotes.reduce((a, b) => a + b, 0);

  list.forEach((item, idx) => {
    const votes = appState.pollVotes[idx];
    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    
    const div = document.createElement("div");
    div.className = "poll-nominee";
    div.innerHTML = `
      <div class="poll-info-row">
        <span class="poll-name">${item.name} (${item.scout.cuisine_type})</span>
        <span class="poll-votes" id="vote-count-${idx}">${votes} votes (${pct}%)</span>
      </div>
      <div class="poll-progress-bg">
        <div class="poll-progress-bar" id="progress-bar-${idx}" style="width: ${pct}%"></div>
      </div>
    `;
    pollNomineesContainer.appendChild(div);
  });
}

simulateVotesBtn.onclick = () => {
  simulateVotesBtn.disabled = true;
  let ticks = 0;
  const list = appState.filteredRestaurants.slice(0, 3);
  
  logConsole("SYSTEM", "Simulating group poll votes incoming from friends...");

  const interval = setInterval(() => {
    const randIdx = Math.floor(Math.random() * list.length);
    appState.pollVotes[randIdx]++;
    
    renderPollNominees(list);
    ticks++;
    
    if (ticks >= 25) {
      clearInterval(interval);
      simulateVotesBtn.disabled = false;
      
      const maxVotes = Math.max(...appState.pollVotes);
      const winnerIdx = appState.pollVotes.indexOf(maxVotes);
      logConsole("SYSTEM", `Group Poll closed! Winning spot: "${list[winnerIdx].name}" with ${maxVotes} votes.`);
    }
  }, 100);
};

resetVotesBtn.onclick = () => {
  appState.pollVotes = [0, 0, 0];
  renderPollNominees(appState.filteredRestaurants.slice(0, 3));
};

copyPollLinkBtn.onclick = () => {
  const input = document.getElementById("poll-share-input");
  input.select();
  navigator.clipboard.writeText(input.value);
  const origText = copyPollLinkBtn.textContent;
  copyPollLinkBtn.textContent = "Copied!";
  setTimeout(() => { copyPollLinkBtn.textContent = origText; }, 1500);
};

closePoll.addEventListener("click", () => {
  pollModal.style.display = "none";
});

// Copy Guide clipboard functions
document.getElementById("copy-guide-btn").addEventListener("click", () => {
  if (appState.currentPayload) {
    navigator.clipboard.writeText(appState.currentPayload.final_guide.curated_dining_guide);
    alert("Dining Guide Markdown copied to clipboard!");
  }
});

document.getElementById("copy-json-btn").addEventListener("click", () => {
  if (appState.currentPayload) {
    navigator.clipboard.writeText(JSON.stringify(appState.currentPayload, null, 2));
    alert("JSON Schema Payload copied to clipboard!");
  }
});

window.onclick = function(e) {
  if (e.target === rouletteModal) {
    rouletteModal.style.display = "none";
  }
  if (e.target === pollModal) {
    pollModal.style.display = "none";
  }
};
