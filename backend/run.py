from app_flask import create_app
from config import Config

app = create_app()

if __name__ == "__main__":
    print("✅ Database initialized successfully")
    print(f"🚀 ProjectPilot API running on port {Config.PORT}")
    print(f"📡 Health check: http://localhost:{Config.PORT}/api/health")
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)
