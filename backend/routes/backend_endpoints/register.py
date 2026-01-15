from flask import Blueprint, render_template,flash, request,redirect, url_for
from werkzeug.security import generate_password_hash
from extensions import mongo
import secrets,base64

register_bp = Blueprint('register', __name__)

@register_bp.route("/register", methods=["GET","POST"])
def register():
    return render_template("register.html")


@register_bp.route("/registration", methods=["GET", "POST"])
def registration():
    email= request.form.get("email", "")
    password= generate_password_hash(request.form.get("password", ""))
    name= request.form.get("name", "")
    admin_id=request.form.get("admin_id","")

    if mongo.db.admins.find_one({"email": email}):
        flash("Email already registered!", "error")
        return  redirect(url_for("register.register"))
    
    if not mongo.db.admins.find_one({"admin_id": admin_id}):
        flash("Invalid Admin ID!", "error")
        return redirect(url_for("register.register"))
    
    new_admin_id=base64.b32encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    
    mongo.db.admins.insert_one({
        "name": name,
        "email": email, 
        "password": password,
        "admin_id": new_admin_id

    })
    flash("User registered successfully!", "success")
    return redirect(url_for("login.login"))