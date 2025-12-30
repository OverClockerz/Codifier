from flask import request, jsonify,Blueprint
from dotenv import load_dotenv
from utils.paid_leaves import calculate_paid_leaves
from extensions import mongo
from utils.player_templates import IST, InitialPlayerState
from datetime import datetime
import copy
import os
import requests

load_dotenv()

githublogin_bp=Blueprint('githublogin',__name__)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')   # Replace with your actual Client ID
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET') # Replace with your actual Client Secret

@githublogin_bp.route('/github/callback', methods=['GET','POST'])
def github_callback():
    print("\n[DEBUG] Headers:", dict(request.headers))
    print("[DEBUG] request.json:", request.json)
    print("[DEBUG] GITHUB_CLIENT_ID:", GITHUB_CLIENT_ID)
    print("[DEBUG] GITHUB_CLIENT_SECRET:", "SET" if GITHUB_CLIENT_SECRET else 'NOT SET')


    data = request.json
    code = data.get('code') if data else None
    print(f"[DEBUG] Received code from frontend: {code}")

    if not code:
        print("[DEBUG] Missing 'code' in request body.")
        return jsonify({'error': 'Missing code parameter'}), 400

    # Exchange the code for an access token
    token_url = 'https://github.com/login/oauth/access_token'
    payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }
    print(f"[DEBUG] Payload sent to GitHub: {payload}")

    token_response = requests.post(token_url, headers={'Accept': 'application/json'}, data=payload)
    print("[DEBUG] token_response.status_code:", token_response.status_code)
    print("[DEBUG] token_response.text:", token_response.text)
    token_data = token_response.json()

    access_token = token_data.get('access_token')
    if not access_token:
        print(f"[DEBUG] Failed to fetch access token. token_data: {token_data}")
        return jsonify({'error': 'Failed to fetch access token', 'details': token_data}), 400

    # Fetch the user's GitHub profile
    user_url = 'https://api.github.com/user'
    user_response = requests.get(user_url, headers={
        'Authorization': f'token {access_token}'
    })
    user_data = user_response.json()

    username = user_data.get('login', 'Unknown')
    github_email = user_data.get('email') or f"{username}@no-email.github.com"
    github_id = user_data.get('id')
    avatar_url = user_data.get('avatar_url')
    
    existing_player = mongo.db.players.find_one({"username": username})

    if existing_player:
        # ✅ User already exists → DO NOT overwrite
        print(existing_player)
        calculate_paid_leaves(existing_player)
        existing_player["lastLoginDate"] = datetime.now(IST)
        mongo.db.players.update_one(
            {"username": username},
            {"$set": existing_player}
        )
        return jsonify({
        'message': 'GitHub login successful',
        'user': user_data
        })

    # 🆕 New user → Create player entry
    github_email = user_data.get('email') or f"{username}@no-email.github.com"
    github_id = user_data.get('id')
    avatar_url = user_data.get('avatar_url')
    player = copy.deepcopy(InitialPlayerState)

    player["username"] = username
    player["githubinfo"] = {
        "github_id": str(github_id),
        "avatar_url": avatar_url,
        "github_email": github_email
    }
    player["lastLoginDate"] = datetime.utcnow()

    mongo.db.players.insert_one(player)

    return jsonify({
        'message': 'GitHub login successful',
        'user': user_data
    })