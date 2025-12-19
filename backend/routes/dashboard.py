from flask import Blueprint, render_template, request, session, redirect, url_for
from extensions import mongo

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    user_count=mongo.db.user.count_documents({})
    admin_count=mongo.db.admins.count_documents({})
    return render_template("dashboard.html",user=session.get("user"), user_count=user_count, admin_count=admin_count)

@dashboard_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login.login"))   

@dashboard_bp.route("/dashboard/profile", methods=["GET","POST"])
def profile():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    email=session.get("email")
    user=mongo.db.admins.find_one({"email": email})
    admin_id=user["admin_id"]
    username=user["name"]
    return render_template("profile.html", user=session.get("user"), admin_id=admin_id, username=username,email=email)

@dashboard_bp.route("/dashboard/search", methods=["GET", "POST"])
def search():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    
    query = request.args.get("query", "")
    # Implement search logic here, e.g., querying the database
    results = []  # Placeholder for search results

    return render_template("search_results.html", user=session.get("user"), query=query, results=results)
