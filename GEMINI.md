# Gemini Code Assistant Context

This document provides context for the Gemini code assistant to understand the Tidymate project.

## Project Overview

Tidymate is a self-hosted web application designed to help with household organization. It allows users to create households, invite members, and manage shared tasks like to-dos and chores, as well as personal reminders.

The application is composed of a:

*   **Frontend:** A SvelteKit application located in the `web` directory.
*   **Backend:** A Python Flask server located in the `server` directory.
*   **Deployment:** The application is designed to be deployed using Docker, with configuration provided in the `docker` directory.


## Building and Running

### Docker (Recommended)

The easiest way to run the project is with Docker Compose:

```bash
docker-compose up -d
```

This will build the necessary images and start the frontend and backend services. The application will be available at `http://localhost:3000`.

### Development

**Frontend:**

To run the frontend in development mode:

```bash
source .env
cd web
npm install
npm run dev
```

**Backend:**

To run the backend in development mode:

```bash
source .env
source venv/bin/activate
cd server
pip install -r requirements.txt
python src/main.py
```

**Database**

To run the backend a redis server is necessary which can be lanched with

```bash
redis-server
```

## Development Conventions

*   **Code Style:** The project uses Prettier for code formatting. To format the code, run for the frontend:
    ```bash
    cd web
    npm run format
    ```
    and for the backend:
    ```bash
    cd server
    autopep8 --verbose --recursive --in-place --aggressive --aggressive .
    ```

*   **Linting:** The project uses ESLint for linting. To check for linting errors, run:
    ```bash
    cd web
    npm run lint
    ```
*   **API:** The frontend communicates with the backend via a REST API. The backend API routes are defined in the `server/src/routes` directory.
