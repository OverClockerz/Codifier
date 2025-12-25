from flask import Blueprint, request, jsonify
from extensions import mongo
from utils.geminiapi import generate_response
import json
from utils.player_templates import MCQ_QUEST

api_quests_bp = Blueprint('api_quests', __name__)

#purelly for debugging purposes
@api_quests_bp.route("/api/quests/update", methods=["POST"])
def update_user_quests():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    quests = data.get("activeQuests")

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

@api_quests_bp.route("/api/quests/generate", methods=["GET"])

def generate_quests():

    quest_threshold = 13
    
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Username parameter required"}), 400

    player = mongo.db.players.find_one(
        {"username": username},
        {"_id": 0} 
    ) 

    if not player:
        return jsonify({"error": "Player not found"}), 404  
    
    quest_amount = quest_threshold - len(player.get("activeQuests", []))
    print(f"Generating {quest_amount} quests for user {username}")

    if quest_amount <= 0:
        return jsonify({"message": "Player has sufficient active quests"}), 200

    try:
        activeQuests = json.loads(generate_response(MCQ_QUEST, quest_amount))

    except Exception as e : 
        return jsonify({"error": "Failed to generate quests", "details": str(e)}), 500
    
    if activeQuests:
        mongo.db.players.update_one(
            {"username": username},
            {"$push": {"activeQuests": {"$each": activeQuests}}}
        )
    return jsonify({
        "message": "Quests generated successfully",     
        "generated_count": len(activeQuests),
        "activeQuests": activeQuests
    }), 200


