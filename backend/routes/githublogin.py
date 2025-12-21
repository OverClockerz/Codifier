
import firebase_admin
from firebase_admin import credentials, db
from flask import request, Blueprint, redirect
from dotenv import load_dotenv
import os
import requests

load_dotenv()

githublogin_bp = Blueprint('githublogin', __name__)

# --- Firebase Initialization ---
def initialize_firebase():
    if not firebase_admin._apps:
        key_path = 'serviceAccountKey.json'
        database_url = os.getenv('FIREBASE_DATABASE_URL')

        if not database_url:
            raise ValueError("FIREBASE_DATABASE_URL environment variable not set.")

        if not os.path.exists(key_path):
            raise FileNotFoundError(f"serviceAccountKey.json not found at {key_path}")

        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': database_url
        })

def save_user(user_data: dict):
    user_id = user_data.get('login')
    if not user_id:
        print("Could not save user, 'login' ID missing from user data.")
        return
    
    try:
        user_ref = db.reference(f'users/{user_id}')
        user_ref.set(user_data)
        print(f"Successfully saved user '{user_id}' to the database.")
    except Exception as e:
        print(f"An error occurred while saving user data: {e}")

try:
    initialize_firebase()
except (ValueError, FileNotFoundError) as e:
    print(f"WARNING: FIREBASE INITIALIZATION FAILED: {e}")

# --- GitHub OAuth Logic ---

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

@githublogin_bp.route('/github/callback') # Defaults to GET
def github_callback():
    code = request.args.get('code')
    if not code:
        return redirect(f'{FRONTEND_URL}/?error=no_code')

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
        return redirect(f'{FRONTEND_URL}/?error=token_exchange_failed')

    access_token = token_data.get('access_token')
    if not access_token:
        print(f"Access token not in response: {token_data}")
        return redirect(f'{FRONTEND_URL}/?error=no_access_token')

    # Get user info from GitHub
    user_url = 'https://api.github.com/user'
    user_headers = {'Authorization': f'token {access_token}'}
    
    try:
        user_res = requests.get(user_url, headers=user_headers)
        user_res.raise_for_status()
        user_data = user_res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting user from GitHub: {e}")
        return redirect(f'{FRONTEND_URL}/?error=user_fetch_failed')
    
    username = user_data.get('login')
    if not username:
        print(f"Username not in user data: {user_data}")
        return redirect(f'{FRONTEND_URL}/?error=no_username')

    # Save user data to Firebase
    if firebase_admin._apps:
        save_user(user_data)
    else:
        print("Firebase not initialized. Skipping user save.")
    
    # Redirect to frontend
    return redirect(f'{FRONTEND_URL}/?username={username}')
