from keep_alive import start_keep_alive
from dotenv import load_dotenv
from extensions import mongo
from flask_cors import CORS
from flask import Flask
from routes import (
    githublogin_bp,
    api_player_bp,
    api_quests_bp,
    index_bp,
    health_bp,
    auth_me_bp,
    auth_logout_bp,
    ai_problems_bp,
    ai_runner_bp,
    ai_comprehensive_bp,
    register_bp,
    dashboard_bp,
    auth_bp,
    login_bp,
)
import os
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")
    app.config["MONGO_URI"] = os.getenv(
        "MONGO_URI", "mongodb://localhost:27017/mydatabase"
    )
    mongo.init_app(app)

    # ─── CORS ─────────────────────────────────────────────
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://localhost:5000",
                    "https://office-2fcd2.web.app",
                    "https://office-6f832.web.app",
                ]
            }
        },
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        expose_headers=["Content-Type"],
    )

    # ─── BLUEPRINTS ───────────────────────────────────────

    BLUEPRINTS = [
        githublogin_bp,
        api_player_bp,
        api_quests_bp,
        index_bp,
        health_bp,
        auth_me_bp,
        auth_logout_bp,
        ai_problems_bp,
        ai_runner_bp,
        ai_comprehensive_bp,
        register_bp,
        dashboard_bp,
        auth_bp,
        login_bp,
    ]

    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)
        
    if os.getenv("ENABLE_KEEP_ALIVE") == "true":
        start_keep_alive()

    return app
    