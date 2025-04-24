import os

from config import app
from routes import routes

app.register_blueprint(routes)

DEV_MODE = os.environ["DEV_MODE"] != 'False'
if __name__ == "__main__":
    app.run(debug=DEV_MODE)
