from flask import Blueprint, request, jsonify
import shortuuid
from pathlib import Path
import os

from db.db import db
from utils.utils import login_required

CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent.parent.parent

file = Blueprint('file', __name__)


@file.route('/upload', methods=['POST'])
@login_required
def upload_image(user):
    if 'file' not in request.files:
        return jsonify({
            "error": "No file part in POST"
        }), 401

    if 'file' not in request.files:
        return jsonify({
            "error": "No file part in POST"
        }), 401
    file_obj = request.files['file']

    file_ending = file_obj.content_type.split('/')[1]
    if file_ending not in ['jpeg', 'png', 'jpg']:
        return jsonify({
            "error": "Invalid file type"
        }), 401

    file_str = file_obj.read()

    filename = shortuuid.ShortUUID().random(length=8)
    thumbnail_url = f"{BASE_DIR}/data/userdata/{user.id}/{filename}.{file_ending}"
    os.makedirs(os.path.dirname(thumbnail_url), exist_ok=True)
    with open(thumbnail_url, "wb") as fh:
        fh.write(file_str)  # <-- Write bytes directly, no base64 decoding

    user.thumbnail = thumbnail_url
    db.session.commit()

    return jsonify({
        "thumbnail": thumbnail_url
    }), 200


@file.route('/delete', methods=['DELETE'])
@login_required
def delete_image(user):
    thumbnail_path = user.thumbnail
    if not os.path.isfile(thumbnail_path):
        return jsonify({
            "error": "File not found"
        }), 401

    os.remove(thumbnail_path)
    user.thumbnail = ""
    db.session.commit()

    return jsonify({
        "thumbnail": ""
    }), 200
