"""Seed script to populate the database with demo data."""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta, timezone
import bcrypt
from app_flask import create_app
from models import db, User, Project, Task, ProjectMember

app = create_app()


def seed():
    with app.app_context():
        print("🌱 Seeding database...")

        # Clean existing data
        Task.query.delete()
        ProjectMember.query.delete()
        Project.query.delete()
        User.query.delete()
        db.session.commit()

        # Create users
        hashed = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt(12)).decode(
            "utf-8"
        )

        admin = User(
            name="Admin User",
            email="admin@projectpilot.com",
            password=hashed,
            role="ADMIN",
        )
        member1 = User(
            name="Jane Smith",
            email="jane@projectpilot.com",
            password=hashed,
            role="MEMBER",
        )
        member2 = User(
            name="Bob Wilson",
            email="bob@projectpilot.com",
            password=hashed,
            role="MEMBER",
        )
        db.session.add_all([admin, member1, member2])
        db.session.flush()
        print("✅ Users created")

        # Create projects
        project1 = Project(
            title="E-Commerce Platform",
            description="Build a modern e-commerce platform with React and Node.js. Features include product catalog, shopping cart, payment integration, and order management.",
            created_by_id=admin.id,
        )
        project2 = Project(
            title="Mobile Banking App",
            description="Design and develop a secure mobile banking application with real-time transaction tracking, bill payments, and account management.",
            created_by_id=admin.id,
        )
        project3 = Project(
            title="HR Management System",
            description="Internal HR management tool for employee onboarding, leave management, performance reviews, and payroll processing.",
            created_by_id=admin.id,
        )
        db.session.add_all([project1, project2, project3])
        db.session.flush()
        print("✅ Projects created")

        # Add members
        memberships = [
            ProjectMember(project_id=project1.id, user_id=admin.id),
            ProjectMember(project_id=project1.id, user_id=member1.id),
            ProjectMember(project_id=project1.id, user_id=member2.id),
            ProjectMember(project_id=project2.id, user_id=admin.id),
            ProjectMember(project_id=project2.id, user_id=member1.id),
            ProjectMember(project_id=project3.id, user_id=admin.id),
            ProjectMember(project_id=project3.id, user_id=member2.id),
        ]
        db.session.add_all(memberships)
        db.session.flush()
        print("✅ Project members added")

        # Create tasks
        now = datetime.now(timezone.utc)
        past_date = now - timedelta(days=2)
        future1 = now + timedelta(days=7)
        future2 = now + timedelta(days=14)
        future3 = now + timedelta(days=3)

        tasks = [
            # Project 1 tasks
            Task(
                title="Design product catalog UI",
                description="Create wireframes and high-fidelity mockups for the product listing and detail pages.",
                status="COMPLETED",
                priority="HIGH",
                due_date=past_date,
                project_id=project1.id,
                assigned_to_id=member1.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Implement shopping cart API",
                description="Build RESTful APIs for cart management including add, remove, update quantity, and checkout.",
                status="IN_PROGRESS",
                priority="HIGH",
                due_date=future1,
                project_id=project1.id,
                assigned_to_id=member2.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Setup payment gateway",
                description="Integrate Stripe payment gateway for secure online payments.",
                status="TODO",
                priority="HIGH",
                due_date=future2,
                project_id=project1.id,
                assigned_to_id=member1.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Write unit tests for cart",
                description="Comprehensive unit tests for shopping cart functionality.",
                status="TODO",
                priority="MEDIUM",
                due_date=future3,
                project_id=project1.id,
                assigned_to_id=member2.id,
                created_by_id=admin.id,
            ),
            # Project 2 tasks
            Task(
                title="Design authentication flow",
                description="Design secure biometric and PIN-based authentication for the banking app.",
                status="COMPLETED",
                priority="HIGH",
                due_date=past_date,
                project_id=project2.id,
                assigned_to_id=member1.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Build transaction history",
                description="Implement real-time transaction feed with filtering and search capabilities.",
                status="IN_PROGRESS",
                priority="MEDIUM",
                due_date=future1,
                project_id=project2.id,
                assigned_to_id=member1.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Implement bill payments",
                description="Add support for utility bill payments, mobile recharge, and scheduled payments.",
                status="TODO",
                priority="LOW",
                due_date=past_date,
                project_id=project2.id,
                assigned_to_id=member1.id,
                created_by_id=admin.id,
            ),
            # Project 3 tasks
            Task(
                title="Employee onboarding module",
                description="Build digital onboarding workflow with document upload and verification.",
                status="IN_PROGRESS",
                priority="HIGH",
                due_date=future2,
                project_id=project3.id,
                assigned_to_id=member2.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Leave management system",
                description="Implement leave request, approval workflow, and balance tracking.",
                status="TODO",
                priority="MEDIUM",
                due_date=future3,
                project_id=project3.id,
                assigned_to_id=member2.id,
                created_by_id=admin.id,
            ),
            Task(
                title="Setup CI/CD pipeline",
                description="Configure automated testing and deployment pipeline.",
                status="TODO",
                priority="LOW",
                due_date=past_date,
                project_id=project3.id,
                assigned_to_id=member2.id,
                created_by_id=admin.id,
            ),
        ]
        db.session.add_all(tasks)
        db.session.commit()

        print("✅ Tasks created")
        print("")
        print("🎉 Seed completed successfully!")
        print("")
        print("Demo Credentials:")
        print("  Admin: admin@projectpilot.com / password123")
        print("  Member 1: jane@projectpilot.com / password123")
        print("  Member 2: bob@projectpilot.com / password123")


if __name__ == "__main__":
    seed()
