# Stage 1: Build the frontend
FROM node:18 AS frontend-builder

WORKDIR /app/web

# Copy frontend package files
COPY web/package.json web/package-lock.json* ./

# Install ALL dependencies (including dev dependencies) for the build process
RUN npm ci

# Copy the rest of the frontend code
COPY web/ ./

# Build the frontend
RUN npm run build

# Stage 2: Set up the backend and combine with frontend
FROM python:3.11-slim

WORKDIR /app

# Install Node.js and Redis in the final container
RUN apt-get update && apt-get install -y \
    curl \
    redis-server \
    sqlite3 \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies for the backend
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server/ ./server/

# Copy the built frontend from the previous stage - using the correct SvelteKit path
COPY --from=frontend-builder /app/web ./web

# Create a directory for any required data
RUN mkdir -p /app/data

# Expose ports for the services
EXPOSE 3000
ENV ORIGIN=http://localhost:3000

# Create a startup script
COPY ./docker/entry.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set the entrypoint
ENTRYPOINT ["/app/start.sh"]

LABEL org.opencontainers.image.source="https://github.com/jonasherzfeld/tidymate"
