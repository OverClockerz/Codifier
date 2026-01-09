from flask import request
import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET", "dev_jwt_secret")

def get_payload():
    token = request.cookies.get("session_token")
    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    return payload