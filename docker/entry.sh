#!/bin/bash
set -e

run() {
    # Start node frontend
    cd /app/web
    node build &

    # Run Redis
    redis-server --daemonize yes

    # Running database migrations
    cd /app/server/src
    flask --app app db upgrade

    # Run the backend
    cd /app/server
    exec python src/main.py &
}

run

wait -n
exit $?
