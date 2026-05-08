from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Task, Project, ProjectMember
from utils.api_error import ApiError
from middleware.middleware import authenticate, authorize, validate_json
from sqlalchemy import or_

task_bp = Blueprint("tasks", __name__)

CREATE_TASK_SCHEMA = {
    "title": {"required": True, "type": str, "min_length": 1, "max_length": 200},
    "description": {"required": False, "type": str, "max_length": 1000, "nullable": True},
    "status": {"required": False, "type": str, "enum": ["TODO", "IN_PROGRESS", "COMPLETED"]},
    "priority": {"required": False, "type": str, "enum": ["LOW", "MEDIUM", "HIGH"]},
    "dueDate": {"required": False, "type": str, "nullable": True},
    "projectId": {"required": True, "type": str},
    "assignedToId": {"required": False, "type": str, "nullable": True},
}

UPDATE_TASK_SCHEMA = {
    "title": {"required": False, "type": str, "min_length": 1, "max_length": 200},
    "description": {"required": False, "type": str, "max_length": 1000, "nullable": True},
    "status": {"required": False, "type": str, "enum": ["TODO", "IN_PROGRESS", "COMPLETED"]},
    "priority": {"required": False, "type": str, "enum": ["LOW", "MEDIUM", "HIGH"]},
    "dueDate": {"required": False, "type": str, "nullable": True},
    "assignedToId": {"required": False, "type": str, "nullable": True},
}


@task_bp.route("/", methods=["GET"])
@authenticate
def get_tasks():
    user = request.current_user
    project_id = request.args.get("projectId")
    status = request.args.get("status")
    priority = request.args.get("priority")
    search = request.args.get("search")
    overdue = request.args.get("overdue")

    query = Task.query

    if user.role == "MEMBER":
        member_project_ids = [
            m.project_id for m in ProjectMember.query.filter_by(user_id=user.id).all()
        ]
        query = query.filter(
            or_(Task.assigned_to_id == user.id, Task.project_id.in_(member_project_ids))
        )

    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    if overdue == "true":
        query = query.filter(Task.due_date < datetime.utcnow(), Task.status != "COMPLETED")

    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify({"success": True, "data": [t.to_dict(include_relations=True) for t in tasks]})


@task_bp.route("/", methods=["POST"])
@authenticate
@authorize("ADMIN")
@validate_json(CREATE_TASK_SCHEMA)
def create_task():
    data = request.validated_data
    user = request.current_user

    project = Project.query.get(data["projectId"])
    if not project:
        raise ApiError.not_found("Project not found")

    assigned_to_id = data.get("assignedToId")
    if assigned_to_id:
        is_member = ProjectMember.query.filter_by(
            project_id=data["projectId"], user_id=assigned_to_id
        ).first()
        if not is_member:
            raise ApiError.bad_request("Assigned user is not a member of this project")

    due_date = None
    if data.get("dueDate"):
        try:
            due_date = datetime.fromisoformat(data["dueDate"].replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            try:
                due_date = datetime.strptime(data["dueDate"], "%Y-%m-%d")
            except ValueError:
                pass

    task = Task(
        title=data["title"],
        description=data.get("description"),
        status=data.get("status", "TODO"),
        priority=data.get("priority", "MEDIUM"),
        due_date=due_date,
        project_id=data["projectId"],
        assigned_to_id=assigned_to_id or None,
        created_by_id=user.id,
    )
    db.session.add(task)
    db.session.commit()

    return jsonify(
        {"success": True, "message": "Task created successfully", "data": task.to_dict(include_relations=True)}
    ), 201


@task_bp.route("/<task_id>", methods=["GET"])
@authenticate
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        raise ApiError.not_found("Task not found")
    return jsonify({"success": True, "data": task.to_dict(include_relations=True)})


@task_bp.route("/<task_id>", methods=["PUT"])
@authenticate
@validate_json(UPDATE_TASK_SCHEMA)
def update_task(task_id):
    data = request.validated_data
    user = request.current_user

    task = Task.query.get(task_id)
    if not task:
        raise ApiError.not_found("Task not found")

    if user.role == "MEMBER":
        if task.assigned_to_id != user.id:
            raise ApiError.forbidden("You can only update tasks assigned to you")
        if "status" in data:
            task.status = data["status"]
        db.session.commit()
        return jsonify(
            {"success": True, "message": "Task status updated", "data": task.to_dict(include_relations=True)}
        )

    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    if "status" in data:
        task.status = data["status"]
    if "priority" in data:
        task.priority = data["priority"]
    if "dueDate" in data:
        if data["dueDate"]:
            try:
                task.due_date = datetime.fromisoformat(data["dueDate"].replace("Z", "+00:00"))
            except (ValueError, AttributeError):
                try:
                    task.due_date = datetime.strptime(data["dueDate"], "%Y-%m-%d")
                except ValueError:
                    task.due_date = None
        else:
            task.due_date = None
    if "assignedToId" in data:
        task.assigned_to_id = data["assignedToId"] or None

    db.session.commit()
    return jsonify(
        {"success": True, "message": "Task updated successfully", "data": task.to_dict(include_relations=True)}
    )


@task_bp.route("/<task_id>", methods=["DELETE"])
@authenticate
@authorize("ADMIN")
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        raise ApiError.not_found("Task not found")

    db.session.delete(task)
    db.session.commit()
    return jsonify({"success": True, "message": "Task deleted successfully"})
