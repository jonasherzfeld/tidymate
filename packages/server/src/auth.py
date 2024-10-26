from datetime import datetime
from firebase_admin import auth as fb_auth
from flask import Blueprint, request, jsonify, session
from functools import wraps
import os
import requests
import shortuuid
import uuid
import redis

from models import User, House
from view_models import UserViewModel, HouseViewModel

auth = Blueprint('auth', __name__)

def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        try:
            user_id = session.get('user_id')
        except ConnectionRefusedError or redis.exceptions.ConnectionError:
            return jsonify({"error": "Connection error on internal Session DB"}), 500

        if user_id:
            user = UserViewModel().get(user_id)
            if user:
                # Success!
                return function_to_protect(user, *args, **kwargs)
            else:
                return jsonify({"error": "Invalid user"}), 401
        else:
            return jsonify({"error": "Unauthorized"}), 401
    return wrapper

def validate_house_member(user):
    if not user.house_id:
        return jsonify({
            "error": "Not house id given"}), 400

    house = HouseViewModel().get(user.house_id)
    if not house:
        return House(), jsonify({
            "error": "House not found"}), 400
    if not house.members or not user.id in house.members:
        return House(), jsonify({
            "error": "User not found in house"}), 402

    return house, jsonify({}), 200

@auth.route('/login', methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    identity_tool_kit_id = os.getenv("API_KEY")
    identity_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={identity_tool_kit_id}"

    user_auth_response = requests.post(
        url=identity_url,
        json={
            "email": email,
            "password": password,
            "returnSecureToken":True
        }
    )

    if user_auth_response.status_code != 200:
        return jsonify({"error": "Incorrect credentials"}), user_auth_response.status_code

    user_data = fb_auth.get_user_by_email(email)
    if user_data:
        try:
            session["user_id"] = user_data.uid
        except ConnectionError:
            return jsonify({"error": "Connection error on internal Session DB"}), 500

        return jsonify({
            "id": user_data.uid,
            "email": user_data.email,
        }), 200
    else:
        return jsonify({"error": "Email does not exist."}), 404


@auth.route('/logout', methods=["POST"])
def logout():
    try:
        session.clear()
    except ConnectionError:
        return jsonify({"error": "Connection error on internal Session DB"}), 500

    return jsonify({}), 200


@auth.route('/register', methods=["POST"])
def register():
    try:
        email = request.json['email']
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        password = request.json['password']
        join_id = request.json['join_id']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists in Database ort Authentication
    user_vm = UserViewModel()
    db_user = user_vm.filter(email)
    try:
        auth_user = fb_auth.get_user_by_email(email)
    except fb_auth.UserNotFoundError:
        auth_user = None

    if join_id and join_id != "null":
        house_vm = HouseViewModel()
        db_house_list = house_vm.filter("join_id", join_id)
        if len(db_house_list) != 1:
            return jsonify({"error": "Invalid House ID"}), 404
        db_house = db_house_list[0]
        house_id = db_house.id
    else:
        house_id = None

    if db_user or auth_user:
        return jsonify({"error": "Email already exists."}), 409
    else:
        full_name = first_name + " " + last_name
        fb_user = fb_auth.create_user(email=email, password=password,
                                        display_name=full_name)
        new_user = User(id=fb_user.uid,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        joined_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        house_id=house_id,
                        is_admin=False)
        user_vm.set(fb_user.uid, new_user)

        if house_id:
            db_house.members.append(fb_user.uid)
            house_vm.update(house_id, db_house)

        try:
            session["user_id"] = fb_user.uid
        except ConnectionError:
            return jsonify({"error": "Connection error on internal Session DB"}), 500


    return jsonify({
        "id": fb_user.uid,
        "email": email,
        "house_id": house_id
    }), 200


@auth.route('/register_house', methods=["POST"])
@login_required
def register_house(user):
    try:
        house_name = request.json['house_name']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists in Database ort Authentication
    house_vm = HouseViewModel()
    db_house = house_vm.filter("name", house_name)

    if db_house:
        return jsonify({"error": "House name already exists."}), 409

    new_house = House(id=str(uuid.uuid4()),
                      name=house_name,
                      city=None,
                      country=None,
                      created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                      join_id= None,
                      members=[user.id])
    house_vm.set(new_house.id, new_house)

    user.house_id = new_house.id
    user.is_admin = True
    UserViewModel().update(user.id, user)

    return jsonify({
        "house_name": new_house.name,
        "house_id": new_house.id
    }), 200


@auth.route('/activate_join', methods=["POST"])
@login_required
def activate_join(user):
    if not user.is_admin:
        return jsonify({"error": "User not unauthorized to make changes."}), 401

    # Check if user already exists in Database ort Authentication
    house, response, ret = validate_house_member(user)
    if ret != 200:
        return response, ret

    house.join_id = str(shortuuid.ShortUUID().random(length=12))
    HouseViewModel().update(house.id, house)

    return jsonify({
        "join_id": house.join_id
    }), 200


@auth.route('/deactivate_join', methods=["DELETE"])
@login_required
def deactivate_join(user):
    if not user.is_admin:
        return jsonify({"error": "User not unauthorized to make changes."}), 401

    house, response, ret = validate_house_member(user)
    if ret != 200:
        return response, ret

    house.join_id = ""
    HouseViewModel().update(house.id, house)
    return jsonify({
        "join_id": house.join_id
    }), 200

@auth.route('/get-user/<string:requested_user_id>', methods=['GET'])
@login_required
def get_user(user, requested_user_id):
    _, response, ret = validate_house_member(user)
    if ret != 200:
        return response, ret

    requested_user = UserViewModel().get(requested_user_id)
    _, response, ret = validate_house_member(requested_user)
    if ret != 200:
        return response, ret

    return jsonify({
        "user": requested_user.to_json(),
    }), 200

@auth.route('/update-user/<string:update_user_id>', methods=['PATCH'])
@login_required
def update_user(user, update_user_id):
    print("Update User ID: ", update_user_id)
    _, response, ret = validate_house_member(user)
    if ret != 200:
        return response, ret

    is_admin = request.json.get('is_admin', None)
    email = request.json.get('email', None)
    first_name = request.json.get('first_name', None)
    last_name = request.json.get('last_name', None)
    password = request.json.get('password', None)
    thumbnail = request.json.get('thumbnail', None)

    updated_user = UserViewModel().get(update_user_id)
    _, response, ret = validate_house_member(updated_user)
    if ret != 200:
        return response, ret

    # Allow change of admin status for other users
    if user.id != updated_user.id:
        if user.is_admin and is_admin is not None:
            updated_user.is_admin = is_admin
        else:
            return jsonify({"error": "User not unauthorized to make changes."}), 401
    else:
        # TODO: Add password and email change
        if first_name:
            updated_user.first_name = first_name
        if last_name:
            updated_user.last_name = last_name
        if thumbnail:
            updated_user.thumbnail = thumbnail

    UserViewModel().update(updated_user.id, updated_user)

    return jsonify({
        "user": updated_user.to_json(),
    }), 200



@auth.route('/current-user', methods=['GET'])
@login_required
def get_current_user(user):
    if user:
        house, response, ret = validate_house_member(user)
        if ret != 200:
            return response, ret

        return jsonify({
            "user": user.to_json(),
            "house": house.to_json()
        }), 200

    return jsonify({
        "error": "User not found"
    }), 400
