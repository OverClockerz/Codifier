from flask import Blueprint, request, jsonify
from extensions import mongo

api_quests_bp = Blueprint('api_quests', __name__)

@api_quests_bp.route("/api/quests/get", methods=["GET"])
def get_quests():
    username = request.args.get("username")
    zone = request.args.get("zone")

    if not username:
        return jsonify({"error": "Username parameter required"}), 400

    if not zone:
        return jsonify({"error": "Zone parameter required"}), 400

    player = mongo.db.players.find_one(
        {"username": username},
        {"_id": 0, "activeQuests": 1}
    )

    if not player or "activeQuests" not in player:
        return jsonify([]), 200


    quests = [
        quest for quest in player["activeQuests"]
        if quest.get("zone") == zone
    ]

    return jsonify(quests), 200


@api_quests_bp.route("/api/quests/update", methods=["POST"])
def update_user_quests():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    quests = data.get("quests")

    if not username:
        return jsonify({"error": "Username required"}), 401

    if not isinstance(quests, list):
        return jsonify({"error": "quests must be a list"}), 400

    result = mongo.db.players.update_one(
        {"username": username},
        {
            "$set": {
                "activeQuests": quests
            }
        },
        upsert=True
    )

    return jsonify({
        "message": "Quests updated successfully",
        "username": username,
        "count": len(quests),
        "created": bool(result.upserted_id)
    }), 200