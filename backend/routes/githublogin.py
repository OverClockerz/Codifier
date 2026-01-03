from flask import redirect, request, jsonify,Blueprint
from dotenv import load_dotenv
from utils.paid_leaves import calculate_paid_leaves
from extensions import mongo
from utils.player_templates import InitialPlayerState
from datetime import datetime
import copy
import os
import requests

load_dotenv()

githublogin_bp = Blueprint('githublogin', __name__)

GITHUB_CLIENT_ID=os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET=os.getenv("GITHUB_CLIENT_SECRET")

@githublogin_bp.route('/github/callback', methods=['GET'])
def github_callback():
    print("\n[DEBUG] Headers:", dict(request.headers))
    print("[DEBUG] Query Params:", request.args)

    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Missing code parameter'}), 400

    # Exchange code for access token
    token_response = requests.post(
        'https://github.com/login/oauth/access_token',
        headers={'Accept': 'application/json'},
        data={
            'client_id': GITHUB_CLIENT_ID,
            'client_secret': GITHUB_CLIENT_SECRET,
            'code': code
        }
    )

    token_data = token_response.json()
    access_token = token_data.get('access_token')

    if not access_token:
        return jsonify({
            'error': 'Failed to fetch access token',
            'details': token_data
        }), 400

    # Fetch GitHub user
    user_response = requests.get(
        'https://api.github.com/user',
        headers={'Authorization': f'token {access_token}'}
    )
    user_data = user_response.json()

    username = user_data.get('login')
    github_email = user_data.get('email') or f"{username}@no-email.github.com"
    github_id = user_data.get('id')
    avatar_url = user_data.get('avatar_url')

    existing_player = mongo.db.players.find_one({"username": username})

    if existing_player:
        calculate_paid_leaves(existing_player)
        mongo.db.players.update_one(
            {"username": username},
            {"$set": {"lastLoginDate": datetime.utcnow()}}
        )
    else:
        player = copy.deepcopy(InitialPlayerState)
        player["username"] = username
        player["githubinfo"] = {
            "github_id": str(github_id),
            "avatar_url": avatar_url,
            "github_email": github_email
        }
        player["lastLoginDate"] = datetime.utcnow()
        mongo.db.players.insert_one(player)

    return redirect(
        f"https://codifier-67782673-e903f.web.app/?username={username}"
    )  