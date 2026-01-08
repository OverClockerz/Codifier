from flask import Blueprint, jsonify, make_response

auth_logout_bp = Blueprint("auth_logout", __name__)

@auth_logout_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({
        "message": "Logged out successfully"
    }))

    response.set_cookie(
        "session_token",          # 👈 MUST match login cookie name
        "",
        httponly=True,
        secure=True           # True in production (HTTPS)
        samesite="None",
        expires=0,
    )

    return response