from flask import Blueprint, request, jsonify, redirect
import requests
from firebase_admin import db

github_login_bp = Blueprint('github_login_bp', __name__)

# Replace with your GitHub App credentials
CLIENT_ID = 'Ov23liAw4jOzycLR8qW5'
CLIENT_SECRET = 'cc3707f11b02391b31261aead4f16dc7c0da7374'

@github_login_bp.route('/auth/github/callback')
def github_callback():
    code = request.args.get('code')
    if not code:
        return "Error: No code provided by GitHub", 400

    # 1. Exchange code for access token
    token_url = 'https://github.com/login/oauth/access_token'
    token_params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    
    token_res = requests.post(token_url, params=token_params, headers=headers)
    token_data = token_res.json()

    # SAFETY CHECK: If GitHub returns an error, 'access_token' won't exist
    if 'access_token' not in token_data:
        print(f"GitHub OAuth Error: {token_data}")
        return f"GitHub Error: {token_data.get('error_description', 'Authentication failed')}", 401

    access_token = token_data['access_token']

    # 2. Get User Info
    user_res = requests.get(
        'https://api.github.com/user',
        headers={'Authorization': f'token {access_token}'}
    )
    user_json = user_res.json()
    username = user_json.get('login')

    # 3. Save to Firebase (using your db.py helper)
    try:
        from db import save_user
        save_user(user_json)
    except Exception as e:
        print(f"Firebase Save Error: {e}")
        # We still redirect so the user can play, even if DB save fails once
    
    # 4. Redirect to Frontend
    return redirect(f'http://localhost:3000/game?username={username}')