from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import ONLY the routes that work with Mock DB
from routes.githublogin import githublogin_bp
from routes.api_player import api_player_bp
from routes.api_quests import api_quests_bp
from routes.api_shop import api_shop_bp

# Comment out Mongo-dependent routes to prevent crashes
# from routes.index import index_bp
# from routes.login import login_bp   
# from routes.register import register_bp 
# from routes.dashboard import dashboard_bp   
# from routes.auth import auth_bp

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")

# --- CORS CONFIGURATION ---
# Vital for React + Flask Session Cookies
CORS(app, 
     supports_credentials=True, 
     resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# Register Active Blueprints
app.register_blueprint(githublogin_bp)    
app.register_blueprint(api_player_bp)
app.register_blueprint(api_quests_bp)
app.register_blueprint(api_shop_bp)

if __name__ == '__main__':
    print("🚀 Server running with IN-MEMORY MOCK DB (Data lost on restart)")
    app.run(port=5000, debug=True)