from flask import Blueprint
from . import (
    auth
)

routes = Blueprint('auth_routes', __name__)

routes.register_blueprint(auth.auth, url_prefix='/auth')
