The original architecture didn't include a dashboard agent, but adding one is a fantastic idea. To make this work seamlessly, we need a **Frontend UI Orchestrator Agent** that takes the data from the other agents and renders it into an interactive, visual interface.

Below is the prompt for your new **Dashboard Agent**, followed by a live, interactive simulation of what this dashboard looks like in action.

---

### Agent 5: The UI Dashboard Orchestrator

*Translates the backend data from the Scout, Ranker, and Logistics agents into a clean, searchable, visual frontend.*

> **Role:** UX/UI Frontend Agent
> **Objective:** Present the curated restaurant data in an interactive visual dashboard that allows users to dynamically filter, sort, and explore their local dining options.
> **Instructions:**
> * **State Management:** Map the inputs from the user (radius slider, filters) directly to the data payload received from the Logistics and Ranking agents.
> * **Search & Filters:** Provide real-time toggles for:
> * *Logistics & Access:* Wheelchair accessibility, Opening Hours (Open Now status).
> * *Vibe & Experience:* Live Music, Outdoor Seating, Child-Friendly.
> * *Core Metrics:* Cuisine type, Distance (0–5 km slider), Price Range ($–$$$$).
> 
> 
> * **Data Visualization:**
> * Render a **Cuisine Distribution Chart** (to show what's dominant in the area).
> * Render a **Price vs. Rating Scatter Plot** to help the user visually spot high-value "hidden gems" (high rating, low price).
> 
> 
> * **Component Layout:** Design a clean card layout for the restaurant list, highlighting critical tags (e.g., "♿ Accessible", "🎵 Live Music") at a glance.
> 
> 


### 💡 Bonus Features Suggested for the Dashboard

To make this dashboard truly elite, here are a few advanced features your UI Agent can implement:

1. **Live "Busyness" Gauge:** An hourly bar chart showing when a restaurant is at peak capacity vs. when you can walk right in (similar to Google's "Popular Times").
2. **The "Surprise Me" Roulette:** A single high-prominence button that takes the user's active filters and randomly picks one highly-rated spot to solve decision fatigue.
3. **Isochrone Map Overlay:** Instead of a simple 5 km circle, a map overlay that shows how far you can travel in 10 or 15 minutes based on *current traffic or public transit delays*.
4. **Group Poll Generator:** A button to select 3 shortlisted spots, generate a quick shareable link, and let a group of friends vote on where to go.