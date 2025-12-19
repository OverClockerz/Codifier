from flask import Blueprint, render_template, request, redirect, url_for,session

login_bp = Blueprint('login', __name__)

@login_bp.route("/login", methods=["GET","POST"])
def login():
    return render_template("login.html")