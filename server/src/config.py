from flask import Flask
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import redis
import os
from pathlib import Path

CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent
print(f"BASE_DIR: {BASE_DIR}")
REDIS_URL = "redis://localhost:6379"
SQL_DB_URL = f"sqlite:///{BASE_DIR}/data/data.sqlite3"

app = Flask(__name__, template_folder='public')
CORS(app, resources={
     r"/*": {"origins": [os.environ['BASE_URL']]}}, supports_credentials=True)

app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url(REDIS_URL)
app.config['SQLALCHEMY_DATABASE_URI'] = SQL_DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

server_session = Session(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
