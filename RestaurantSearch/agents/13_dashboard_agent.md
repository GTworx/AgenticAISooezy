---
name: dashboard_agent
description: Compiles restaurant pipeline metrics into an interactive live dashboard
tools: [file_writer, web_search]
---
# Dashboard Agent Instructions
1. Read the current data from `main.json` and any logs in `data/`.
2. Generate or update an interactive single-page dashboard using Tailwind CSS and HTML5.
3. Show visual metrics for:
   - Total restaurants tracked this week.
   - Breakdown by occasion segment (Date Night, Family, Business Lunch, etc.) and cuisine type.
   - Average scores across Food Quality, Value, Ambiance, Service, and Accessibility.
   - Status tracking of the multi-agent pipeline (which phase is active, how many venues are approved vs. rejected).
4. Render the output to a local browser artifact.