from flask import Flask
from routes.index import index_bp
from routes.login import login_bp
from routes.register import register_bp
from routes.dashboard import dashboard_bp
from routes.github_login import github_login_bp
from routes.handle_requests import handler_bp
from routes.auth import auth_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import initialize_firebase

# Load environment variables from .env (for local) 
# Render will provide these directly in production
load_dotenv()

# 1. Initialize Firebase before the app starts
try:
    initialize_firebase()
except Exception as e:
    print(f"❌ CRITICAL ERROR: Firebase failed to initialize: {e}")

app = Flask(__name__)

# 2. UPDATED CORS: Allow your specific Firebase frontend URL
# This allows the 'X-User-ID' header we use in api.ts to pass through
CORS(app, resources={
    r"/*": {
        "origins": ["https://office-97680408-63535.web.app"],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-User-ID"]
    }
})

app.secret_key = os.getenv("SECRET_KEY", "default_secret_key_for_dev")

# Register Blueprints
app.register_blueprint(index_bp)
app.register_blueprint(login_bp)
app.register_blueprint(github_login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(handler_bp)

if __name__ == '__main__':
    # Use '0.0.0.0' to ensure the service is reachable on Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)