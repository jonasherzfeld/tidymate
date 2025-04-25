from firebase_admin import storage

import os

bucket = storage.bucket(os.environ['STORAGE_BUCKET'])
