from flask import Flask
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import redis
import os

app = Flask(__name__, template_folder='public')

app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url(os.environ['REDIS_URL'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLLITE_DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

server_session = Session(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
