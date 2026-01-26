from flask import Blueprint, flash, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash
from extensions import mongo

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/auth", methods=["GET", "POST"])
def auth():
    if request.method == "GET":
        return render_template("login.html")

    email = request.form.get("email", "")
    password = request.form.get("password", "")

    user=mongo.db.admins.find_one({"email": email})

    if  user and check_password_hash(user["password"], password):
        session["user"] = user["name"]
        session["email"] = user["email"]
        session.parmanent = False
        return redirect(url_for("dashboard.dashboard"))
    
    flash("Invalid credentials" if not user else "Password Incorrect", "error")
    return redirect(url_for("login.login"))
       