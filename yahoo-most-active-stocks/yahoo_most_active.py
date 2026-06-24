#!/usr/bin/env python3
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""CLI script for fetching the most active stocks from Yahoo Finance.

This script fetches the most active stocks from https://finance.yahoo.com/markets/stocks/most-active/
and formats the result as a markdown table saved in a specified file.
"""

import argparse
import json
import os
import re
import sys
import time
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request


class RateLimitError(Exception):
  """Raised when the API rate limit is exceeded."""


class YahooActiveStocksClient:
  """Client for scraping Yahoo Finance with built-in rate limiting and retries."""

  BASE_URL = 'https://finance.yahoo.com/markets/stocks/most-active/'
  REQUESTS_PER_SECOND = 1

  def __init__(self):
    self.delay = 1.0 / self.REQUESTS_PER_SECOND
    self.last_request_time = 0.0

  def _wait_for_rate_limit(self):
    """Blocks until enough time has passed since the last request."""
    elapsed = time.monotonic() - self.last_request_time
    if elapsed < self.delay:
      time.sleep(self.delay - elapsed)

  def fetch_raw_html(self, retries=3):
    """Fetches the raw HTML of Yahoo Finance most active stocks page.

    Args:
      retries: Number of retry attempts for transient server/network errors.

    Returns:
      Raw HTML as a string.

    Raises:
      RateLimitError: If the server responds with HTTP 429.
      RuntimeError: If request fails after all retries.
    """
    url = self.BASE_URL
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ' (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
    }

    for attempt in range(retries):
      self._wait_for_rate_limit()
      try:
        req = urllib_request.Request(url, headers=headers)
        with urllib_request.urlopen(req, timeout=15) as response:
          self.last_request_time = time.monotonic()
          return response.read().decode('utf-8', errors='replace')
      except urllib_error.HTTPError as e:
        self.last_request_time = time.monotonic()
        if e.code == 429:
          # Rate limited — exponential backoff
          wait = 2**attempt
          print(
              f'Rate limited (429), retrying in {wait}s '
              f'(attempt {attempt + 1}/{retries})...',
              file=sys.stderr,
          )
          if attempt == retries - 1:
            raise RateLimitError(
                f'HTTP 429 Too Many Requests from {self.BASE_URL}. '
                f'Rate limit exceeded after {retries} retries.'
            ) from e
          time.sleep(wait)
          continue
        if e.code >= 500:
          # Transient server error — exponential backoff
          wait = 2**attempt
          print(
              f'Server error {e.code}, retrying in {wait}s '
              f'(attempt {attempt + 1}/{retries})...',
              file=sys.stderr,
          )
          if attempt == retries - 1:
            raise RuntimeError(
                f'Server error {e.code} from {url} after {retries} retries.'
            ) from e
          time.sleep(wait)
          continue
        # Client error — read body for details
        try:
          body = e.read().decode('utf-8', errors='replace')[:1000]
        except OSError:
          body = e.reason
        raise RuntimeError(f'HTTP {e.code} from {url}: {body}') from e
      except urllib_error.URLError as e:
        if attempt == retries - 1:
          raise RuntimeError(
              f'Failed to connect to {url} after {retries} attempts: {e}'
          ) from e
        time.sleep(2**attempt)

    raise RuntimeError(f'Failed to fetch page from {url} after {retries} retries.')

  def parse_active_stocks(self, html):
    """Parses active stock records from the page HTML.

    Args:
      html: Raw HTML content of the page.

    Returns:
      A list of dictionaries representing the active stock records.

    Raises:
      ValueError: If the required JSON structure cannot be found.
    """
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    for script in scripts:
      script_str = script.strip()
      if not (script_str.startswith('{') and script_str.endswith('}')):
        continue
      try:
        data = json.loads(script_str)
        if isinstance(data, dict) and 'body' in data:
          body_str = data['body']
          if body_str.startswith('{') and body_str.endswith('}'):
            body_data = json.loads(body_str)
            if isinstance(body_data, dict) and 'finance' in body_data:
              finance = body_data['finance']
              if 'result' in finance and isinstance(finance['result'], list) and len(finance['result']) > 0:
                res = finance['result'][0]
                if 'records' in res and isinstance(res['records'], list) and len(res['records']) > 0:
                  return res['records']
      except Exception:
        continue

    raise ValueError(
        'Could not locate the script tag containing active stock data. '
        'The Yahoo Finance page structure might have changed.'
    )


def format_markdown_table(records, limit=25):
  """Formats a list of stock records as a markdown table.

  Args:
    records: List of stock record dicts.
    limit: Max number of stocks to include.

  Returns:
    A string containing the markdown table.
  """
  limited_records = records[:limit]
  
  lines = []
  lines.append('# Yahoo Finance - Most Active Stocks')
  lines.append(f'Last updated: {time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())}')
  lines.append('')
  
  # Table Header
  lines.append('| Ticker | Company Name | Price | Change | % Change | Volume | Market Cap | PE Ratio (LTM) |')
  lines.append('|:---|:---|---:|---:|---:|---:|---:|---:|')
  
  # Table Rows
  for r in limited_records:
    ticker = r.get('ticker', 'N/A')
    name = r.get('companyName', 'N/A')
    
    price = r.get('regularMarketPrice', {}).get('fmt', 'N/A')
    change = r.get('regularMarketChange', {}).get('fmt', 'N/A')
    change_pct = r.get('regularMarketChangePercent', {}).get('fmt', 'N/A')
    
    # Prefer longFmt for volume if available, fallback to fmt
    vol_dict = r.get('regularMarketVolume', {})
    volume = vol_dict.get('longFmt', vol_dict.get('fmt', 'N/A'))
    
    mcap = r.get('marketCap', {}).get('fmt', 'N/A')
    pe = r.get('peRatioLtm', {}).get('fmt', 'N/A')
    
    lines.append(f'| **{ticker}** | {name} | {price} | {change} | {change_pct} | {volume} | {mcap} | {pe} |')
    
  return '\n'.join(lines) + '\n'


def main():
  parser = argparse.ArgumentParser(
      description='Fetch most active stocks from Yahoo Finance.'
  )
  subparsers = parser.add_subparsers(dest='command', required=True)
  
  p_fetch = subparsers.add_parser(
      'fetch',
      help='Fetch the active stocks and save as a markdown table'
  )
  p_fetch.add_argument(
      '--output',
      required=True,
      help='Output file path for the markdown file (e.g. output/stocks.md)'
  )
  p_fetch.add_argument(
      '--limit',
      type=int,
      default=25,
      help='Maximum number of stocks to output (default: 25)'
  )
  
  args = parser.parse_args()
  
  if args.command == 'fetch':
    client = YahooActiveStocksClient()
    
    try:
      print('Fetching Yahoo Finance page...', file=sys.stderr)
      html = client.fetch_raw_html()
      
      print('Parsing stock data...', file=sys.stderr)
      records = client.parse_active_stocks(html)
      
      print(f'Formatting table (limit={args.limit})...', file=sys.stderr)
      markdown_content = format_markdown_table(records, limit=args.limit)
      
      # Ensure output directory exists
      output_dir = os.path.dirname(args.output)
      if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        
      with open(args.output, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
        
      print(f'Success! Data written to: {args.output}')
    except Exception as e:
      print(f'Error: {e}', file=sys.stderr)
      sys.exit(1)


if __name__ == '__main__':
  main()
