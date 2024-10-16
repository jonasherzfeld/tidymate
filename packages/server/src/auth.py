from datetime import datetime
from flask import Blueprint, request, jsonify, session
from functools import wraps
from models import User
from firebase_admin import auth as fb_auth
from view_models import UserViewModel
import requests
import os

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
    print(request.json)
    email = request.json['email']
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    password1 = request.json['password']

    # Check if user already exists in Database ort Authentication
    vm = UserViewModel()
    db_user = vm.filter(email)
    try:
        auth_user = fb_auth.get_user_by_email(email)
    except fb_auth.UserNotFoundError:
        auth_user = None

    if db_user or auth_user:
        return jsonify({"error": "Email already exists."}), 409
    elif len(email) < 4:
        return jsonify({"error": "Email must be greater than 3 characters."}), 400
    elif len(first_name) < 2:
        return jsonify({"error": "First name must be greater than 1 character."}), 400
    elif len(last_name) < 2:
        return jsonify({"error": "First name must be greater than 1 character."}), 400
    elif len(password1) < 7:
        return jsonify({"error": "Password must be at least 7 characters."}), 400
    else:
        full_name = first_name + " " + last_name
        fb_user = fb_auth.create_user(email=email, password=password1,
                                        display_name=full_name)
        new_user = User(id=fb_user.uid,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        joined_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        vm.set(fb_user.uid, new_user)
        session["user_id"] = fb_user.uid

    return jsonify({
        "id": fb_user.uid,
        "email": email,
    }), 200


@auth.route('/current-user', methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    vm = UserViewModel()
    user = vm.get(user_id)
    if user:
        return jsonify({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "joinedOn": user.joined_on
        }), 200

    return jsonify({
        "error": "User not found"
    }), 400
