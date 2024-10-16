from auth import auth
from config import app
from view_models import UserViewModel
from views import views

def run():
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(views, url_prefix='/')

    app.run(debug=True)

if __name__ == "__main__":
    run()