---
name: dnd-playbook
description: >-
  Launches an interactive D&D Playbook Dashboard that provides rules, classes, spells, monsters, races, equipment, a virtual dice roller, and a quick character sheet draftsman.
---

# D&D Playbook Skill

## Overview
This skill launches a gorgeous, responsive, interactive D&D 5e Playbook Dashboard in your browser. The dashboard fetches live data from the public [D&D 5e API](https://www.dnd5eapi.co/) and provides detailed information about:
- **Rules**: Categories (Combat, Spellcasting, Adventuring, Ability Scores) and rule sections.
- **Classes**: Level progression, hit die, proficiencies, starting equipment, subclasses, and more.
- **Spells**: Full spell catalog with filters for level, school, and class.
- **Monsters**: Beast registry with full stat blocks (STR, DEX, etc.), actions, and challenge ratings.
- **Races**: Ability bonuses, traits, speed, alignment, and size information.
- **Equipment**: Gear catalog with cost, weight, and damage properties.
- **Dice Roller**: Interactive virtual dice simulator for standard RPG dice (d4, d6, d8, d10, d12, d20, d100).
- **Draft Sheet**: Quick character builder that rolls stats and compiles class/race details.
- **Favorites**: Bookmarking system using browser local storage to save frequently referenced pages.

## Quick Start
To launch the DnD Playbook Dashboard, run:

```bash
uv run .agents/skills/dnd-playbook/playbook.py serve
```

This will spin up a local web server and automatically open the dashboard in your default web browser.

## CLI Usage
The Python CLI helper script `playbook.py` supports the following command:

```bash
uv run .agents/skills/dnd-playbook/playbook.py serve [--port <PORT>]
```

### Arguments:
- `--port` (optional): The port on which the web server will run. Defaults to `8000`.

## Features Found and Integrated
1. **Interactive Rule Book**: Hierarchical navigation of all standard rules sections.
2. **Advanced Spell Filter**: Multi-filter system to quickly search by class, spell level, and school of magic.
3. **Stat Block Generator for Monsters**: Custom-styled monster stats blocks styled like traditional D&D monster manuals.
4. **Interactive Dice Roller**: Roll single or multiple dice with modifiers, showing formulas and roll histories.
5. **Character Draft Builder**: Roll attributes using 4d6-drop-lowest, pick race/class, and export/save drafts.
6. **Favorites/Bookmarking**: Bookmark any rule section, class, spell, race, or monster for instant access on your dashboard.
