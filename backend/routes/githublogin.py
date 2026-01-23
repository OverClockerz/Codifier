from flask import Blueprint, request, redirect, jsonify
from dotenv import load_dotenv
from extensions import mongo
from utils.paid_leaves import calculate_paid_leaves
from utils.player_templates import InitialPlayerState
from datetime import datetime, timedelta
import copy
import os
import requests
import jwt
from dotenv import load_dotenv


load_dotenv()

githublogin_bp = Blueprint("githublogin", __name__)

# ─────────────────────────────
# ENV VARIABLES
# ─────────────────────────────
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "dev_jwt_secret")
JWT_EXP_DAYS = 30

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

# ─────────────────────────────
# GITHUB OAUTH CALLBACK
# ─────────────────────────────
@githublogin_bp.route("/github/callback", methods=["GET"])
def github_callback():
    print("\n[DEBUG] Query Params:", request.args)

    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code"}), 400

    # ───── Exchange code for access token ─────
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
        timeout=10
    )

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return jsonify({
            "error": "Failed to fetch GitHub access token",
            "details": token_data
        }), 400

    # ───── Fetch GitHub user ─────
    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {access_token}"},
        timeout=10
    )

    user_data = user_response.json()

    username = user_data.get("login")
    github_id = user_data.get("id")
    avatar_url = user_data.get("avatar_url")
    github_email = user_data.get("email") or f"{username}@no-email.github.com"

    if not username or not github_id:
        return jsonify({"error": "Invalid GitHub user data"}), 400

    # ───── Create / Update Player ─────
    existing_player = mongo.db.players.find_one({"username": username})

    if existing_player:
        existing_player = calculate_paid_leaves(existing_player)
        existing_player["lastLoginDate"] = datetime.utcnow()
        mongo.db.players.replace_one(
            {"username": username},
            existing_player
        )
    else:
        player = copy.deepcopy(InitialPlayerState)
        player["username"] = username
        player["gameStartDate"] = datetime.utcnow()
        player["githubinfo"] = {
            "github_id": str(github_id),
            "avatar_url": avatar_url,
            "github_email": github_email,
        }
        player["lastLoginDate"] = datetime.utcnow()
        mongo.db.players.insert_one(player)

    # ───── Generate JWT ─────
    payload = {
    "sub": username,
    "github_id": github_id,
    "type": "session",
    "iat": datetime.utcnow(),
    "exp": datetime.utcnow() + timedelta(days=JWT_EXP_DAYS),  # session lifetime
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    # ───── Redirect back securely ─────
    response = redirect(f"{FRONTEND_URL}/auth/callback")
    
    response.set_cookie(
    "session_token",
    token,
    httponly=True,   # JS cannot access
    secure=True,     # HTTPS only
    samesite="None",  # allows frontend usage
    max_age=30 * 24 * 60 * 60,  # 30 days
    )

    return response
