from flask import request, redirect, Blueprint
from dotenv import load_dotenv
import os
import requests
from backend.db import initialize_firebase, save_user

load_dotenv()

# Initialize Firebase right away
initialize_firebase()

githublogin_bp = Blueprint('githublogin', __name__)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

@githublogin_bp.route('/github/callback', methods=['GET'])
def github_callback():
    code = request.args.get('code')
    if not code:
        # Redirect to frontend with an error
        return redirect("http://localhost:3000/?error=No+code+provided")

    # Exchange the code for an access token
    token_url = 'https://github.com/login/oauth/access_token'
    token_payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }
    token_headers = {'Accept': 'application/json'}
    
    token_res = requests.post(token_url, json=token_payload, headers=token_headers)
    if token_res.status_code != 200:
        return redirect("http://localhost:3000/?error=Token+exchange+failed")

    token_data = token_res.json()
    access_token = token_data.get('access_token')
    if not access_token:
        return redirect("http://localhost:3000/?error=Access+token+not+found")

    # Use the access token to get user info from GitHub
    user_url = 'https://api.github.com/user'
    user_headers = {'Authorization': f'token {access_token}'}
    user_res = requests.get(user_url, headers=user_headers)

    if user_res.status_code != 200:
        return redirect("http://localhost:3000/?error=Failed+to+get+user+data")

    user_data = user_res.json()
    
    # Save user data to Firebase using the new db module
    save_user(user_data)

    # Redirect to the frontend with the username
    username = user_data.get('login', 'Unknown')
    return redirect(f"http://localhost:3000/?username={username}")
