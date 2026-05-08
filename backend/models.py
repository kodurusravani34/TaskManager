import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def generate_uuid():
    return str(uuid.uuid4())


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="MEMBER")  # ADMIN or MEMBER
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    created_projects = db.relationship(
        "Project", backref="creator", lazy="dynamic", foreign_keys="Project.created_by_id"
    )
    assigned_tasks = db.relationship(
        "Task", backref="assigned_to", lazy="dynamic", foreign_keys="Task.assigned_to_id"
    )
    created_tasks = db.relationship(
        "Task", backref="created_by", lazy="dynamic", foreign_keys="Task.created_by_id"
    )
    memberships = db.relationship("ProjectMember", backref="user", lazy="dynamic")

    def to_dict(self, include_counts=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_counts:
            data["_count"] = {
                "createdProjects": self.created_projects.count(),
                "assignedTasks": self.assigned_tasks.count(),
                "memberships": self.memberships.count(),
            }
        return data


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_by_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    tasks = db.relationship(
        "Task", backref="project", lazy="dynamic", cascade="all, delete-orphan"
    )
    members = db.relationship(
        "ProjectMember", backref="project", lazy="dynamic", cascade="all, delete-orphan"
    )

    def to_dict(self, include_creator=False, include_counts=False):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "createdById": self.created_by_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_creator and self.creator:
            data["creator"] = {
                "id": self.creator.id,
                "name": self.creator.name,
                "email": self.creator.email,
            }
        if include_counts:
            data["_count"] = {
                "tasks": self.tasks.count(),
                "members": self.members.count(),
            }
        return data


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(1000), nullable=True)
    status = db.Column(db.String(20), nullable=False, default="TODO")  # TODO, IN_PROGRESS, COMPLETED
    priority = db.Column(db.String(20), nullable=False, default="MEDIUM")  # LOW, MEDIUM, HIGH
    due_date = db.Column(db.DateTime, nullable=True)
    project_id = db.Column(
        db.String(36), db.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    assigned_to_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_by_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self, include_relations=False):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "dueDate": self.due_date.isoformat() if self.due_date else None,
            "projectId": self.project_id,
            "assignedToId": self.assigned_to_id,
            "createdById": self.created_by_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_relations:
            data["project"] = (
                {"id": self.project.id, "title": self.project.title}
                if self.project
                else None
            )
            data["assignedTo"] = (
                {
                    "id": self.assigned_to.id,
                    "name": self.assigned_to.name,
                    "email": self.assigned_to.email,
                }
                if self.assigned_to
                else None
            )
            data["createdBy"] = (
                {"id": self.created_by.id, "name": self.created_by.name}
                if self.created_by
                else None
            )
        return data


class ProjectMember(db.Model):
    __tablename__ = "project_members"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    project_id = db.Column(
        db.String(36), db.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint("project_id", "user_id", name="uq_project_user"),
    )

    def to_dict(self, include_user=False):
        data = {
            "id": self.id,
            "projectId": self.project_id,
            "userId": self.user_id,
            "joinedAt": self.joined_at.isoformat() if self.joined_at else None,
        }
        if include_user and self.user:
            data["user"] = {
                "id": self.user.id,
                "name": self.user.name,
                "email": self.user.email,
                "role": self.user.role,
            }
        return data
