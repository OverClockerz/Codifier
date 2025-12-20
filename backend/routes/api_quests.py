from flask import Blueprint, request, jsonify, session
from mock_db import get_player_by_email, update_player, get_quests_by_zone, get_quest_by_id
import time

api_quests_bp = Blueprint('api_quests', __name__)

@api_quests_bp.route("/api/quests", methods=["GET"])
def get_quests():
    zone = request.args.get("zone")
    if not zone:
        return jsonify([])
    
    quests = get_quests_by_zone(zone)
    return jsonify(quests)

@api_quests_bp.route("/api/quests/<quest_id>/start", methods=["POST"])
def start_quest(quest_id):
    email = session.get("email")
    if not email: return jsonify({"error": "Unauthorized"}), 401

    player = get_player_by_email(email)
    if not player: return jsonify({"error": "Player not found"}), 404

    quest = get_quest_by_id(quest_id)
    if not quest: return jsonify({"error": "Quest not found"}), 404

    # Check if already active
    if any(q['id'] == quest_id for q in player.get('activeQuests', [])):
         return jsonify({"error": "Already active"}), 400

    new_q = {**quest, "status": "in-progress", "startedAt": time.time() * 1000}
    
    # Update player state
    active_quests = player.get('activeQuests', [])
    active_quests.append(new_q)
    
    update_player(email, {"activeQuests": active_quests})
    
    return jsonify(new_q)

@api_quests_bp.route("/api/quests/<quest_id>/complete", methods=["POST"])
def complete_quest(quest_id):
    email = session.get("email")
    if not email: return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    score = data.get("performanceScore", 100)
    
    player = get_player_by_email(email)
    if not player: return jsonify({"error": "Player not found"}), 404
    
    quest = get_quest_by_id(quest_id)
    if not quest: return jsonify({"error": "Quest not found"}), 404
    
    # Calculate rewards
    exp = int(quest["expReward"] * (score / 100))
    money = int(quest["currencyReward"] * (score / 100))

    # Update stats
    new_exp = player["experience"] + exp
    new_currency = player["currency"] + money
    new_stress = max(0, min(100, player["stress"] + quest["stressImpact"]))
    new_mood = max(0, min(100, player["mood"] + quest["moodImpact"]))
    
    # Move quest from active to completed
    active_quests = [q for q in player.get("activeQuests", []) if q["id"] != quest_id]
    completed_quests = player.get("completedQuests", [])
    completed_quests.append({**quest, "status": "completed", "completedAt": time.time() * 1000, "score": score})

    # Update player in DB
    update_player(email, {
        "experience": new_exp,
        "currency": new_currency,
        "stress": new_stress,
        "mood": new_mood,
        "activeQuests": active_quests,
        "completedQuests": completed_quests
    })

    return jsonify({"quest": {**quest, "status": "completed"}, "rewards": {"exp": exp, "currency": money}})