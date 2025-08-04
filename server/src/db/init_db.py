"""
Database initialization script that handles both fresh deployments and migrations.
This ensures consistent database state regardless of deployment scenario.
"""
import os
import sqlite3
from pathlib import Path
from flask import current_app
from flask_migrate import upgrade, stamp
from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import text

from db.db import db


def get_alembic_config():
    """Get Alembic configuration."""
    migrations_dir = Path(__file__).parent.parent / "migrations"
    alembic_cfg = Config(str(migrations_dir / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(migrations_dir))
    return alembic_cfg


def database_exists(db_path):
    """Check if database file exists and has tables."""
    if not os.path.exists(db_path):
        return False

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        conn.close()
        return len(tables) > 0
    except Exception:
        return False


def get_current_migration_version(db_path):
    """Get the current migration version from alembic_version table."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT version_num FROM alembic_version LIMIT 1")
        result = cursor.fetchone()
        conn.close()
        return result[0] if result else None
    except Exception:
        return None


def alembic_version_table_exists(db_path):
    """Check if alembic_version table exists in the database."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='alembic_version'")
        result = cursor.fetchone()
        conn.close()
        return result is not None
    except Exception:
        return False


def get_latest_migration_revision():
    """Get the latest migration revision from migration files."""
    try:
        alembic_cfg = get_alembic_config()
        script_dir = ScriptDirectory.from_config(alembic_cfg)
        return script_dir.get_current_head()
    except Exception as e:
        current_app.logger.warning(f"Could not get latest migration revision: {e}")
        return None


def initialize_fresh_database():
    """Initialize a fresh database with current schema and mark latest migration as applied."""
    current_app.logger.info("Initializing fresh database...")
    
    # Create all tables using SQLAlchemy models
    db.create_all()
    
    # Get the latest migration revision
    latest_revision = get_latest_migration_revision()
    
    if latest_revision:
        current_app.logger.info(f"Marking migration {latest_revision} as applied...")
        
        # For fresh databases, skip Flask-Migrate stamp and create manually
        # This avoids potential circular dependency issues during initialization
        current_app.logger.info("Creating alembic_version table manually for fresh database...")
        
        try:
            # Use direct SQLite connection to avoid any SQLAlchemy session issues
            import sqlite3
            db_url = current_app.config['SQLALCHEMY_DATABASE_URI']
            if db_url.startswith('sqlite:///'):
                db_path = db_url.replace('sqlite:///', '')
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                cursor.execute("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)")
                cursor.execute("DELETE FROM alembic_version")  # Clear any existing records
                cursor.execute(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_revision}')")
                conn.commit()
                conn.close()
                current_app.logger.info(f"✅ Successfully created alembic_version table with version: {latest_revision}")
            else:
                # For non-SQLite databases, try SQLAlchemy approach
                with db.engine.connect() as conn:
                    conn.execute(text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)"))
                    conn.execute(text(f"DELETE FROM alembic_version"))
                    conn.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_revision}')"))
                    conn.commit()
                current_app.logger.info(f"✅ Successfully created alembic_version table with version: {latest_revision}")
                
        except Exception as e:
            current_app.logger.error(f"❌ Failed to create alembic_version table: {e}")
            # Continue anyway - the app will still work, just without migration tracking
            current_app.logger.warning("Continuing without migration tracking...")
    else:
        current_app.logger.warning("No migration files found. Database created without migration tracking.")
def upgrade_existing_database():
    """Run migrations on existing database."""
    current_app.logger.info("Running database migrations...")
    try:
        upgrade()
        current_app.logger.info("Database migrations completed successfully.")
    except Exception as e:
        current_app.logger.error(f"Migration failed: {e}")
        raise


def initialize_database():
    """
    Smart database initialization that handles both scenarios:
    1. Fresh deployment: Creates schema and marks latest migration as applied
    2. Existing deployment: Runs pending migrations
    """
    # Get database path from app config
    db_url = current_app.config['SQLALCHEMY_DATABASE_URI']
    if db_url.startswith('sqlite:///'):
        db_path = db_url.replace('sqlite:///', '')
    else:
        # For non-SQLite databases, always try to run migrations
        current_app.logger.info("Non-SQLite database detected. Running migrations...")
        upgrade_existing_database()
        return

    current_app.logger.info(f"Checking database at: {db_path}")

    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Check if database exists and has content
    db_exists = database_exists(db_path)

    if not db_exists:
        # Fresh deployment scenario
        current_app.logger.info("Fresh database deployment detected.")
        initialize_fresh_database()
    else:
        # Existing database scenario
        current_migration = get_current_migration_version(db_path)
        latest_migration = get_latest_migration_revision()
        alembic_table_exists = alembic_version_table_exists(db_path)

        current_app.logger.info(f"Existing database detected. Current version: {current_migration}, Latest: {latest_migration}")

        if current_migration is None:
            if alembic_table_exists:
                # alembic_version table exists but is empty - this is the edge case
                current_app.logger.warning("Database has empty alembic_version table. Populating with latest migration...")
                
                if latest_migration:
                    try:
                        # Insert the latest migration directly into the existing empty table
                        import sqlite3
                        conn = sqlite3.connect(db_path)
                        cursor = conn.cursor()
                        cursor.execute(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_migration}')")
                        conn.commit()
                        conn.close()
                        current_app.logger.info(f"✅ Populated empty alembic_version table with: {latest_migration}")
                    except Exception as e:
                        current_app.logger.error(f"❌ Failed to populate alembic_version table: {e}")
                        # Fall back to stamping approach
                        try:
                            stamp(revision=latest_migration)
                            current_app.logger.info("✅ Successfully stamped existing database with Flask-Migrate")
                        except Exception as stamp_e:
                            current_app.logger.error(f"❌ Stamping also failed: {stamp_e}")
                else:
                    current_app.logger.warning("No migrations found. Empty alembic_version table will remain empty.")
            else:
                # Database exists but no migration tracking at all
                current_app.logger.warning("Database exists but no migration version found.")
                
                if latest_migration:
                    current_app.logger.info(f"Stamping database with latest migration: {latest_migration}")
                    # Ensure alembic_version table exists and stamp with latest
                    try:
                        stamp(revision=latest_migration)
                        current_app.logger.info("Successfully stamped existing database with Flask-Migrate")
                    except Exception as e:
                        current_app.logger.warning(f"Flask-Migrate stamp failed: {e}")
                        # Create alembic_version table manually
                        try:
                            db.session.execute(text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)"))
                            db.session.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_migration}')"))
                            db.session.commit()
                            current_app.logger.info(f"Manually created alembic_version table and set version to {latest_migration}")
                        except Exception as manual_e:
                            current_app.logger.error(f"Failed to manually create alembic_version: {manual_e}")
                            db.session.rollback()
                else:
                    current_app.logger.warning("No migrations found. Database will continue without migration tracking.")
        elif current_migration != latest_migration:
            # Normal migration scenario - migrations are pending
            current_app.logger.info(f"Migrations pending. Upgrading from {current_migration} to {latest_migration}")
            upgrade_existing_database()
        else:
            # Database is up to date
            current_app.logger.info("Database is up to date. No migrations needed.")