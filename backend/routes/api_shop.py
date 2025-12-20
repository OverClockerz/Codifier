from flask import Blueprint, request, jsonify, session
from mock_db import get_player_by_email, update_player, get_all_shop_items, get_shop_item_by_id
import time

api_shop_bp = Blueprint('api_shop', __name__)

@api_shop_bp.route("/api/shop/items", methods=["GET"])
def get_items(): 
    return jsonify(get_all_shop_items())

@api_shop_bp.route("/api/shop/purchase", methods=["POST"])
def purchase():
    email = session.get("email")
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    item_id = request.json.get("itemId")
    item = get_shop_item_by_id(item_id)
    
    if not item: return jsonify({"error": "Item not found"}), 404
    
    player = get_player_by_email(email)
    if not player: return jsonify({"error": "Player not found"}), 404

    if player["currency"] < item["price"]: return jsonify({"error": "No funds"}), 400

    # Deduct money
    new_currency = player["currency"] - item["price"]
    
    # Add to inventory
    inventory = player.get("inventory", [])
    
    # Check if item exists in inventory
    existing_item = next((i for i in inventory if i["item"]["id"] == item_id), None)
    
    if existing_item:
        existing_item["quantity"] += 1
    else:
        inventory.append({
            "item": item,
            "quantity": 1,
            "purchasedAt": int(time.time() * 1000)
        })
        
    update_player(email, {
        "currency": new_currency,
        "inventory": inventory
    })
    
    return jsonify({"success": True, "newBalance": new_currency})