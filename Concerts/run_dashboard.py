#!/usr/bin/env python3
"""
BeatSync Dashboard Runner
Starts a local HTTP server and automatically opens the dashboard in the default browser.
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import sys

PORT = 8000

def start_server():
    # Use SimpleHTTPRequestHandler to serve local workspace files (index.html, style.css, etc.)
    Handler = http.server.SimpleHTTPRequestHandler
    # Allow address reuse to avoid port conflicts on quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"STATUS: Serving dashboard at http://localhost:{PORT}")
            print("Press Ctrl+C to stop the server.")
            httpd.serve_forever()
    except Exception as e:
        print(f"ERROR: Failed to start server: {e}")
        sys.exit(1)

def main():
    print("Starting BeatSync Dashboard...")
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Give the server a second to bind to the port
    time.sleep(1.0)
    
    url = f"http://localhost:{PORT}/index.html"
    print(f"Opening dashboard in your web browser: {url}")
    webbrowser.open(url)
    
    # Keep main thread alive
    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        print("\nStopping BeatSync Dashboard server. Goodbye!")

if __name__ == "__main__":
    main()
