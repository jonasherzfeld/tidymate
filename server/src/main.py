from app import create_app
from waitress import serve

if __name__ == "__main__":
    app = create_app()
    serve(app, port=5000, host="0.0.0.0")
