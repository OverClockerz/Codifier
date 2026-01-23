from datetime import datetime, timedelta
import time
from flask import Blueprint, request, jsonify
from extensions import mongo
from utils.geminiapi import generate_response
from utils.unix_overwrite import unix_overwrite
from utils.auth_helper import require_auth
import json
from utils.player_templates import CODING_QUEST, COMPREHENSIVE_QUEST, MCQ_QUEST, TYPING_QUEST

api_quests_bp = Blueprint('api_quests', __name__)

#purelly for debugging purposes
# @api_quests_bp.route("/api/quests/update", methods=["POST"])
# def update_user_quests():
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     username = data.get("username")
#     quests = data.get("activeQuests")

#     if not username:
#         return jsonify({"error": "Username required"}), 401

#     if not isinstance(quests, list):
#         return jsonify({"error": "quests must be a list"}), 400

#     result = mongo.db.players.update_one(
#         {"username": username},
#         {
#             "$set": {
#                 "activeQuests": quests
#             }
#         },
#         upsert=True
#     )

#     return jsonify({
#         "message": "Quests updated successfully",
#         "username": username,
#         "count": len(quests),
#         "created": bool(result.upserted_id)
#     }), 200

@api_quests_bp.route("/api/quests/generate", methods=["GET"])
@require_auth
def generate_quests():
    
    username = request.user

    zone = request.args.get("zone")

    quest_amount = int(request.args.get("quest_amount"))

    if not username:
        return jsonify({"error": "Username parameter required"}), 400

    player = mongo.db.players.find_one(
        {"username": username},
        {"_id": 0} 
    ) 

    if not player:
        return jsonify({"error": "Player not found"}), 404  
    
    print(f"Generating {quest_amount} quests for user {username}")

    if quest_amount <= 0:
        return jsonify({"message": "Cannot generate less than 1 quest"}), 200

    try:
        match(zone):
            case "workspace":   
                activeQuests = json.loads(generate_response([MCQ_QUEST,COMPREHENSIVE_QUEST,CODING_QUEST], quest_amount,zone))
            case "meeting-room":
                activeQuests = json.loads(generate_response([MCQ_QUEST,COMPREHENSIVE_QUEST,TYPING_QUEST], quest_amount,zone))
            case "game-lounge":
                activeQuests = json.loads(generate_response([MCQ_QUEST,COMPREHENSIVE_QUEST], quest_amount,zone))
            case _:
                return jsonify({"error": "Invalid zone"}), 400
        print(activeQuests)             

    except Exception as e : 
        return jsonify({"error": "Failed to generate quests", "details": str(e)}), 500
    
    activeQuests = unix_overwrite(activeQuests)
    print(activeQuests)

    if activeQuests:
        result = mongo.db.players.update_one(
            {"username": username},
            {"$push": {"activeQuests": {"$each": activeQuests}}}
        )
        if result.modified_count == 0:
            return jsonify({"error": "Failed to save quests to database", "matched": result.matched_count}), 500

    return jsonify({
        "message": "Quests generated successfully",     
        "generated_count": len(activeQuests),
        "activeQuests": activeQuests
    }), 200