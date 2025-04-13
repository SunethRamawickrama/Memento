from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Import and register blueprints
    from .routes import main
    app.register_blueprint(main)

    # Import models explicitly, if needed for migration autoload.
    with app.app_context():
        from . import models  # Ensure all models are imported

    return app