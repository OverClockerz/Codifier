from flask import request, jsonify, Blueprint
from dotenv import load_dotenv
import os
import requests
from backend.db import save_user, initialize_firebase

load_dotenv()

githublogin_bp = Blueprint('githublogin', __name__)

# Initialize Firebase
initialize_firebase()

GITHUB_CLIENT_ID = os.getenv('Ov23liAw4jOzycLR8qW5')
GITHUB_CLIENT_SECRET = os.getenv('36fc0ec1f7d73665f12398cc541ce572fc143ee5')

@githublogin_bp.route('/github/callback', methods=['GET', 'POST'])
def github_callback():
    data = request.json
    code = data.get('code') if data else None

    if not code:
        return jsonify({'error': 'Missing code parameter'}), 400

    token_url = 'https://github.com/login/oauth/access_token'
    payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }

    token_response = requests.post(token_url, headers={'Accept': 'application/json'}, json=payload)
    token_data = token_response.json()

    access_token = token_data.get('access_token')
    if not access_token:
        return jsonify({'error': 'Failed to fetch access token', 'details': token_data}), 400

    user_url = 'https://api.github.com/user'
    user_response = requests.get(user_url, headers={
        'Authorization': f'token {access_token}'
    })
    user_data = user_response.json()

    # Save user data to Firebase
    save_user(user_data)

    username = user_data.get('login', 'Unknown')
    print(f"\n{'='*40}\n🚀 LOGIN SUCCESSFUL: {username}\n{'='*40}\n")

    return jsonify({
        'message': 'GitHub login successful',
        'user': user_data
    })