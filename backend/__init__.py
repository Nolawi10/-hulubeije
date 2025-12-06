from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    CORS(app)

    @app.get("/api/health")
    def health_check() -> tuple[dict, int]:
        return {"status": "ok", "message": "Hulu Be Ije API is running"}, 200

    @app.get("/api/status")
    def api_status() -> tuple[dict, int]:
        return {"api": "online", "frontend": "connected"}, 200

    # Serve React frontend from dist folder
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(app.root_path, '..', 'dist', path)):
            return send_from_directory(os.path.join(app.root_path, '..', 'dist'), path)
        else:
            return send_file(os.path.join(app.root_path, '..', 'dist', 'index.html'))

    return app
