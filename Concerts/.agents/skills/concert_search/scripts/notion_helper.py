#!/usr/bin/env python3
"""
Notion Helper Script
Pushes concert lists to a Notion workspace under page Events -> Concerts.
"""

import argparse
import os
import sys
import json
import requests
import datetime

# /// script
# dependencies = [
#   "requests",
# ]
# ///

class NotionClient:
    def __init__(self, token):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        }
        self.base_url = "https://api.notion.com"

    def search_pages(self, query=None):
        """Searches for pages in Notion."""
        url = f"{self.base_url}/v1/search"
        payload = {
            "filter": {
                "property": "object",
                "value": "page"
            }
        }
        if query:
            payload["query"] = query
            
        res = requests.post(url, headers=self.headers, json=payload)
        res.raise_for_status()
        return res.json().get("results", [])

    def get_page_title(self, page):
        """Extracts the plain text title of a page."""
        properties = page.get("properties", {})
        for prop_name, prop_val in properties.items():
            if prop_val.get("type") == "title":
                title_list = prop_val.get("title", [])
                if title_list:
                    return title_list[0].get("plain_text", "")
        return ""

    def find_or_create_events_page(self):
        """Finds the 'Events' page or creates it."""
        results = self.search_pages("Events")
        for page in results:
            if self.get_page_title(page).strip().lower() == "events":
                return page["id"]

        # If not found, we need a parent page to create it under
        all_pages = self.search_pages()
        parent_id = None
        for page in all_pages:
            # Avoid using 'Events' or 'Concerts' as the parent page itself
            title = self.get_page_title(page).strip().lower()
            if title not in ["events", "concerts"]:
                parent_id = page["id"]
                break

        if not parent_id:
            # Fallback to the first available page if we couldn't find a better one
            if all_pages:
                parent_id = all_pages[0]["id"]
            else:
                raise Exception("No pages found in Notion workspace. Please share at least one page with your Notion Integration.")

        # Create 'Events' page
        url = f"{self.base_url}/v1/pages"
        payload = {
            "parent": {"type": "page_id", "page_id": parent_id},
            "properties": {
                "title": {
                    "title": [
                        {"text": {"content": "Events"}}
                    ]
                }
            }
        }
        res = requests.post(url, headers=self.headers, json=payload)
        res.raise_for_status()
        return res.json()["id"]

    def find_or_create_concerts_page(self, events_page_id):
        """Finds the 'Concerts' page under the 'Events' parent or creates it."""
        results = self.search_pages("Concerts")
        events_uuid = events_page_id.replace("-", "")
        
        for page in results:
            if self.get_page_title(page).strip().lower() == "concerts":
                parent = page.get("parent", {})
                if parent.get("type") == "page_id" and parent.get("page_id").replace("-", "") == events_uuid:
                    return page["id"]

        # Create 'Concerts' under 'Events'
        url = f"{self.base_url}/v1/pages"
        payload = {
            "parent": {"type": "page_id", "page_id": events_page_id},
            "properties": {
                "title": {
                    "title": [
                        {"text": {"content": "Concerts"}}
                    ]
                }
            }
        }
        res = requests.post(url, headers=self.headers, json=payload)
        res.raise_for_status()
        return res.json()["id"]

    def clear_page_content(self, page_id):
        """Deletes all child blocks of a page."""
        url = f"{self.base_url}/v1/blocks/{page_id}/children"
        res = requests.get(url, headers=self.headers)
        res.raise_for_status()
        blocks = res.json().get("results", [])
        
        for block in blocks:
            block_id = block["id"]
            del_url = f"{self.base_url}/v1/blocks/{block_id}"
            requests.delete(del_url, headers=self.headers)

    def write_concerts_to_page(self, page_id, concerts, city):
        """Writes the concert list to the concerts page as a styled Notion Table."""
        # 1. Add Header & Description blocks
        url = f"{self.base_url}/v1/blocks/{page_id}/children"
        
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        header_blocks = {
            "children": [
                {
                    "object": "block",
                    "type": "heading_1",
                    "heading_1": {
                        "rich_text": [
                            {"type": "text", "text": {"content": f"Upcoming Concerts in {city.title()}"}}
                        ]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {"type": "text", "text": {"content": f"Last updated: {now_str}. Automatically updated by Antigravity."}}
                        ]
                    }
                }
            ]
        }
        requests.patch(url, headers=self.headers, json=header_blocks).raise_for_status()
        
        # 2. Build Table Block
        # Table columns: Date, Artist, Venue, Genre, Tickets
        rows = []
        
        # Header Row
        rows.append({
            "type": "table_row",
            "table_row": {
                "cells": [
                    [{"type": "text", "text": {"content": "Date"}}],
                    [{"type": "text", "text": {"content": "Artist / Event"}}],
                    [{"type": "text", "text": {"content": "Venue"}}],
                    [{"type": "text", "text": {"content": "Genre"}}],
                    [{"type": "text", "text": {"content": "Tickets"}}]
                ]
            }
        })
        
        # Data Rows
        for c in concerts:
            link_obj = []
            link_url = c.get("link") or c.get("url")
            if link_url and link_url != "#":
                link_obj = [{"type": "text", "text": {"content": "Tickets", "link": {"url": link_url}}}]
            else:
                link_obj = [{"type": "text", "text": {"content": "N/A"}}]
                
            rows.append({
                "type": "table_row",
                "table_row": {
                    "cells": [
                        [{"type": "text", "text": {"content": c.get("date", "TBD")}}],
                        [{"type": "text", "text": {"content": c.get("artist", c.get("name", "Unknown")), "annotations": {"bold": True}}}],
                        [{"type": "text", "text": {"content": c.get("venue", "Unknown")}}],
                        [{"type": "text", "text": {"content": c.get("genre", "Music")}}],
                        link_obj
                    ]
                }
            })
            
        table_block = {
            "children": [
                {
                    "object": "block",
                    "type": "table",
                    "table": {
                        "table_width": 5,
                        "has_column_header": True,
                        "children": rows
                    }
                }
            ]
        }
        requests.patch(url, headers=self.headers, json=table_block).raise_for_status()

def main():
    parser = argparse.ArgumentParser(description="Push concert data to Notion.")
    parser.add_argument("city", type=str, help="The city of the concerts.")
    parser.add_argument("json_file", type=str, help="Path to JSON file containing concert array.")
    
    args = parser.parse_args()
    
    token = os.environ.get("NOTION_TOKEN")
    if not token:
        print("ERROR: NOTION_TOKEN environment variable not set.")
        sys.exit(1)
        
    try:
        with open(args.json_file, "r", encoding="utf-8") as f:
            concerts = json.load(f)
    except Exception as e:
        print(f"ERROR: Failed to read json file: {e}")
        sys.exit(1)
        
    print("Connecting to Notion...")
    client = NotionClient(token)
    
    try:
        events_id = client.find_or_create_events_page()
        print(f"Found or created 'Events' page with ID: {events_id}")
        
        concerts_id = client.find_or_create_concerts_page(events_id)
        print(f"Found or created 'Concerts' page with ID: {concerts_id}")
        
        print("Clearing old page content...")
        client.clear_page_content(concerts_id)
        
        print(f"Writing {len(concerts)} concerts to 'Concerts' page...")
        client.write_concerts_to_page(concerts_id, concerts, args.city)
        
        print("Successfully updated Notion!")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
