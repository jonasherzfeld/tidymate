from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import os
from pathlib import Path
from flask import current_app
from alembic.config import Config
from alembic.script import ScriptDirectory


db = SQLAlchemy()
bcrypt = Bcrypt()


def get_alembic_config():
    """Get Alembic configuration with error handling."""
    try:
        # The migrations folder is in server/src/migrations
        migrations_dir = Path(__file__).parent.parent / "migrations"
        alembic_cfg = Config(str(migrations_dir / "alembic.ini"))
        alembic_cfg.set_main_option("script_location", str(migrations_dir))
        return alembic_cfg
    except Exception as e:
        print(f"Failed to get Alembic config: {e}")
        raise


def get_latest_migration_revision():
    """Get latest migration revision with improved error handling."""
    try:
        alembic_cfg = get_alembic_config()
        script_dir = ScriptDirectory.from_config(alembic_cfg)
        head = script_dir.get_current_head()

        if head is None:
            # Check if there are any migration files at all
            migrations_dir = Path(__file__).parent.parent / \
                "migrations" / "versions"
            if migrations_dir.exists():
                migration_files = list(migrations_dir.glob("*.py"))
                migration_files = [
                    f for f in migration_files if not f.name.startswith('__')]
                if migration_files:
                    print("Migration files exist but no head revision found")
                else:
                    print("No migration files found")

        return head

    except Exception as e:
        print(f"Could not get latest migration revision: {e}")
        return None


def initialize_db(app):
    """
    Initialize the database without running migrations yet.
    """
    # Use the globally defined db and bcrypt instances
    db.init_app(app)
    bcrypt.init_app(app)
    return db
