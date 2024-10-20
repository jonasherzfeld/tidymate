from datetime import datetime
from flask import Blueprint, request, jsonify, session
from functools import wraps
from models import User, House
from firebase_admin import auth as fb_auth
from view_models import UserViewModel, HouseViewModel
import requests
import os
import uuid

auth = Blueprint('auth', __name__)

def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if user_id:
            user = UserViewModel().get(user_id)
            if user:
                # Success!
                return function_to_protect(*args, **kwargs)
            else:
                return jsonify({"error": "Invalid user"}), 401
        else:
            return jsonify({"error": "Unauthorized"}), 401

@auth.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

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
        session["user_id"] = user_data.uid
        return jsonify({
            "id": user_data.uid,
            "email": user_data.email,
        }), 200
    else:
        return jsonify({"error": "Email does not exist."}), 404


@auth.route('/logout', methods=["POST"])
def logout():
    session.clear()
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
    elif len(email) < 4:
        return jsonify({"error": "Email must be greater than 3 characters."}), 400
    elif len(first_name) < 2:
        return jsonify({"error": "First name must be greater than 1 character."}), 400
    elif len(last_name) < 2:
        return jsonify({"error": "First name must be greater than 1 character."}), 400
    elif len(password) < 7:
        return jsonify({"error": "Password must be at least 7 characters."}), 400
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

        session["user_id"] = fb_user.uid

    return jsonify({
        "id": fb_user.uid,
        "email": email,
        "house_id": house_id
    }), 200


@auth.route('/register_house', methods=["POST"])
def register_house():
    try:
        house_name = request.json['house_name']
        user_id = request.json['user_id']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    user_vm = UserViewModel()
    db_user = user_vm.get(user_id)
    if not db_user:
        return jsonify({"error": "User not found in database."}), 409

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
                      members=[user_id])
    house_vm.set(new_house.id, new_house)

    db_user.house_id = new_house.id
    db_user.is_admin = True
    user_vm.update(user_id, db_user)
    session["user_id"] = user_id

    return jsonify({
        "house_name": house_name,
        "house_id": new_house.id
    }), 200


@auth.route('/activate_join', methods=["POST"])
def activate_join():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        house_id = request.json['house_id']
        user_id = request.json['user_id']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    user_vm = UserViewModel()
    db_user = user_vm.get(user_id)
    if not db_user:
        return jsonify({"error": "User not found in database."}), 409

    # Check if user already exists in Database ort Authentication
    vm = HouseViewModel()
    db_house = vm.get(house_id)
    if not db_house:
        return jsonify({"error": "House name not found."}), 409

    if not db_house.members or not user_id in db_house.members:
        return jsonify({"error": "User not part of House."}), 400

    db_house.join_id = str(uuid.uuid4())
    vm.update(db_house.id, db_house)

    return jsonify({
        "join_id": db_house.join_id
    }), 200


@auth.route('/deactivate_join', methods=["DELETE"])
def deactivate_join():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        house_id = request.json['house_id']
        user_id = request.json['user_id']
    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400

    user_vm = UserViewModel()
    db_user = user_vm.get(user_id)
    if not db_user:
        return jsonify({"error": "User not found in database."}), 409

    # Check if user already exists in Database ort Authentication
    vm = HouseViewModel()
    db_house = vm.get(house_id)
    if not db_house:
        return jsonify({"error": "House name not found."}), 409

    if not db_house.members or not user_id in db_house.members:
        return jsonify({"error": "User not part of House."}), 400

    db_house.join_id = ""
    vm.update(db_house.id, db_house)
    return jsonify({
        "join_id": db_house.join_id
    }), 200


@auth.route('/current-user', methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = UserViewModel().get(user_id)
    house = House()
    if user:
        if user.house_id:
            house = HouseViewModel().get(user.house_id)

            # Validate user is in house
            if not house:
                return jsonify({
                    "error": "House not found"}), 400
            if not user.id in house.members:
                return jsonify({
                    "error": "User not found in house"}), 402

        return jsonify({
            "user": user.to_json(),
            "house": house.to_json()
        }), 200

    return jsonify({
        "error": "User not found"
    }), 400
