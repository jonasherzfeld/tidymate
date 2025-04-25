from flask import Blueprint
from . import (
    stats
)

routes = Blueprint('stats_routes', __name__)

routes.register_blueprint(stats.stats, url_prefix='/stats')
