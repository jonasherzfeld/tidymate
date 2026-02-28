#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"
VENV_DIR="$ROOT_DIR/venv"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PIDS=()
REDIS_STARTED_BY_US=false

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"

    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
            wait "$pid" 2>/dev/null || true
        fi
    done

    if $REDIS_STARTED_BY_US; then
        echo -e "${CYAN}Stopping Redis...${NC}"
        redis-cli shutdown 2>/dev/null || true
    fi

    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# --- Pre-flight checks ---

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found.${NC}"
    echo "Create it with at least: FLASK_SECRET_KEY, LOG_DEBUG, PUBLIC_DEV_MODE"
    exit 1
fi

for cmd in node npm python3 redis-server redis-cli; do
    if ! command -v "$cmd" &>/dev/null; then
        echo -e "${RED}Error: '$cmd' is not installed.${NC}"
        exit 1
    fi
done

if [ ! -d "$VENV_DIR" ]; then
    echo -e "${RED}Error: Python venv not found at $VENV_DIR${NC}"
    echo "Create it with: python3 -m venv venv && source venv/bin/activate && pip install -r server/requirements.txt"
    exit 1
fi

# --- Kill stale processes on ports ---

for port in 5001 3000; do
    stale_pid=$(lsof -ti :"$port" -s TCP:LISTEN 2>/dev/null)
    if [ -n "$stale_pid" ]; then
        echo -e "${YELLOW}Killing stale process on port $port (PID $stale_pid)...${NC}"
        kill "$stale_pid" 2>/dev/null
        sleep 0.5
    fi
done

# --- Load environment variables ---

echo -e "${CYAN}Loading environment from .env.local...${NC}"
source "$ENV_FILE"

# --- Ensure directories exist ---

mkdir -p "$ROOT_DIR/data" "$ROOT_DIR/logs"

# --- Start Redis ---

if redis-cli ping &>/dev/null; then
    echo -e "${GREEN}Redis is already running.${NC}"
else
    echo -e "${CYAN}Starting Redis...${NC}"
    redis-server --daemonize yes
    REDIS_STARTED_BY_US=true
    sleep 0.5
    if redis-cli ping &>/dev/null; then
        echo -e "${GREEN}Redis started.${NC}"
    else
        echo -e "${RED}Failed to start Redis.${NC}"
        exit 1
    fi
fi

# --- Start Backend ---
# exec replaces the subshell so the python process gets the PID directly

echo -e "${CYAN}Starting Flask backend (port 5001)...${NC}"
(
    source "$VENV_DIR/bin/activate"
    cd "$ROOT_DIR/server"
    exec python src/main.py
) &
PIDS+=($!)

# Give the backend a moment to initialize
sleep 1

# --- Start Frontend ---

echo -e "${CYAN}Starting SvelteKit frontend (port 3000)...${NC}"
(
    cd "$ROOT_DIR/web"
    exec npx vite dev --port 3000 --host
) &
PIDS+=($!)

# --- Ready ---

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Tidymate dev environment is running   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "  Frontend:  ${CYAN}http://localhost:3000${NC}"
echo -e "  Backend:   ${CYAN}http://localhost:5001${NC}"
echo -e "  Redis:     ${CYAN}localhost:6379${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop all services"
echo ""

# Wait for all background processes
wait
