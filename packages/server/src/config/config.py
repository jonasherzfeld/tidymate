import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask
from flask_cors import CORS
import os

from config.database import Database

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", os.environ['FRONTEND_URL']]}})

app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
cred = credentials.Certificate({
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
    })

firebase_admin.initialize_app(cred)
db = Database(firestore.client())
