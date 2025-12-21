from flask import Blueprint, render_template, request, session, redirect, url_for
from firebase_admin import db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    
    users_ref = db.reference('users')
    admins_ref = db.reference('admins')
    
    user_count = len(users_ref.get()) if users_ref.get() else 0
    admin_count = len(admins_ref.get()) if admins_ref.get() else 0
    
    return render_template("dashboard.html",user=session.get("user"), user_count=user_count, admin_count=admin_count)

@dashboard_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login.login"))   

@dashboard_bp.route("/dashboard/profile", methods=["GET","POST"])
def profile():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    
    email = session.get("email")
    admins_ref = db.reference('admins')
    user = admins_ref.order_by_child('email').equal_to(email).get()
    
    if user:
        user_id = list(user.keys())[0]
        user_data = user[user_id]
        admin_id = user_data.get("admin_id")
        username = user_data.get("name")
    else:
        admin_id = None
        username = None
        
    return render_template("profile.html", user=session.get("user"), admin_id=admin_id, username=username,email=email)

@dashboard_bp.route("/dashboard/search", methods=["GET", "POST"])
def search():
    if "user" not in session:
        return redirect(url_for("auth.auth"))
    
    query = request.args.get("query", "")
    # Implement search logic here, e.g., querying the database
    results = []  # Placeholder for search results

    return render_template("search_results.html", user=session.get("user"), query=query, results=results)
