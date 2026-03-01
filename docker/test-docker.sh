#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
IMAGE_NAME="tidymate:test"
CONTAINER_NAME="tidymate-test"
MAX_WAIT=120  # seconds to wait for healthy status

cleanup() {
    echo ""
    echo "=== Cleanup ==="
    if docker ps -q -f name="$CONTAINER_NAME" 2>/dev/null | grep -q .; then
        echo "Stopping container..."
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1
    fi
    if docker ps -aq -f name="$CONTAINER_NAME" 2>/dev/null | grep -q .; then
        echo "Removing container..."
        docker rm "$CONTAINER_NAME" >/dev/null 2>&1
    fi
}

trap cleanup EXIT

echo "=== Building Docker image ==="
docker build -t "$IMAGE_NAME" -f "$SCRIPT_DIR/Dockerfile" "$ROOT_DIR"

echo ""
echo "=== Starting container ==="
docker run -d \
    --name "$CONTAINER_NAME" \
    -p 3031:3030 \
    -e FLASK_SECRET_KEY="test_secret_key" \
    -e LOG_DEBUG="True" \
    "$IMAGE_NAME"

echo "Container started. Waiting for healthcheck (up to ${MAX_WAIT}s)..."
echo ""

elapsed=0
while [ $elapsed -lt $MAX_WAIT ]; do
    status=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")

    if [ "$status" = "healthy" ]; then
        echo "=== PASSED: Container is healthy ==="
        echo ""
        echo "Health details:"
        docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' "$CONTAINER_NAME"
        echo ""
        echo "Verifying endpoints manually..."
        echo "  Backend  (nginx -> flask):    $(curl -sf http://localhost:3031/api/health)"
        echo "  Frontend (nginx -> sveltekit): $(curl -sf http://localhost:3031/health)"
        echo ""
        echo "=== All checks passed ==="
        exit 0
    elif [ "$status" = "unhealthy" ]; then
        echo "=== FAILED: Container is unhealthy ==="
        echo ""
        echo "Health log:"
        docker inspect --format='{{json .State.Health}}' "$CONTAINER_NAME" | python3 -m json.tool
        echo ""
        echo "Container logs:"
        docker logs "$CONTAINER_NAME" --tail 50
        exit 1
    fi

    printf "\r  [%3ds] status: %s" "$elapsed" "$status"
    sleep 5
    elapsed=$((elapsed + 5))
done

echo ""
echo "=== FAILED: Timed out after ${MAX_WAIT}s ==="
echo ""
echo "Last health status: $(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME")"
echo ""
echo "Container logs:"
docker logs "$CONTAINER_NAME" --tail 50
exit 1
