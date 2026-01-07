from flask import Blueprint, request,jsonify
from extensions import mongo
import jwt
import os
auth_me_bp = Blueprint("auth_me", __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "dev_jwt_secret")

@auth_me_bp.route("/api/auth/me", methods=["GET"])
def auth_me():
    token = request.cookies.get("session_token")
    if not token:
        return jsonify({"error": "Not authenticated"}), 401
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        username = payload["sub"]
        user = mongo.db.players.find_one({"username": username}, {"_id": 0})
        return jsonify(user)
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid token", "details": str(e)}), 401