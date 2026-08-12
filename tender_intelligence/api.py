"""Tiny local HTTP API using only the Python standard library."""
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
from .fixtures import all_tenders, get_tender
from .analysis import compare_bids, completeness, dossier
from .claims import cited_claim

class Handler(BaseHTTPRequestHandler):
    def _json(self, data, status=200):
        raw = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status); self.send_header("Content-Type", "application/json; charset=utf-8"); self.send_header("Content-Length", str(len(raw))); self.end_headers(); self.wfile.write(raw)
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/tenders": return self._json(all_tenders())
        prefix = "/api/tenders/"
        if path.startswith(prefix):
            tender = get_tender(path[len(prefix):])
            if tender is None: return self._json({"error": "Licitația nu există în setul demo."}, 404)
            return self._json({"tender": tender, "dossier": dossier(tender), "bids": compare_bids(tender), "completeness": completeness(tender), "claim": cited_claim(tender)})
        # The same local process can host the static live UI; no CDN is needed.
        relative = "index.html" if path == "/" else path.lstrip("/")
        asset = (Path(__file__).parent.parent / "static" / relative).resolve()
        static_root = (Path(__file__).parent.parent / "static").resolve()
        if static_root in asset.parents and asset.is_file():
            content_type = "text/html; charset=utf-8" if asset.suffix == ".html" else "text/css; charset=utf-8" if asset.suffix == ".css" else "text/javascript; charset=utf-8"
            raw = asset.read_bytes(); self.send_response(200); self.send_header("Content-Type", content_type); self.send_header("Content-Length", str(len(raw))); self.end_headers(); self.wfile.write(raw); return
        return self._json({"error": "Rută necunoscută."}, 404)
    def log_message(self, *_args): pass

def serve(host="127.0.0.1", port=8000):
    HTTPServer((host, port), Handler).serve_forever()

if __name__ == "__main__": serve()
