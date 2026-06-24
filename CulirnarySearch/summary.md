# CulinarySearch Multi-Agent Pipeline Simulator & Interactive Dashboard

This project is a high-fidelity interactive simulation of a 5-agent sequential dining concierge pipeline. It discovers, scores, plans logistics for, and renders local culinary venues.

## 🗂️ Project Layout

All files are located in the project root:
* [index.html](file:///C:/Users/GokTen/Documents/Github/AgenticAISooezy/CulirnarySearch/index.html) — Main application page containing parameter inputs, sequential agent handoff monitor, terminal logs console, SVG charts, and interactive canvas maps.
* [style.css](file:///C:/Users/GokTen/Documents/Github/AgenticAISooezy/CulirnarySearch/style.css) — Custom stylesheet utilizing modern glassmorphism, responsive grids, and CSS transitions.
* [data.js](file:///C:/Users/GokTen/Documents/Github/AgenticAISooezy/CulirnarySearch/data.js) — The engine simulating the sequential flow, quality check rules, and scoring logic of the 5-agent pipeline.
* [app.js](file:///C:/Users/GokTen/Documents/Github/AgenticAISooezy/CulirnarySearch/app.js) — Controller logic bridging user input controls (radius slider, filters) directly to SVG charts, map drawing vectors, roulette selector, and poll simulator.

---

## ⚙️ Multi-Agent Architecture Simulation

When you click **"Execute Multi-Agent Pipeline"**, the system plays out a step-by-step visual handshake between the following agents:

```
[User Request]
       │
       ▼
01_scout_agent ──────────► Crawls local venues in a 5km radius scope.
       │
       ▼
02_ranking_agent ─────────► Filters closures & computes composite scores.
       │
       ▼
03_logistics_agent ───────► Appends walking, transit, wait times, & access.
       │
       ▼
00_orchestrator_agent ────► Synthesizes final guide markdown based on tone.
       │
       ▼
04_dashboard_agent ───────► Renders interactive charts, maps, & logs.
```

### Agent Roles Played in the Engine:
1. **`01_scout_agent` (Culinary Scout)**: Geolocation scanning. Triggered via epicenter coordinates. Radius expands by 1km if fewer than 3 venues are found.
2. **`02_ranking_agent` (Data Analyst)**: Screens out temporary closures. Computes a composite rating (out of 10) by weighting raw Google ratings (50%), review velocity (20%), and dining intent relevance (30%).
3. **`03_logistics_agent` (Concierge)**: Generates walking/driving/transit estimations, booking info, and highlights accessibility parameters.
4. **`00_orchestrator_agent` (Orchestrator)**: Formats the final text guide adapting tone to user request (casual/quick vs elegant date night).
5. **`04_dashboard_agent` (UX/UI)**: Maps the backend payload dynamically to the interactive cards, Canvas map coordinates, and SVG visual charts.

---

## 🚀 How to Run

The application runs entirely offline. Because the files load local resources through standard script bindings, you can open and run it directly by double-clicking the [index.html](file:///C:/Users/GokTen/Documents/Github/AgenticAISooezy/CulirnarySearch/index.html) file in any modern web browser without encountering CORS blocks.
