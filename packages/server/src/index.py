import os

from auth import auth
from config import app
from file import file
from items import items
from chores import chores

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(file, url_prefix='/file')
app.register_blueprint(items, url_prefix='/items')
app.register_blueprint(chores, url_prefix='/chores')

DEV_MODE = os.environ["DEV_MODE"] != 'False'
if __name__ == "__main__":
    app.run(debug=DEV_MODE)
