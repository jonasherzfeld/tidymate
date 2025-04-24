from firebase_admin import firestore, storage
import os

db = firestore.client()
bucket = storage.bucket(os.environ['STORAGE_BUCKET'])
