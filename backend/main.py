from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import mongo
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
import certifi
import sys
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydatabase")
app.config["MONGO_OPTIONS"] = {
    "tlsCAFile": certifi.where()
}
mongo.init_app(app)

# --- CORS CONFIGURATION ---
# Vital for React + Flask Session Cookies
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "https://office-07701907-eeb02.web.app",
                "https://office-2fcd2--dev-0p9x0aa4.web.app"
            ]
        }
    },
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
app.register_blueprint(ai_comprehensive_bp)
app.register_blueprint(register_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(login_bp)

if __name__ == '__main__':
    print("🚀 Server running")
    print("PYTHON VERSION:", sys.version)
    port = int(os.environ.get("PORT", 5000))  # Render provides PORT
    app.run(host="0.0.0.0", port=port, debug=False)