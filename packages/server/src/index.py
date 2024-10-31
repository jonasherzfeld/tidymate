import os

from auth import auth
from config import app
from file import file
from views import views

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(file, url_prefix='/file')
app.register_blueprint(views, url_prefix='/')

DEV_MODE = os.environ["DEV_MODE"] == 'True'
if __name__ == "__main__":
    app.run(debug=DEV_MODE)
