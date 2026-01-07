from flask import Blueprint, abort, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash,check_password_hash
from extensions import mongo

handler_bp = Blueprint('handler', __name__) 

@handler_bp.route("/api/quests", methods=["GET", "POST"])
def handle_quests():
    pass
@handler_bp.route("/api/shop/items", methods=["GET", "POST"])
def handle_shop_items():
    pass
