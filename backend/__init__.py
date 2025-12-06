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
        # Get the absolute path to the dist folder
        dist_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
        
        if path != "" and os.path.exists(os.path.join(dist_folder, path)):
            return send_from_directory(dist_folder, path)
        else:
            index_path = os.path.join(dist_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
            else:
                return f"Frontend not built. Dist folder not found at: {dist_folder}", 404

    return app
