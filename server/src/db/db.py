from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


def initialize_db(app):
    """
    Initialize the database and create all tables.
    """
    # Use the globally defined db and bcrypt instances
    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()
    return db
