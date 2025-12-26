from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import mongo
from routes.githublogin import githublogin_bp
from routes.api_player import api_player_bp
from routes.api_quests import api_quests_bp
from routes.index import index_bp
from routes.ai_problems import ai_problems_bp
from routes.ai_runner import ai_runner_bp
from routes.login import login_bp   
from routes.register import register_bp 
from routes.dashboard import dashboard_bp   
from routes.auth import auth_bp
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo.init_app(app)

from datetime import timedelta
# --- CORS CONFIGURATION ---
# Vital for React + Flask Session Cookies
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Type"]
)


# Register Active Blueprints
app.register_blueprint(githublogin_bp)    
app.register_blueprint(api_player_bp)
app.register_blueprint(api_quests_bp)
app.register_blueprint(index_bp)
app.register_blueprint(ai_problems_bp)
app.register_blueprint(ai_runner_bp)
app.register_blueprint(register_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(login_bp)

if __name__ == '__main__':
    print("🚀 Server running")
    app.run(port=5000, debug=True)