import os
from pathlib import Path
import redis
import yaml
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from flask import Flask
from logging.config import dictConfig
import sys

# Append src folder to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# fmt: off
from db.db import initialize_db
from config.settings import settings
from routes import routes
from utils.utils import check_deadlines
# fmt: on


CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent
REDIS_URL = "redis://localhost:6379"
SQL_DB_URL = f"sqlite:///{BASE_DIR}/data/data.sqlite3"
LOG_FILE = f"{BASE_DIR}/logs/tidymate.log"


def create_app():
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, 'w').close()
        print(f"Creating log file at {LOG_FILE}")

    with open(f'{CWD}/config/logging.conf', encoding='utf-8') as f:
        logging_config = yaml.safe_load(f.read())
        logging_config['handlers']['file']['filename'] = LOG_FILE
        dictConfig(logging_config)

    settings.load_environment_variables()

    do_log_debug = settings.VAR_LOG_DEBUG.lower()
    if do_log_debug in ('true', '1', 't'):
        logging.getLogger().setLevel(logging.DEBUG)

    app = Flask(__name__, template_folder='public')
    app.config['SECRET_KEY'] = settings.VAR_FLASK_SECRET_KEY
    app.config['SESSION_TYPE'] = 'redis'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_REDIS'] = redis.from_url(REDIS_URL)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQL_DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)
    Session(app)
    db = initialize_db(app)
    migrate = Migrate(app, db)

    # Initialize database with smart migration handling after Migrate is set up
    from db.db import initialize_database_with_migrations
    initialize_database_with_migrations(app)

    app.register_blueprint(routes)

    scheduler = BackgroundScheduler()

    def run_check_deadlines():
        with app.app_context():
            check_deadlines()

    scheduler.add_job(func=run_check_deadlines, trigger='cron',
                      hour=0, minute=0)  # Runs every day at 00:00 UTC
    # scheduler.add_job(
    #     func=run_check_deadlines,
    #     trigger='interval',
    #     minutes=1)  # Runs every minute
    scheduler.start()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
