from flask import Flask
from routes.index import index_bp
from routes.login import login_bp   
from routes.register import register_bp 
from routes.dashboard import dashboard_bp   
from routes.githublogin import githublogin_bp
from routes.handle_requests import handler_bp
from routes.auth import auth_bp
from flask_cors import CORS
from extensions import mongo
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
# app.config["MONGO_URI"] = os.getenv("MONGODB_URL")
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo.init_app(app)
CORS(app)

app.secret_key = os.getenv("SECRET_KEY")

app.register_blueprint(index_bp)
app.register_blueprint(login_bp)
app.register_blueprint(githublogin_bp)    
app.register_blueprint(register_bp) 
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)  
app.register_blueprint(handler_bp)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

