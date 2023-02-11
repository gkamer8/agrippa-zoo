import os

from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    cors = CORS(app)

    app.config.from_mapping(
        SECRET_KEY='dev',
        CORS_HEADERS='Content-Type'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Start database
    from . import db
    db.init_app(app)

    # Register info blueprint
    from . import info
    app.register_blueprint(info.bp)

    from . import download
    app.register_blueprint(download.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import user
    app.register_blueprint(user.bp)

    from . import update
    app.register_blueprint(update.bp)

    @app.route("/")
    def index():
        return "We sail the ocean blue, and our saucy ship's a beauty."

    return app

