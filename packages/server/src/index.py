from flask_login import LoginManager
from auth import auth
from config import app
from view_models import UserViewModel
from views import views

def run():
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(views, url_prefix='/')

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        user_vm = UserViewModel()
        return user_vm.get(id)

    app.run(debug=True)

if __name__ == "__main__":
    run()