from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import mongo
from keep_alive import start_keep_alive
import certifi
import os

# Blueprints
from routes.githublogin import githublogin_bp
from routes.api_player import api_player_bp
from routes.api_quests import api_quests_bp
from routes.index import index_bp
from routes.ai_problems import ai_problems_bp
from routes.ai_comprehensive import ai_comprehensive_bp
from routes.ai_runner import ai_runner_bp
from routes.login import login_bp
from routes.register import register_bp
from routes.dashboard import dashboard_bp
from routes.auth import auth_bp
from routes.health import health_bp

load_dotenv()

# 🔑 WSGI ENTRY POINT (Gunicorn looks for this)
app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")

app.config["MONGO_URI"] = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/mydatabase"
)
app.config["MONGO_OPTIONS"] = {
    "tlsCAFile": certifi.where()
}

mongo.init_app(app)

# --- CORS CONFIG ---
CORS(
    app,
    supports_credentials=True,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "https://office-07701907-eeb02.web.app",
                "https://office-2fcd2.web.app"
            ]
        }
    },
)

# --- BLUEPRINTS ---
app.register_blueprint(githublogin_bp)
app.register_blueprint(api_player_bp)
app.register_blueprint(api_quests_bp)
app.register_blueprint(index_bp)
app.register_blueprint(health_bp)
app.register_blueprint(ai_problems_bp)
app.register_blueprint(ai_runner_bp)
app.register_blueprint(ai_comprehensive_bp)
app.register_blueprint(register_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(login_bp)

if os.getenv("ENABLE_KEEP_ALIVE") == "true":
    start_keep_alive()

# --- DEV ONLY ---
if __name__ == "__main__":
    app.run(debug=True)
