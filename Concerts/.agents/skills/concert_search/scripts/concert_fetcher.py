#!/usr/bin/env python3
"""
Concert Fetcher Script
Queries the Ticketmaster Discovery API for upcoming/ongoing music concerts in a given city.
If no API key is provided, it returns a message instructing the agent to use web search.
"""

import argparse
import os
import sys
import datetime
from urllib.parse import quote

# We can use requests if available, or fall back to urllib to avoid dependencies.
# However, since we run via uv, requests is safe to declare as a dependency.
# Inline script metadata for uv:
# /// script
# dependencies = [
#   "requests",
# ]
# ///

try:
    import requests
except ImportError:
    # Fallback to urllib.request if requests isn't installed
    requests = None

def get_concerts_list(city, api_key, limit=20):
    """Fetches concerts from the Ticketmaster API and returns them as a list of dicts."""
    base_url = "https://app.ticketmaster.com/discovery/v2/events.json"
    
    # Get current UTC time in ISO format
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    start_date_time = now_utc.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    params = {
        "apikey": api_key,
        "city": city,
        "classificationName": "music",
        "size": limit,
        "sort": "date,asc",
        "startDateTime": start_date_time
    }
    
    try:
        if requests:
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
        else:
            # Fallback using urllib
            import urllib.request
            import json
            query_str = "&".join(f"{k}={quote(str(v))}" for k, v in params.items())
            url = f"{base_url}?{query_str}"
            req = urllib.request.Request(url, headers={"User-Agent": "ConcertFetcher/1.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                
    except Exception as e:
        raise Exception(f"Error querying Ticketmaster API: {e}")
        
    events = data.get("_embedded", {}).get("events", [])
    concert_list = []
    
    for event in events:
        name = event.get("name", "Unknown Artist")
        url = event.get("url", "#")
        
        # Parse Date/Time
        dates = event.get("dates", {})
        start = dates.get("start", {})
        local_date = start.get("localDate", "TBD")
        
        # Get Venue
        venues = event.get("_embedded", {}).get("venues", [])
        venue_name = venues[0].get("name", "Unknown Venue") if venues else "Unknown Venue"
        
        # Get Genre
        classifications = event.get("classifications", [])
        genre = "Music"
        if classifications:
            genre_info = classifications[0].get("genre", {})
            subgenre_info = classifications[0].get("subGenre", {})
            if genre_info and genre_info.get("name") != "Undefined":
                genre = genre_info.get("name")
                if subgenre_info and subgenre_info.get("name") != "Undefined":
                    genre += f" ({subgenre_info.get('name')})"
                    
        # Get Price
        price_ranges = event.get("priceRanges", [])
        price_str = "TBD"
        if price_ranges:
            p_range = price_ranges[0]
            currency = p_range.get("currency", "")
            min_val = p_range.get("min")
            max_val = p_range.get("max")
            if min_val is not None and max_val is not None:
                price_str = f"{int(min_val)}-{int(max_val)} {currency}"
            elif min_val is not None:
                price_str = f"From {int(min_val)} {currency}"
                
        concert_list.append({
            "date": local_date,
            "artist": name,
            "venue": venue_name,
            "genre": genre,
            "price": price_str,
            "link": url
        })
        
    return concert_list

def format_markdown(concerts, city):
    """Formats list of concert dicts to markdown."""
    if not concerts:
        return f"No upcoming concerts found for **{city}** via Ticketmaster API."
        
    markdown_lines = [
        f"### Upcoming Concerts in {city.title()} (via Ticketmaster API)",
        "",
        "| Date | Artist / Event | Venue | Genre | Price | Ticket / Info |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |"
    ]
    
    for c in concerts:
        ticket_link = f"[Get Tickets]({c['link']})" if c['link'] != "#" else "N/A"
        markdown_lines.append(
            f"| {c['date']} | **{c['artist']}** | {c['venue']} | {c['genre']} | {c.get('price', 'TBD')} | {ticket_link} |"
        )
        
    return "\n".join(markdown_lines)

def main():
    parser = argparse.ArgumentParser(description="Fetch upcoming concerts for a given city.")
    parser.add_argument("city", type=str, help="The city to search for (e.g., Stockholm, Berlin, London, Paris).")
    parser.add_argument("--limit", type=int, default=15, help="Number of concerts to fetch.")
    parser.add_argument("--api-key", type=str, default=None, help="Ticketmaster API Key.")
    parser.add_argument("--save-json", type=str, default=None, help="Save structured results as JSON to this path.")
    
    args = parser.parse_args()
    
    # Determine API key priority: argument -> environment variable
    api_key = args.api_key or os.environ.get("TICKETMASTER_API_KEY")
    
    if not api_key:
        print("STATUS: NO_API_KEY")
        print("Ticketmaster API key is not set.")
        print("To use the API, set the TICKETMASTER_API_KEY environment variable or pass --api-key.")
        print("Falling back to web search mode.")
        sys.exit(0)
        
    print(f"STATUS: Fetching concerts for {args.city}...")
    try:
        concerts = get_concerts_list(args.city, api_key, args.limit)
        
        if args.save_json:
            import json
            with open(args.save_json, "w", encoding="utf-8") as f:
                json.dump(concerts, f, indent=2)
            print(f"STATUS: Saved {len(concerts)} events to {args.save_json}")
            
        print(format_markdown(concerts, args.city))
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

