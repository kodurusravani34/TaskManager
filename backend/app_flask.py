from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.url_map.strict_slashes = False

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=[Config.CLIENT_URL], supports_credentials=True)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.project_routes import project_bp
    from routes.task_routes import task_bp
    from routes.member_routes import member_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(member_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    # Health check
    @app.route("/api/health")
    def health():
        from datetime import datetime, timezone
        return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

    # 404 handler
    @app.errorhandler(404)
    def not_found(e):
        return {"success": False, "message": "Route not found"}, 404

    # Global error handler
    @app.errorhandler(Exception)
    def handle_error(e):
        from utils.api_error import ApiError
        if isinstance(e, ApiError):
            return {"success": False, "message": e.message}, e.status_code
        app.logger.error(f"Unhandled error: {e}")
        return {"success": False, "message": "Internal server error"}, 500

    # Create tables
    with app.app_context():
        db.create_all()

    return app
