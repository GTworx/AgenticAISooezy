# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CulinarySearch** is a multi-agent pipeline that discovers, evaluates, and presents the best local dining options within a 5 km radius of a specified location. A single user request (location + preferences) flows through 4 sequential agents and produces a personalized, logistics-enriched dining guide.

## Architecture: 4-Agent Sequential Pipeline

Agent prompts are defined in `agents/`. The Orchestrator (`00`) manages all hand-offs and produces the final output.

### Pipeline Stages

```
[User Request]
      │
      ▼
01_scout_agent ──────────► Gathers raw venue data within 5 km radius
      │
      ▼
02_ranking_agent ─────────► Filters and scores the best spots
      │
      ▼
03_logistics_agent ───────► Adds travel times, hours, booking info, accessibility
      │
      ▼
00_orchestrator_agent ────► Synthesizes into the final Curated Dining Guide
      │
      ▼
[Final Dining Guide]
```

### Agent Responsibilities

| Agent | Role | Key Output |
|---|---|---|
| `01_scout_agent` | Culinary Scout & Local Food Researcher | Raw Restaurant Discovery Log |
| `02_ranking_agent` | Culinary Data Analyst & Ranker | Ranked Shortlist (Top 5–10) |
| `03_logistics_agent` | Local Logistics & Concierge Specialist | Operational Log per venue |
| `00_orchestrator_agent` | Local Concierge & Culinary Writer | Curated Dining Guide + Scout's Pick |

### Orchestrator Rules

- Ranking Agent must not start until Scout delivers a validated discovery log
- If the shortlist has fewer than 3 venues, Scout must widen radius by 1 km and re-run
- Logistics Agent must process all shortlisted venues before the guide is written
- Any venue still flagged for closure or hygiene issues must be removed before final output

## Output Schema

All pipeline output conforms to `culinary_search_schema.json`, which defines four top-level sections:
- `pipeline_metadata` — run ID, timestamp, epicenter coordinates, radius, user intent
- `scout_output` — raw discovery log with flags
- `ranking_output` — ranked shortlist with composite scores and rationale
- `logistics_output` — operational logs per venue
- `final_guide` — markdown dining guide and Scout's Pick

## Directory Layout

```
agents/                        # Agent prompt definitions (00–03)
culinary_search_schema.json    # Canonical output schema
CLAUDE.md                      # This file
```

## Running the Pipeline

Invoke the Orchestrator agent (`00_orchestrator_agent`) with the user's request:
- **Location** — coordinates or neighborhood name
- **Cuisine preference** — optional (e.g., "Italian", "ramen", "anything")
- **Occasion** — optional (e.g., "quick lunch", "date night", "business dinner")
- **Target dining time** — optional (e.g., "tonight at 7pm")

The Orchestrator coordinates Agents 01 → 02 → 03 in sequence, then synthesizes the final guide.
