from datetime import datetime
from firebase_admin import auth as fb_auth
from flask import Blueprint, request, jsonify, session
from functools import wraps
import os
import requests
import shortuuid
import uuid

from config import bucket
from models import User, House
from view_models import UserViewModel, HouseViewModel

auth = Blueprint('auth', __name__)

user_vm = UserViewModel()
house_vm = HouseViewModel()

def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if user_id:
            user = user_vm.get(user_id)
            if user:
                # Success!
                return function_to_protect(user, *args, **kwargs)
            else:
                return jsonify({"error": "Invalid user"}), 401
        else:
            return jsonify({"error": "Unauthorized"}), 401
    return wrapper

def validate_house_member(user, house):
    if not house:
        return House(), jsonify({
            "error": "House not found"}), 400
    if not house.members or not user.id in house.members:
        return House(), jsonify({
            "error": "User not found in house"}), 402

    return jsonify({}), 200

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
    db_user = user_vm.filter("email", email)
    try:
        auth_user = fb_auth.get_user_by_email(email)
    except fb_auth.UserNotFoundError:
        auth_user = None

    if join_id and join_id != "null":
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


@auth.route('/register-house', methods=["POST"])
@login_required
def register_house(user):
    try:
        house_name = request.json['house_name']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    new_house = House(id=str(uuid.uuid4()),
                      name=house_name,
                      city="",
                      country="",
                      created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                      join_id= "",
                      members=[user.id])
    house_vm.set(new_house.id, new_house)

    user.house_id = new_house.id
    user.is_admin = True
    user_vm.update(user.id, user)

    return jsonify({
        "house_name": new_house.name,
        "house_id": new_house.id
    }), 200


@auth.route('/activate-join', methods=["POST"])
@login_required
def activate_join(user):
    if not user.is_admin:
        return jsonify({"error": "User not unauthorized to make changes."}), 401

    # Check if user already exists in Database ort Authentication
    if not user.house_id:
        return jsonify({"error": "User not assigned to house."}), 401
    house = house_vm.get(user.house_id)

    response, ret = validate_house_member(user, house)
    if ret != 200:
        return response, ret

    house.join_id = str(shortuuid.ShortUUID().random(length=12))
    house_vm.update(house.id, house)

    return jsonify({
        "join_id": house.join_id
    }), 200


@auth.route('/deactivate-join', methods=["DELETE"])
@login_required
def deactivate_join(user):
    if not user.is_admin:
        return jsonify({"error": "User not unauthorized to make changes."}), 401

    if not user.house_id:
        return jsonify({"error": "User not assigned to house."}), 401
    house = house_vm.get(user.house_id)

    response, ret = validate_house_member(user, house)
    if ret != 200:
        return response, ret

    house.join_id = ""
    house_vm.update(house.id, house)
    return jsonify({
        "join_id": house.join_id
    }), 200

@auth.route('/get-house-members', methods=['GET'])
@login_required
def get_house_members(user):
    if not user.house_id:
        return jsonify({"error": "User not assigned to house."}), 401
    house = house_vm.get(user.house_id)

    response, ret = validate_house_member(user, house)
    if ret != 200:
        return response, ret

    house_member_list = user_vm.filter("house_id", user.house_id)
    house_member_list_json = []
    for house_mate in house_member_list:
        response, ret = validate_house_member(house_mate, house)
        if ret != 200:
            return response, ret
        house_member_list_json.append(house_mate.to_json())

    return jsonify({
        "user_list": house_member_list_json,
    }), 200

@auth.route('/set-admin/<string:update_user_id>', methods=['PATCH'])
@login_required
def set_admin(user, update_user_id):
    is_admin = request.json.get('is_admin', None)

    # Validate calling user
    if not user.house_id:
        return jsonify({"error": "User not assigned to house."}), 401
    house = house_vm.get(user.house_id)

    response, ret = validate_house_member(user, house)
    if ret != 200:
        return response, ret

    # Validate requested user
    updated_user = user_vm.get(update_user_id)
    response, ret = validate_house_member(updated_user, house)
    if ret != 200:
        return response, ret

    # Allow change of admin status for other users
    if user.is_admin and is_admin is not None:
        updated_user.is_admin = is_admin
    else:
        return jsonify({"error": "User not unauthorized to make changes."}), 401

    user_vm.update(updated_user.id, updated_user)
    return jsonify({
        "user": updated_user.to_json(),
    }), 200


@auth.route('/update-user', methods=['PATCH'])
@login_required
def update_user(user):

    # email = request.json.get('email', None)
    first_name = request.json.get('first_name', None)
    last_name = request.json.get('last_name', None)
    # password = request.json.get('password', None)
    thumbnail = request.json.get('thumbnail', None)

    # TODO: Add password and email change
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if thumbnail:
        user.thumbnail = thumbnail

    user_vm.update(user.id, user)

    return jsonify({
        "user": user.to_json(),
    }), 200


@auth.route('/update-house', methods=['PATCH'])
@login_required
def update_house(user):
    house = house_vm.get(user.house_id)
    response, ret = validate_house_member(user, house)
    if ret != 200:
        return response, ret

    name = request.json.get('name', None)
    country = request.json.get('country', None)
    city = request.json.get('city', None)

    if name:
        house.name = name
    if country:
        house.country = country
    if city:
        house.city = city

    house_vm.update(house.id, house)

    return jsonify({
        "house": house.to_json(),
    }), 200


@auth.route('/current-user', methods=['GET'])
@login_required
def get_current_user(user):
    house = None
    if user:
        if user.house_id:
            house = house_vm.get(user.house_id)
            response, ret = validate_house_member(user, house)
            if ret != 200:
                return response, ret


        return jsonify({
            "user": user.to_json(),
            "house": house.to_json() if house else None
        }), 200

    return jsonify({
        "error": "User not found"
    }), 400
