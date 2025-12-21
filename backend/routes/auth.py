from flask import Blueprint, flash, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash
from firebase_admin import db

auth_bp = Blueprint('auth', __name__)



@auth_bp.route("/auth", methods=["GET", "POST"])
def auth():
    if request.method == "GET":
        return render_template("login.html")

    email = request.form.get("email", "")
    password = request.form.get("password", "")

    admins_ref = db.reference('admins')
    user = admins_ref.order_by_child('email').equal_to(email).get()

    if user:
        user_id = list(user.keys())[0]
        user_data = user[user_id]
        if check_password_hash(user_data["password"], password):
            session["user"] = user_data["name"]
            session["email"] = user_data["email"]
            session.permanent = False
            return redirect(url_for("dashboard.dashboard"))
    
    flash("Invalid credentials" if not user else "Password Incorrect", "error")
    return redirect(url_for("login.login"))
       