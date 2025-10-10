#!/usr/bin/env python3
"""
Simple HTTP server for local development
Run this script to serve your portfolio website locally
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Configuration
PORT = 8000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if index.html exists
    if not os.path.exists('index.html'):
        print("❌ Error: index.html not found in current directory")
        print("   Make sure you're running this script from the myprofile folder")
        sys.exit(1)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🚀 Starting development server...")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"📱 Also accessible at: http://127.0.0.1:{PORT}")
            print("\n🔧 Development Features:")
            print("   - Hot reload: refresh browser to see changes")
            print("   - CORS enabled for local development")
            print("   - Automatic browser opening")
            print("\n⏹️  Press Ctrl+C to stop the server\n")
            
            # Open browser automatically
            webbrowser.open(f'http://localhost:{PORT}')
            
            # Start server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Thanks for using the development server!")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Error: Port {PORT} is already in use")
            print("   Try stopping other servers or use a different port")
            print(f"   You can modify the PORT variable in {__file__}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()