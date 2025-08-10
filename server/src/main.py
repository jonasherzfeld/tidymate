from app import create_app
from waitress import serve

# Create app instance for Flask CLI
app = create_app()

if __name__ == "__main__":
    serve(app, port=5001, host="0.0.0.0")
