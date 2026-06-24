---
name: concert-search
description: >-
  Search for ongoing and upcoming music concerts, gigs, festivals, and live music events
  in cities like Stockholm, Berlin, London, Paris. Can query Ticketmaster API or use web search fallback.
---

# Concert Search Skill

Use this skill when the user asks for ongoing, upcoming, or live concerts, gigs, festivals, or music events in a city (specifically Stockholm, Berlin, London, Paris, or any other global city).

## Prerequisites

1.  **Ticketmaster API Key (Optional)**: Can be set in the environment variable `TICKETMASTER_API_KEY` for direct structured API access.
2.  **Notion API Token (Optional)**: Set `NOTION_TOKEN` in environment variables to allow pushing lists to a Notion workspace.
3.  **`uv`**: Useful for running helper Python scripts.

## Core Rules

1.  **Check API Capability First**: Always run the helper script `scripts/concert_fetcher.py` using `uv` to see if a Ticketmaster API key is available.
2.  **Web Search Fallback**: If the helper script exits with `STATUS: NO_API_KEY`, you must fallback to using the `search_web` tool.
3.  **No Hallucinations**: Only list actual concerts returned by the API or the web search results. Do not make up dates, artists, or venues.
4.  **Chronological Sorting**: Always list concerts in chronological order.
5.  **Clean Presentation**: Present the concerts in a neat Markdown table.
6.  **Notion Sync**: If `NOTION_TOKEN` is set, or if the user requests pushing to Notion:
    - Save the retrieved concerts as a JSON list in `scratch/concerts.json`.
    - Run the `scripts/notion_helper.py` script to upload the events list.

## Workflows

### Workflow A: Ticketmaster API (Key Available)

If `TICKETMASTER_API_KEY` is present in the environment:
1. Run the Python helper script to fetch concerts and optionally save to JSON:
   ```bash
   uv run .agents/skills/concert_search/scripts/concert_fetcher.py "Stockholm" --save-json "scratch/concerts.json"
   ```
2. Display the output directly.
3. If Notion sync is requested or `NOTION_TOKEN` is present, proceed to the **Notion Sync Workflow**.

### Workflow B: Web Search Fallback (Key NOT Available)

If the script indicates `STATUS: NO_API_KEY`, execute the following search steps:

1.  **Formulate Web Search Queries**:
    Identify the current month and year (e.g., from the conversation metadata) and use queries like:
    - `concerts in [city] [month] [year]`
    - `live music gigs [city] [month] [year]`
    - `music festivals in [city] [year]`
2.  **Extract Event Information**:
    From the search results, extract:
    - Event Date
    - Artist / Band Name
    - Venue Name
    - Music Genre or Type (if specified)
    - Link or Ticketing Source
3.  **Format and Present**:
    Compile the extracted events into a structured Markdown table.
4.  **Save for Notion (Optional)**:
    If Notion sync is requested or `NOTION_TOKEN` is present:
    - Create a JSON array representing the concerts at `scratch/concerts.json` using the format:
      ```json
      [
        {
          "date": "YYYY-MM-DD",
          "artist": "Artist Name",
          "venue": "Venue Name",
          "genre": "Genre",
          "link": "Ticket URL"
        }
      ]
      ```
    - Proceed to the **Notion Sync Workflow**.

### Notion Sync Workflow

If the events list has been exported to `scratch/concerts.json` and a Notion push is required:
1. Ensure the user has shared at least one parent page with the Notion Integration.
2. Run the Notion helper script:
   ```bash
   uv run .agents/skills/concert_search/scripts/notion_helper.py "[city]" "scratch/concerts.json"
   ```

## Example Command Execution

To fetch and save to JSON:
```bash
uv run .agents/skills/concert_search/scripts/concert_fetcher.py "Berlin" --save-json "scratch/concerts.json"
```

To sync the saved JSON to Notion:
```bash
uv run .agents/skills/concert_search/scripts/notion_helper.py "Berlin" "scratch/concerts.json"
```

## Interactive Dashboard

The workspace contains a local, interactive Web Dashboard to explore concerts visually.
The files are:
*   [index.html](file:///C:/Users/GokTen/Documents/GT-Docs/SKiLLS/Concerts/index.html) — Structure and semantic elements.
*   [style.css](file:///C:/Users/GokTen/Documents/GT-Docs/SKiLLS/Concerts/style.css) — Dark mode layout, custom slider, animations.
*   [app.js](file:///C:/Users/GokTen/Documents/GT-Docs/SKiLLS/Concerts/app.js) — Filters, chart rendering, card list logic.
*   [data/concerts.json](file:///C:/Users/GokTen/Documents/GT-Docs/SKiLLS/Concerts/data/concerts.json) — Local database for dashboard.

### How to Run:
Run the helper Python script in the workspace root:
```bash
python run_dashboard.py
```
This starts an HTTP server at `http://localhost:8000` and opens the dashboard in your default browser.

## Common Mistakes

-   **Listing Outdated Concerts**: Always pay attention to the current date/year in the system prompt metadata and make sure the concerts are either current or upcoming, not past.
-   **Missing Venue/Dates**: If search results are missing a venue or date, check another search result or omit the entry rather than making it up.
-   **Static Links**: Do not output dummy links like `[Tickets](https://example.com)`. If a real ticketing link is not present in the search summary, link to a major venue page or a reliable ticket listing site like Ticketmaster or Songkick.
-   **Failing on Empty Notion Pages**: The Notion Integration token must have access to at least one page in your Notion workspace. Make sure you have shared the parent page with your integration before running the sync.
-   **Dashboard Out of Sync**: The dashboard reads from `data/concerts.json`. If you fetch new data using the scripts, save the output as `data/concerts.json` so the dashboard picks up your updates.


