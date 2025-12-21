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

load_dotenv()

try:
    initialize_firebase()
except (ValueError, FileNotFoundError) as e:
    print(f"WARNING: FIREBASE INITIALIZATION FAILED: {e}")

app = Flask(__name__)
CORS(app)

app.secret_key = os.getenv("SECRET_KEY")

app.register_blueprint(index_bp)
app.register_blueprint(login_bp)
app.register_blueprint(github_login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(handler_bp)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
