from flask import Flask, jsonify
from flask_cors import CORS


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    @app.get("/api/health")
    def health_check() -> tuple[dict, int]:
        return {"status": "ok"}, 200

    return app
