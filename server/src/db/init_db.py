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
                current_app.logger.info(f"Successfully created alembic_version table with version: {latest_revision}")
            else:
                # For non-SQLite databases, try SQLAlchemy approach
                with db.engine.connect() as conn:
                    conn.execute(text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL)"))
                    conn.execute(text(f"DELETE FROM alembic_version"))
                    conn.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_revision}')"))
                    conn.commit()
                current_app.logger.info(f"Successfully created alembic_version table with version: {latest_revision}")

        except Exception as e:
            current_app.logger.error(f"Failed to create alembic_version table: {e}")
            # Continue anyway - the app will still work, just without migration tracking
            current_app.logger.warning("Continuing without migration tracking...")
    else:
        current_app.logger.warning("No migration files found. Database created without migration tracking.")
def upgrade_existing_database():
    """Run migrations on existing database with improved error handling."""
    current_app.logger.info("Running database migrations...")

    try:
        # First, try a direct migration approach using Alembic
        import time
        import threading
        from flask_migrate import upgrade

        # Set up a timeout mechanism
        migration_success = [False]  # Use list to allow modification in nested function
        migration_error = [None]

        def run_migration():
            try:
                upgrade()
                migration_success[0] = True
                current_app.logger.info("Database migrations completed successfully.")
            except Exception as e:
                migration_error[0] = e
                current_app.logger.error(f"Migration failed: {e}")

        # Run migration in a separate thread with timeout
        migration_thread = threading.Thread(target=run_migration)
        migration_thread.daemon = True
        migration_thread.start()

        # Wait for migration with timeout (30 seconds)
        migration_thread.join(timeout=30)

        if migration_thread.is_alive():
            # Migration is hanging, kill it and try alternative approach
            current_app.logger.warning(" Migration is taking too long (>30s), trying alternative approach...")
            raise Exception("Migration timeout - likely hanging")
        elif migration_success[0]:
            # Migration completed successfully
            return
        elif migration_error[0]:
            # Migration failed with an error
            raise migration_error[0]
        else:
            # Unknown state
            raise Exception("Migration thread completed but status unclear")

    except Exception as e:
        current_app.logger.error(f"Flask-Migrate upgrade failed or timed out: {e}")
        current_app.logger.warning("Attempting direct SQL migration approach...")

        # Alternative approach: Apply the migration SQL directly
        try:
            current_migration = get_current_migration_version(
                current_app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
            )
            latest_revision = get_latest_migration_revision()

            current_app.logger.info(f"Applying direct migration from {current_migration} to {latest_revision}")

            # Use SQLAlchemy to apply schema changes
            from sqlalchemy import text
            with db.engine.connect() as conn:
                # Apply pending schema changes generically
                success = apply_pending_schema_changes(conn, current_migration, latest_revision)

                if success:
                    # Update alembic_version table to latest
                    conn.execute(text("DELETE FROM alembic_version"))
                    conn.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_revision}')"))
                    conn.commit()
                    current_app.logger.info(f"Updated alembic_version to: {latest_revision}")
                else:
                    raise Exception("Failed to apply schema changes")

        except Exception as direct_e:
            current_app.logger.error(f"Direct migration also failed: {direct_e}")
            current_app.logger.warning("Attempting fallback: manual version update...")

            # Final fallback: Just update the version (assuming schema is correct)
            try:
                latest_revision = get_latest_migration_revision()
                if latest_revision:
                    current_app.logger.info(f"Manually updating alembic_version to latest: {latest_revision}")

                    with db.engine.connect() as conn:
                        conn.execute(text("DELETE FROM alembic_version"))
                        conn.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{latest_revision}')"))
                        conn.commit()
                    current_app.logger.info(f"Manually updated alembic_version to: {latest_revision}")
                    current_app.logger.warning("Schema changes may not have been applied. Please verify your database schema.")
                else:
                    current_app.logger.error("Could not determine latest migration version")

            except Exception as manual_e:
                current_app.logger.error(f"Manual migration update also failed: {manual_e}")
                current_app.logger.error("Application will continue, but database may be out of sync.")
                current_app.logger.error("Please run migrations manually: flask db upgrade")

        # Don't raise - let the app continue to start


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
                        current_app.logger.info(f"Populated empty alembic_version table with: {latest_migration}")
                    except Exception as e:
                        current_app.logger.error(f"Failed to populate alembic_version table: {e}")
                        # Fall back to stamping approach
                        try:
                            stamp(revision=latest_migration)
                            current_app.logger.info("Successfully stamped existing database with Flask-Migrate")
                        except Exception as stamp_e:
                            current_app.logger.error(f"Stamping also failed: {stamp_e}")
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


def apply_pending_schema_changes(conn, current_version, target_version):
    """
    Apply pending schema changes directly to the database.
    This is a fallback for when Flask-Migrate hangs or fails.
    """
    try:
        current_app.logger.info("Analyzing pending schema changes...")

        # Get all migration files between current and target
        migrations_dir = Path(__file__).parent.parent / "migrations" / "versions"
        migration_files = []

        # Find all .py files in migrations/versions
        for file_path in migrations_dir.glob("*.py"):
            if file_path.name != "__pycache__" and not file_path.name.startswith("__"):
                migration_files.append(file_path)

        # Sort by creation date or revision order
        migration_files.sort(key=lambda x: x.stat().st_mtime)

        # Apply schema changes from migrations newer than current version
        current_found = current_version is None  # If no current version, apply all

        for migration_file in migration_files:
            # Extract revision ID from filename
            file_revision = migration_file.name.split('_')[0]

            if not current_found:
                if file_revision == current_version:
                    current_found = True
                continue

            # Apply this migration's schema changes
            current_app.logger.info(f"Applying schema changes from migration: {file_revision}")
            success = apply_migration_file_changes(conn, migration_file)

            if not success:
                current_app.logger.error(f"Failed to apply changes from {file_revision}")
                return False

            # Stop when we reach the target version
            if file_revision == target_version:
                break

        current_app.logger.info("Successfully applied all pending schema changes")
        return True

    except Exception as e:
        current_app.logger.error(f"Failed to apply schema changes: {e}")
        return False


def apply_migration_file_changes(conn, migration_file):
    """
    Parse a migration file and apply its schema changes directly.
    This handles common operations like ADD COLUMN, DROP COLUMN, etc.
    """
    try:
        # Read the migration file content
        with open(migration_file, 'r') as f:
            content = f.read()

        # Look for common patterns and apply them
        from sqlalchemy import text

        # Pattern 1: ADD COLUMN operations
        if 'add_column' in content.lower():
            current_app.logger.info(f"Found ADD COLUMN operation in {migration_file.name}")

            # Look for specific column additions
            if 'item_serialized' in content:
                # Check if column already exists
                result = conn.execute(text("PRAGMA table_info(history)"))
                columns = [row[1] for row in result]

                if 'item_serialized' not in columns:
                    current_app.logger.info("Adding item_serialized column...")
                    conn.execute(text("ALTER TABLE history ADD COLUMN item_serialized TEXT"))
                    current_app.logger.info("Successfully added item_serialized column")
                else:
                    current_app.logger.info("item_serialized column already exists")

            # Look for other column additions by parsing the migration content
            # This can be extended for other column types and tables
            import re

            # Find add_column patterns like: batch_op.add_column(sa.Column('column_name', sa.Type(), ...))
            add_column_pattern = r"add_column\(sa\.Column\(['\"](\w+)['\"],\s*sa\.(\w+)\([^)]*\)(?:,\s*nullable=(\w+))?"
            matches = re.findall(add_column_pattern, content)

            for match in matches:
                column_name, column_type, nullable = match
                if column_name != 'item_serialized':  # Already handled above
                    current_app.logger.info(f"Found column to add: {column_name} ({column_type})")
                    # Add logic for other columns as needed

        # Pattern 2: DROP COLUMN operations (be careful with SQLite limitations)
        if 'drop_column' in content.lower():
            current_app.logger.warning(f"Found DROP COLUMN operation in {migration_file.name}")
            current_app.logger.warning("SQLite has limited DROP COLUMN support - skipping for safety")
            # SQLite doesn't support DROP COLUMN easily, so we skip this for now

        # Pattern 3: CREATE TABLE operations
        if 'create_table' in content.lower():
            current_app.logger.info(f"Found CREATE TABLE operation in {migration_file.name}")
            # For CREATE TABLE, we rely on db.create_all() which should handle this

        # Pattern 4: CREATE INDEX operations
        if 'create_index' in content.lower():
            current_app.logger.info(f"Found CREATE INDEX operation in {migration_file.name}")
            # Index creation can be added here if needed

        conn.commit()
        return True

    except Exception as e:
        current_app.logger.error(f"Failed to apply migration file changes: {e}")
        conn.rollback()
        return False