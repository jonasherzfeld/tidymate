#!/bin/bash
set -e

run() {
    # Run Redis
    redis-server --daemonize yes

    # Ensure data directory exists
    mkdir -p /app/data

    # Run database migrations before starting the application
    echo "Checking database and running migrations..."
    cd /app/server/src

    # Check if database exists
    DB_PATH="/app/data/data.sqlite3"

    if [ ! -f "$DB_PATH" ]; then
        echo "Database does not exist. No migration needed..."
        # Create empty database and run initial migration
    else
        echo "Database exists. Checking if it has migration tracking..."
        # Check if alembic_version table exists
        if sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name='alembic_version';" | grep -q "alembic_version"; then
            echo "Migration tracking exists. Running upgrade..."
            flask --app app db upgrade
        else
            echo "No migration tracking found. Stamping database with current migration..."
            # Database exists but no migration tracking - stamp it with the latest migration
            flask --app app db stamp head
            echo "Database stamped successfully. No further migrations needed."
        fi
    fi
    echo "Database setup completed"

    echo "Starting backend server..."
    cd /app/server
    python src/main.py &

    # Start the SvelteKit frontend on port 3000 (different from Nginx port)
    echo "Starting frontend server on port 3000 with increased memory..."
    cd /app/web
    node build &

    # Start nginx after the frontend server is running
    echo "Starting Nginx..."
    mkdir -p /app/logs
    service nginx start
    echo "Tidymate started successfully!"
}

run

wait -n
exit $?
