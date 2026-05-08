from flask import Blueprint, request, jsonify
from models import db, Project, ProjectMember, Task
from utils.api_error import ApiError
from middleware.middleware import authenticate, authorize, validate_json

project_bp = Blueprint("projects", __name__)

PROJECT_SCHEMA = {
    "title": {"required": True, "type": str, "min_length": 1, "max_length": 100},
    "description": {"required": False, "type": str, "max_length": 500, "nullable": True},
}


@project_bp.route("/", methods=["GET"])
@authenticate
def get_projects():
    user = request.current_user

    if user.role == "ADMIN":
        projects = Project.query.order_by(Project.created_at.desc()).all()
    else:
        projects = (
            Project.query.join(ProjectMember)
            .filter(ProjectMember.user_id == user.id)
            .order_by(Project.created_at.desc())
            .all()
        )

    result = []
    for p in projects:
        data = p.to_dict(include_creator=True, include_counts=True)
        tasks = Task.query.filter_by(project_id=p.id).all()
        total = len(tasks)
        completed = len([t for t in tasks if t.status == "COMPLETED"])
        progress = round((completed / total) * 100) if total > 0 else 0
        data["progress"] = progress
        data["completedTasks"] = completed
        data["totalTasks"] = total
        result.append(data)

    return jsonify({"success": True, "data": result})


@project_bp.route("/", methods=["POST"])
@authenticate
@authorize("ADMIN")
@validate_json(PROJECT_SCHEMA)
def create_project():
    data = request.validated_data
    user = request.current_user

    project = Project(
        title=data["title"],
        description=data.get("description"),
        created_by_id=user.id,
    )
    db.session.add(project)
    db.session.flush()

    member = ProjectMember(project_id=project.id, user_id=user.id)
    db.session.add(member)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "message": "Project created successfully",
            "data": project.to_dict(include_creator=True, include_counts=True),
        }
    ), 201


@project_bp.route("/<project_id>", methods=["GET"])
@authenticate
def get_project(project_id):
    user = request.current_user
    project = Project.query.get(project_id)

    if not project:
        raise ApiError.not_found("Project not found")

    if user.role == "MEMBER":
        is_member = ProjectMember.query.filter_by(
            project_id=project_id, user_id=user.id
        ).first()
        if not is_member:
            raise ApiError.forbidden("You are not a member of this project")

    data = project.to_dict(include_creator=True)
    if project.creator:
        data["creator"]["role"] = project.creator.role

    tasks = (
        Task.query.filter_by(project_id=project_id)
        .order_by(Task.created_at.desc())
        .all()
    )
    data["tasks"] = [t.to_dict(include_relations=True) for t in tasks]

    members = (
        ProjectMember.query.filter_by(project_id=project_id)
        .order_by(ProjectMember.joined_at.desc())
        .all()
    )
    data["members"] = [m.to_dict(include_user=True) for m in members]

    total = len(tasks)
    completed = len([t for t in tasks if t.status == "COMPLETED"])
    data["progress"] = round((completed / total) * 100) if total > 0 else 0
    data["completedTasks"] = completed
    data["totalTasks"] = total

    return jsonify({"success": True, "data": data})


@project_bp.route("/<project_id>", methods=["PUT"])
@authenticate
@authorize("ADMIN")
@validate_json(PROJECT_SCHEMA)
def update_project(project_id):
    data = request.validated_data
    project = Project.query.get(project_id)

    if not project:
        raise ApiError.not_found("Project not found")

    project.title = data["title"]
    project.description = data.get("description")
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "message": "Project updated successfully",
            "data": project.to_dict(include_creator=True, include_counts=True),
        }
    )


@project_bp.route("/<project_id>", methods=["DELETE"])
@authenticate
@authorize("ADMIN")
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        raise ApiError.not_found("Project not found")

    db.session.delete(project)
    db.session.commit()

    return jsonify({"success": True, "message": "Project deleted successfully"})
