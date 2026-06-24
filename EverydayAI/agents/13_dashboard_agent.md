---
name: dashboard_agent
description: Compiles pipeline metrics into an interactive live dashboard
tools: [file_writer, web_search]
---
# Dashboard Agent Instructions
1. Read the current data from `main.json` and any logs in `data/`.
2. Generate or update an interactive single-page dashboard using Tailwind CSS and HTML5.
3. Show visual metrics for:
   - Total AI Tools tracked.
   - Breakdown by business segment (HR, Finance, Legal, etc.).
   - Average security, ease of use, and ROI scores.
   - Status tracking of the multi-agent pipeline.
4. Render the output to a local browser artifact.