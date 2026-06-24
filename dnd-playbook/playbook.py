#!/usr/bin/env python3
import os
import sys
import argparse
import http.server
import socketserver
import webbrowser
import threading
import time

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Subclass HTTPRequestHandler to disable caching. This ensures updates
    to index.html, style.css, and app.js are loaded instantly in the browser.
    """
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def open_browser(url):
    time.sleep(0.8) # Wait briefly for server to boot up
    print(f"[*] Opening browser to {url}...")
    webbrowser.open(url)

def serve(port):
    # Set the working directory to the dashboard subdirectory of the skill
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir = os.path.join(script_dir, 'dashboard')
    
    if not os.path.isdir(web_dir):
        print(f"Error: Dashboard folder not found at {web_dir}")
        sys.exit(1)
        
    os.chdir(web_dir)
    
    Handler = NoCacheHTTPRequestHandler
    
    # Try binding to the port
    while True:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}/index.html"
                print(f"[*] Serving D&D Playbook Dashboard on port {port}")
                print(f"[*] Local URL: {url}")
                print("[*] Press Ctrl+C to stop the server")
                
                # Start browser in a daemon thread
                t = threading.Thread(target=open_browser, args=(url,))
                t.daemon = True
                t.start()
                
                # Serve requests
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 98 or e.errno == 10048: # Port already in use
                print(f"[!] Port {port} is in use, trying port {port + 1}...")
                port += 1
            else:
                print(f"Error starting server: {e}")
                sys.exit(1)
        except KeyboardInterrupt:
            print("\n[*] Stopping D&D Playbook Server. Safe travels, adventurer!")
            sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description="D&D Playbook Dashboard CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # Serve parser
    serve_parser = subparsers.add_parser("serve", help="Start the playbook dashboard local server")
    serve_parser.add_argument("--port", type=int, default=8000, help="Port to run the server on (default: 8000)")
    
    args = parser.parse_args()
    
    if args.command == "serve":
        serve(args.port)

if __name__ == "__main__":
    main()
