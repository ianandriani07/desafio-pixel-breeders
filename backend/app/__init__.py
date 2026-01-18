from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate
from .blueprints.ratings import bp as ratings_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    from app import models 

    from app.commands import bp as commands_bp
    app.register_blueprint(commands_bp)

    CORS(app, resources={r"/api/*": {"origins": app.config.get("FRONTEND_ORIGIN")}})

    app.register_blueprint(ratings_bp, url_prefix="/api/ratings")
    return app
