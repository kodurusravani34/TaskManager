from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from models import db, User
from utils.api_error import ApiError
from middleware.middleware import authenticate, validate_json

auth_bp = Blueprint("auth", __name__)

SIGNUP_SCHEMA = {
    "name": {"required": True, "type": str, "min_length": 2},
    "email": {"required": True, "type": str},
    "password": {"required": True, "type": str, "min_length": 6},
    "role": {"required": False, "type": str, "enum": ["ADMIN", "MEMBER"]},
}

LOGIN_SCHEMA = {
    "email": {"required": True, "type": str},
    "password": {"required": True, "type": str, "min_length": 1},
}


@auth_bp.route("/signup", methods=["POST"])
@validate_json(SIGNUP_SCHEMA)
def signup():
    data = request.validated_data

    existing = User.query.filter_by(email=data["email"]).first()
    if existing:
        raise ApiError.conflict("Email already registered")

    hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt(12))

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed.decode("utf-8"),
        role=data.get("role", "MEMBER"),
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)

    return jsonify(
        {
            "success": True,
            "message": "Account created successfully",
            "data": {"user": user.to_dict(), "token": token},
        }
    ), 201


@auth_bp.route("/login", methods=["POST"])
@validate_json(LOGIN_SCHEMA)
def login():
    data = request.validated_data

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        raise ApiError.unauthorized("Invalid email or password")

    if not bcrypt.checkpw(data["password"].encode("utf-8"), user.password.encode("utf-8")):
        raise ApiError.unauthorized("Invalid email or password")

    token = create_access_token(identity=user.id)

    return jsonify(
        {
            "success": True,
            "message": "Login successful",
            "data": {"user": user.to_dict(), "token": token},
        }
    )


@auth_bp.route("/me", methods=["GET"])
@authenticate
def get_me():
    user = request.current_user
    return jsonify({"success": True, "data": user.to_dict(include_counts=True)})
