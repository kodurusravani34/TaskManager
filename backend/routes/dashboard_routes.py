from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models import Task, Project, ProjectMember
from middleware.middleware import authenticate
from sqlalchemy import or_

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@authenticate
def get_stats():
    user = request.current_user
    is_admin = user.role == "ADMIN"

    if is_admin:
        total_projects = Project.query.count()
        task_query = Task.query
    else:
        member_project_ids = [
            m.project_id for m in ProjectMember.query.filter_by(user_id=user.id).all()
        ]
        total_projects = len(member_project_ids)
        task_query = Task.query.filter(
            or_(Task.assigned_to_id == user.id, Task.project_id.in_(member_project_ids))
        )

    total_tasks = task_query.count()
    completed_tasks = task_query.filter(Task.status == "COMPLETED").count()
    in_progress_tasks = task_query.filter(Task.status == "IN_PROGRESS").count()
    todo_tasks = task_query.filter(Task.status == "TODO").count()

    overdue_tasks = task_query.filter(
        Task.due_date < datetime.now(timezone.utc), Task.status != "COMPLETED"
    ).count()
    pending_tasks = todo_tasks + in_progress_tasks

    tasks_by_status = [
        {"name": "To Do", "value": todo_tasks, "color": "#6b7280"},
        {"name": "In Progress", "value": in_progress_tasks, "color": "#9ca3af"},
        {"name": "Completed", "value": completed_tasks, "color": "#374151"},
    ]

    if is_admin:
        projects = Project.query.order_by(Project.created_at.desc()).limit(10).all()
    else:
        projects = (
            Project.query.filter(
                Project.id.in_([m.project_id for m in ProjectMember.query.filter_by(user_id=user.id).all()])
            )
            .order_by(Project.created_at.desc())
            .limit(10)
            .all()
        )

    project_progress = []
    for p in projects:
        tasks = Task.query.filter_by(project_id=p.id).all()
        total = len(tasks)
        completed = len([t for t in tasks if t.status == "COMPLETED"])
        name = p.title[:15] + "..." if len(p.title) > 15 else p.title
        project_progress.append({
            "name": name,
            "total": total,
            "completed": completed,
            "progress": round((completed / total) * 100) if total > 0 else 0,
        })

    recent_tasks = task_query.order_by(Task.updated_at.desc()).limit(5).all()

    return jsonify({
        "success": True,
        "data": {
            "totalProjects": total_projects,
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "pendingTasks": pending_tasks,
            "overdueTasks": overdue_tasks,
            "tasksByStatus": tasks_by_status,
            "projectProgress": project_progress,
            "recentTasks": [t.to_dict(include_relations=True) for t in recent_tasks],
        },
    })


@dashboard_bp.route("/overdue", methods=["GET"])
@authenticate
def get_overdue():
    user = request.current_user
    is_admin = user.role == "ADMIN"

    query = Task.query.filter(Task.due_date < datetime.now(timezone.utc), Task.status != "COMPLETED")

    if not is_admin:
        member_project_ids = [
            m.project_id for m in ProjectMember.query.filter_by(user_id=user.id).all()
        ]
        query = query.filter(
            or_(Task.assigned_to_id == user.id, Task.project_id.in_(member_project_ids))
        )

    tasks = query.order_by(Task.due_date.asc()).all()
    return jsonify({"success": True, "data": [t.to_dict(include_relations=True) for t in tasks]})
