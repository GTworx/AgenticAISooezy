---
name: yahoo-most-active-stocks
description: >-
  Visits Yahoo Finance to fetch the most active stocks and stores them in a formatted markdown table in the output directory.
---

# Yahoo Most Active Stocks Skill

## Overview
This skill visits the Yahoo Finance page for the most active stocks (https://finance.yahoo.com/markets/stocks/most-active/) and parses the stock list from the page's internal JSON script block. It formats the top active stocks as a markdown table and writes them to a file (defaulting to the `output` folder).

## Dependencies
- **uv**: Required to manage the Python execution environment automatically.

## Quick Start
To fetch the most active stocks and save them to `output/most_active_stocks.md`, run:

```bash
uv run .agents/skills/yahoo-most-active-stocks/yahoo_most_active.py fetch --output output/most_active_stocks.md
```

## Utility Scripts
The python CLI helper script `yahoo_most_active.py` has a `fetch` subcommand:

```bash
uv run .agents/skills/yahoo-most-active-stocks/yahoo_most_active.py fetch --output <PATH> [--limit <LIMIT>]
```

### Arguments:
- `--output` (required): The path to write the markdown table (e.g. `output/most_active_stocks.md`). The output folder will be created if it does not exist.
- `--limit` (optional): The maximum number of stocks to include in the output table. Defaults to `25` (ranges from 1 to 25).

## Rate Limiting
This skill implements a rate-limiting delay of **1 request per second** to be polite to the host server. Additionally, it implements:
- Up to 3 retry attempts for transient server errors (HTTP 5xx) and connection/timeout errors.
- Exponential backoff wait times between retries (2^attempt seconds).
- Raising a clear error on HTTP 429 rate limit issues.

## Common Mistakes
1. **Specifying an invalid output path**: If the script does not have write permissions to the specified output folder, it will crash with an error. Ensure the path is writable.
2. **Scraper Failure due to Page Changes**: Since this relies on scraping, if Yahoo Finance updates its webpage structures or JSON schema, the script may fail to parse. If this happens, verify the HTML structure or check for newer custom selectors.
