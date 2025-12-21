
from flask import request, Blueprint, jsonify
from dotenv import load_dotenv
import os
import requests
from db import save_user, initialize_firebase

load_dotenv()

githublogin_bp = Blueprint('githublogin', __name__)

try:
    initialize_firebase()
except (ValueError, FileNotFoundError) as e:
    print(f"WARNING: FIREBASE INITIALIZATION FAILED: {e}")

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

@githublogin_bp.route('/github/callback', methods=['POST'])
def github_callback():
    data = request.get_json()
    code = data.get('code')

    if not code:
        return jsonify({'error': 'No code provided'}), 400

    # Exchange code for access token
    token_url = 'https://github.com/login/oauth/access_token'
    token_payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code,
    }
    token_headers = {'Accept': 'application/json'}

    try:
        token_res = requests.post(token_url, json=token_payload, headers=token_headers)
        token_res.raise_for_status()
        token_data = token_res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting access token: {e}")
        return jsonify({'error': 'Token exchange failed'}), 500

    access_token = token_data.get('access_token')
    if not access_token:
        print(f"Access token not in response: {token_data}")
        return jsonify({'error': 'No access token in response'}), 500

    # Get user info from GitHub
    user_url = 'https://api.github.com/user'
    user_headers = {'Authorization': f'token {access_token}'}

    try:
        user_res = requests.get(user_url, headers=user_headers)
        user_res.raise_for_status()
        user_data = user_res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting user from GitHub: {e}")
        return jsonify({'error': 'User fetch failed'}), 500

    # Save user data to Firebase
    try:
        save_user(user_data)
    except Exception as e:
        # If saving fails, we still proceed with login, but log the error.
        print(f"Failed to save user data: {e}")

    return jsonify({'user': user_data})
