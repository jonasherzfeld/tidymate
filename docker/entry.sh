#!/bin/bash
set -e

run() {
    # Start node frontend
    cd /app/web
    node build &

    # Run Redis
    redis-server --daemonize yes

    # Run the backend (database initialization happens automatically)
    cd /app/server
    exec python src/main.py &
}

run

wait -n
exit $?
