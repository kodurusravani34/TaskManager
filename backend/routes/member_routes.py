from flask import Blueprint, request, jsonify
from models import db, User, Project, ProjectMember, Task
from utils.api_error import ApiError
from middleware.middleware import authenticate, authorize, validate_json

member_bp = Blueprint("members", __name__)

ADD_MEMBER_SCHEMA = {
    "userId": {"required": True, "type": str},
}


@member_bp.route("/users", methods=["GET"])
@authenticate
def get_users():
    users = User.query.order_by(User.name.asc()).all()
    return jsonify({"success": True, "data": [u.to_dict() for u in users]})


@member_bp.route("/projects/<project_id>/members", methods=["POST"])
@authenticate
@authorize("ADMIN")
@validate_json(ADD_MEMBER_SCHEMA)
def add_member(project_id):
    data = request.validated_data
    user_id = data["userId"]

    project = Project.query.get(project_id)
    if not project:
        raise ApiError.not_found("Project not found")

    user = User.query.get(user_id)
    if not user:
        raise ApiError.not_found("User not found")

    existing = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if existing:
        raise ApiError.conflict("User is already a member of this project")

    member = ProjectMember(project_id=project_id, user_id=user_id)
    db.session.add(member)
    db.session.commit()

    return jsonify(
        {"success": True, "message": "Member added successfully", "data": member.to_dict(include_user=True)}
    ), 201


@member_bp.route("/projects/<project_id>/members/<user_id>", methods=["DELETE"])
@authenticate
@authorize("ADMIN")
def remove_member(project_id, user_id):
    membership = ProjectMember.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not membership:
        raise ApiError.not_found("Member not found in this project")

    db.session.delete(membership)
    Task.query.filter_by(project_id=project_id, assigned_to_id=user_id).update({"assigned_to_id": None})
    db.session.commit()

    return jsonify({"success": True, "message": "Member removed successfully"})
