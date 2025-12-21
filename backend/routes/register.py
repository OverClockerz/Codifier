from flask import Blueprint, render_template,flash, request,redirect, url_for,session,jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from firebase_admin import db
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

    users_ref = db.reference('users')
    if users_ref.order_by_child('email').equal_to(email).get():
        flash("Email already registered!", "error")
        return  redirect(url_for("register.register"))
    
    admins_ref = db.reference('admins')
    if not admins_ref.order_by_child('admin_id').equal_to(admin_id).get():
        flash("Invalid Admin ID!", "error")
        return redirect(url_for("register.register"))
    
    new_admin_id=base64.b32encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    
    users_ref.push({
        "name": name,
        "email": email, 
        "password": password,
        "admin_id": new_admin_id

    })
    flash("User registered successfully!", "success")
    return redirect(url_for("login.login"))