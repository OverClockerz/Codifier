from flask import Blueprint, abort, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash,check_password_hash
from extensions import mongo

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

    if mongo.db.user.find_one({"email": email}):
        return {"message": ["Email already registered"]}, 400
    mongo.db.user.insert_one({
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

    user= mongo.db.user.find_one({"email": email})

    if user and check_password_hash(user["password"], password):
        return {"message": [True]}, 200

    return {"message": ["Invalid credentials"]}, 401


