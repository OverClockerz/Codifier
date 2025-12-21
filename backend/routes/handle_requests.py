from flask import Blueprint, abort, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash,check_password_hash
from firebase_admin import db

handler_bp = Blueprint('handler', __name__) 

@handler_bp.route("/user/registration", methods=["GET", "POST"])
def handle_registration():
    token= request.headers.get('X-Internal-Request')
    if token != 'True':
        return redirect(url_for("index.index"))
    data= request.get_json()
    name= data.get("name", "")
    email= data.get("email", "")
    password= data.get("password", "")

    users_ref = db.reference('users')
    if users_ref.order_by_child('email').equal_to(email).get():
        return {"message": ["Email already registered"]}, 400
    
    users_ref.push({
        "name": name, 
        "email": email,
        "password": generate_password_hash(password)
    })
    return {"message": ["User registered successfully"]}, 200

@handler_bp.route("/user/login", methods=["GET", "POST"])
def handle_login():
    token= request.headers.get('X-Internal-Request')
    if token != 'True':
        return redirect(url_for("index.index"))
    data= request.get_json()
    email= data.get("email", "")
    password= data.get("password", "")

    users_ref = db.reference('users')
    user = users_ref.order_by_child('email').equal_to(email).get()

    if user:
        user_id = list(user.keys())[0]
        user_data = user[user_id]
        if check_password_hash(user_data["password"], password):
            return {"message": [True]}, 200

    return {"message": ["Invalid credentials"]}, 401


