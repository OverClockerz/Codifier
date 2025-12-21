from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import mongo

api_player_bp = Blueprint("api_player", __name__)

@api_player_bp.route("/api/player/get", methods=["GET"])
def get_player():
    username=request.args.get("username")   

    if not username:
        return jsonify({"error": "Username required"}), 401

    player = mongo.db.players.find_one(
        {"username": username},
        {"_id": 0} 
    )

    if not player:
        return jsonify({"error": "Player not found"}), 404

    return jsonify(player), 200


@api_player_bp.route("/api/player/update", methods=["POST"])
def save_player():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    if not username:
        return jsonify({"error": "Username required"}), 401

    # Enforce consistency
    data["lastLoginDate"] = datetime.utcnow().isoformat()

    # Never allow username change
    data.pop("_id", None)

    result = mongo.db.players.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )

    return jsonify({
        "message": "Player state saved successfully",
        "created": bool(result.upserted_id)
    }), 200
