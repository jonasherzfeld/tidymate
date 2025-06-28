from flask import Blueprint
from . import (
    auth,
    file,
    items,
    notifications
    # stats
)

routes = Blueprint('routes', __name__)

routes.register_blueprint(auth.routes)
routes.register_blueprint(file.routes)
routes.register_blueprint(items.routes)
routes.register_blueprint(notifications.routes)
# routes.register_blueprint(stats.routes)
