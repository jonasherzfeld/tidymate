from flask import Blueprint
from . import (
    notifications
)

routes = Blueprint('notifications_routes', __name__)

routes.register_blueprint(notifications.notifications,
                          url_prefix='/notifications')
