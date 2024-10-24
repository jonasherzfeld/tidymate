from auth import auth
from config import app
from view_models import UserViewModel
from views import views

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(views, url_prefix='/')

if __name__ == "__main__":
    app.run(debug=True)