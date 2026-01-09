from flask import Blueprint, jsonify, make_response

auth_logout_bp = Blueprint("auth_logout", __name__)

@auth_logout_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({
        "message": "Logged out successfully"
    }))

    response.set_cookie(
        "auth_token",          # 👈 MUST match login cookie name
        "",
        expires=0,
        httponly=True,
        samesite="Lax",
        secure=False           # True in production (HTTPS)
    )

    return response