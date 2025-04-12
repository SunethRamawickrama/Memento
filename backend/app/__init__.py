from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    #app.config.from_object(Config)
    CORS(app)

    from .routes import main
    app.register_blueprint(main)

    with app.app_context():
        from . import routes

    return app