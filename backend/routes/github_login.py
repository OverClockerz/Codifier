from flask import Blueprint, request, jsonify, redirect
import requests
from firebase_admin import db

github_login_bp = Blueprint('github_login_bp', __name__)

# Replace with your GitHub App credentials
CLIENT_ID = 'Ov23liAw4jOzycLR8qW5'
CLIENT_SECRET = '36fc0ec1f7d73665f12398cc541ce572fc143ee5'

@github_login_bp.route('/auth/github/callback')
def github_callback():
    code = request.args.get('code')

    # Exchange the code for an access token
    token_url = 'https://github.com/login/oauth/access_token'
    token_params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    token_res = requests.post(token_url, params=token_params, headers=headers)
    token_json = token_res.json()
    access_token = token_json['access_token']

    # Use the access token to get user info
    user_url = 'https://api.github.com/user'
    user_headers = {'Authorization': f'token {access_token}'}
    user_res = requests.get(user_url, headers=user_headers)
    user_json = user_res.json()

    # Save user data to Firebase
    ref = db.reference(f'users/{user_json["login"]}')
    ref.set(user_json)

    # Redirect to the frontend with user info
    return redirect(f'http://localhost:3000/profile?username={user_json["login"]}')
