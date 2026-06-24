# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EverydayAI** is a multi-agent content pipeline that discovers, evaluates, and teaches AI productivity tools to office workers. Each weekly run produces ranked tool intelligence, a structured learning curriculum (Mon–Fri), educational materials, and social media distribution copy.

## Architecture: 12-Agent Sequential Pipeline

The pipeline is defined as agent skill prompts in `,claude/skills/`. Agents hand off data sequentially; the Orchestrator (`00`) manages flow and quality control.

### Pipeline Stages

**Stage A — Market Discovery**
- `01_research_agent` → discovers new AI tools, outputs a Raw Discovery Log
- `04_market_analysis_agent` → SWOT analysis and competitive positioning vs. Microsoft 365/Google Workspace

**Stage B — Evaluation**
- `02_ranking_agent` → scores tools on Security/Ease of Use/Portability/Business Value/Stability (1–10), outputs Top 5 of the Week
- `03_reporting_agent` → transforms rankings into executive-ready reports with chart data structures
- `05_segmentation_agent` → tags tools by department (HR, Legal, Finance, Marketing, Engineering) with impact scores

**Stage C — Content Creation**
- `06_blog_agent` → SEO-optimized thought leadership articles
- `07_material_writer_agent` → "First 5 Minutes" how-to guides with pro-tips
- `08_practice_agent` → "15-Minute Challenge" industry-specific scenarios
- `09_quiz_agent` → 5–10 assessment questions per tool with explanations

**Stage D — Finalize & Distribute**
- `10_curriculum_agent` → bundles content into a Mon–Fri learning path (Day 1: Awareness → Day 5: Quiz/Certification)
- `11_advertisement_agent` → one-pager copy focused on "Time Saved" pain points
- `12_marketing_agent` → platform-specific social posts (LinkedIn/X/Instagram)

### Orchestrator Rules
- Ranking Agent must not start until Research Agent delivers a validated tool list
- Curriculum Agent requires inputs from Agents 07, 08, and 09 before finalizing
- Auto-fail any tool flagged with "High Security Risks" by the Research Agent
- If Marketing Agent tone conflicts with Blog Agent facts, keep Blog Agent data, keep Marketing Agent energy

## Output Schema

All pipeline output must conform to `everyday_ai_schema.json`, which defines four top-level sections:
- `tool_metadata` — UUID, timestamp, agent version
- `intelligence_data` — research, ranking metrics, and market analysis
- `educational_content` — curriculum week, guides, practice cases, quiz questions
- `distribution` — blog article (markdown), ad copy, and social posts

## Directory Layout

```
,claude/skills/       # Agent prompt definitions (00–12)
data/                 # Input data / Raw Discovery Logs
output/               # Generated pipeline outputs (JSON conforming to schema)
everyday_ai_schema.json  # Canonical output schema
```

## Running the Pipeline

To execute a full pipeline run, invoke the Orchestrator agent (`00_orchestrator_agent`) and provide a topic or weekly theme. It will coordinate all downstream agents in sequence (A → B → C → D). Final output should be written to `output/` as a JSON file matching `everyday_ai_schema.json`.

To run a single agent in isolation, load its skill file from `,claude/skills/` and provide it the expected upstream data (e.g., give the Ranking Agent a raw discovery log from the Research Agent).
