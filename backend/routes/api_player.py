from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import mongo
from utils.get_playload import get_payload
from utils.auth_helper import require_auth
import jwt
import os

api_player_bp = Blueprint("api_player", __name__)

# -------------------- GET PLAYER --------------------
@api_player_bp.route("/api/player/get", methods=["GET"])
@require_auth
def get_player():
    username = get_payload().get("sub")

    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    player = mongo.db.players.find_one(
        {"username": username},
        {"_id": 0}
    )

    if not player:
        return jsonify({"error": "Player not found"}), 404

    return jsonify(player), 200


# -------------------- UPDATE PLAYER --------------------
@api_player_bp.route("/api/player/update", methods=["POST"])
@require_auth
def save_player():
    username = get_payload().get("sub")

    if not username:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # ❌ NEVER trust client for identity
    data.pop("username", None)
    data.pop("_id", None)

    mongo.db.players.update_one(
        {"username": username},
        {"$set": data},
        upsert=False
    )

    return jsonify({
        "message": "Player state updated successfully"
    }), 200
