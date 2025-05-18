from flask import Blueprint
from . import (
    chores,
    items,
    reminders,
)

routes = Blueprint('items_routes', __name__)

routes.register_blueprint(items.items, url_prefix='/items')
routes.register_blueprint(chores.chores, url_prefix='/chores')
routes.register_blueprint(reminders.reminders, url_prefix='/reminders')
