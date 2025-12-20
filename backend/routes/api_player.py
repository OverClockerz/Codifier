from flask import Blueprint, request, jsonify, session
from mock_db import get_player_by_email, update_player

api_player_bp = Blueprint('api_player', __name__)

@api_player_bp.route("/api/player", methods=["GET"])
def get_player():
    email = session.get("email")
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    player = get_player_by_email(email)
    return jsonify(player) if player else (jsonify({"error": "Not found"}), 404)

@api_player_bp.route("/api/player", methods=["PATCH"])
def patch_player():
    email = session.get("email")
    if not email: return jsonify({"error": "Unauthorized"}), 401

    updates = request.json
    player = get_player_by_email(email)
    
    if not player:
        return jsonify({"error": "Player not found"}), 404
    
    allowed = ["mood", "stress", "currency", "experience", "currentDay", "isBurntOut", "paidLeaves", "reputation", "currentMonthEarnings"]
    safe_updates = {k: v for k, v in updates.items() if k in allowed}
    
    updated_player = update_player(email, safe_updates)

    return jsonify(updated_player)