from flask import Blueprint
from . import (
    file
)

routes = Blueprint('file_routes', __name__)

routes.register_blueprint(file.file, url_prefix='/file')
