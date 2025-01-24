from flask import Blueprint, request, jsonify
import shortuuid

from config import bucket
from auth import login_required
from view_models import UserViewModel, HouseViewModel

file = Blueprint('file', __name__)

user_vm = UserViewModel()
house_vm = HouseViewModel()


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
    file = request.files['file']

    file_ending = file.content_type.split('/')[1]
    if file_ending not in ['jpeg', 'png', 'jpg']:
        return jsonify({
            "error": "Invalid file type"
        }), 401

    file_content_type = file.content_type
    file_obj = file.read()

    filename = shortuuid.ShortUUID().random(length=8)
    blob = bucket.blob(f'userdata/{user.id}/{filename}.{file_ending}')
    blob.upload_from_string(file_obj, content_type=file_content_type)
    blob.make_public()
    thumbnail_url = blob.public_url
    user.thumbnail = thumbnail_url
    user_vm.update(user.id, user)

    return jsonify({
        "thumbnail": thumbnail_url
    }), 200


@file.route('/delete', methods=['DELETE'])
@login_required
def delete_image(user):
    file_path = user.thumbnail.split("tidy-mate.appspot.com/")[1]
    print(file_path)
    blob = bucket.blob(file_path)

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to delete is aborted if the object's
    # generation number does not match your precondition.
    # Fetch blob metadata to use in generation_match_precondition.
    blob.reload()
    generation_match_precondition = None
    generation_match_precondition = blob.generation

    blob.delete(if_generation_match=generation_match_precondition)

    user.thumbnail = ""
    user_vm.update(user.id, user)

    return jsonify({
        "thumbnail": ""
    }), 200
