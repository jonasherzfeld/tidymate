from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


def initialize_db(app):
    """
    Initialize the database without running migrations yet.
    """
    # Use the globally defined db and bcrypt instances
    db.init_app(app)
    bcrypt.init_app(app)
    return db


def initialize_database_with_migrations(app):
    """
    Run smart database initialization after Flask-Migrate is set up.
    """
    # Import here to avoid circular imports
    from .init_db import initialize_database
    
    with app.app_context():
        initialize_database()
