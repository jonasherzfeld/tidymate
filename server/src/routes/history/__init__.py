from flask import Blueprint
from . import (
    history
)

routes = Blueprint('history_routes', __name__)

routes.register_blueprint(history.history,
                          url_prefix='/history')
