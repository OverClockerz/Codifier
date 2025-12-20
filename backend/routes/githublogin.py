from flask import request, jsonify,Blueprint
from dotenv import load_dotenv
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


    token_response = requests.post(token_url, headers={'Accept': 'application/json'}, json=payload)
    print("[DEBUG] token_response.status_code:", token_response.status_code)
    print("[DEBUG] token_response.text:", token_response.text)
    token_data = token_response.json()

    access_token = token_data.get('access_token')
    if not access_token:
        return jsonify({'error': 'Failed to fetch access token', 'details': token_data}), 400

    # Fetch the user's GitHub profile
    user_url = 'https://api.github.com/user'
    user_response = requests.get(user_url, headers={
        'Authorization': f'token {access_token}'
    })
    user_data = user_response.json()

    # --- PRINT TO TERMINAL ---
    username = user_data.get('login', 'Unknown')
    print("\n" + "="*40)
    print(f"🚀 LOGIN SUCCESSFUL: {username}")
    print("="*40 + "\n")

    return jsonify({
        'message': 'GitHub login successful',
        'user': user_data
    })