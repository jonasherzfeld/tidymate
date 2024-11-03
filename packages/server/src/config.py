import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask
from flask_cors import CORS
from flask_session import Session
import redis
import os

app = Flask(__name__, template_folder='public')
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173", os.environ['FRONTEND_URL']]}})

app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url(os.environ['REDIS_URL'])
server_session = Session(app)

DEV_MODE = os.environ["DEV_MODE"] == 'True'

if DEV_MODE:
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099"
    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8070"
    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8070"
    os.environ["FIREBASE_STORAGE_EMULATOR_HOST"] = "127.0.0.1:9199"
    os.environ["STORAGE_EMULATOR_HOST"] = "http://127.0.0.1:9199"

service_account = {
    "type": os.environ['TYPE'],
    "project_id": os.environ['PROJECT_ID'],
    "private_key_id": os.environ['PRIVATE_KEY_ID'],
    "private_key": os.environ['PRIVATE_KEY'].replace(r'\n', '\n'),
    "client_email": os.environ['CLIENT_EMAIL'],
    "client_id": os.environ['CLIENT_ID'],
    "auth_uri": os.environ['AUTH_URI'],
    "token_uri": os.environ['TOKEN_URI'],
    "auth_provider_x509_cert_url": os.environ['AUTH_PROVIDER_X509_CERT_URL'],
    "client_x509_cert_url": os.environ['CLIENT_X509_CERT_URL'],
    "universe_domain": os.environ['UNIVERSE_DOMAIN']
    }
cred = credentials.Certificate(service_account)
firebase_admin.initialize_app(cred)

db = firestore.client()
bucket = storage.bucket(os.environ['STORAGE_BUCKET'])
