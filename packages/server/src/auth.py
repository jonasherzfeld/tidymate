from datetime import datetime
from flask import Blueprint, request, flash, redirect, url_for, jsonify, session
from models import User
from firebase_admin import auth as fb_auth
from view_models import UserViewModel
import requests
import os

auth = Blueprint('auth', __name__)

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


@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/register', methods=["POST"])
def register():
    email = request.json['email']
    first_name = request.json['firstName']
    password1 = request.json['password1']
    password2 = request.json['password2']

    vm = UserViewModel()
    user = vm.filter(email)
    print("User: ", user)
    if user:
        flash('Email already exists.', category='error')
        return jsonify({"error": "Email already exists."}), 409
    elif len(email) < 4:
        flash('Email must be greater than 3 characters.', category='error')
        return jsonify({"error": "Email must be greater than 3 characters."}), 400
    elif len(first_name) < 2:
        flash('First name must be greater than 1 character.', category='error')
        return jsonify({"error": "First name must be greater than 1 character."}), 400
    elif password1 != password2:
        flash('Passwords don\'t match.', category='error')
        return jsonify({"error": "Passwords don't match."}), 400
    elif len(password1) < 7:
        flash('Password must be at least 7 characters.', category='error')
        return jsonify({"error": "Password must be at least 7 characters."}), 400
    else:
        fb_user = fb_auth.create_user(email=email, password=password1,
                                        display_name=first_name)
        new_user = User(id=fb_user.uid,
                        email=email,
                        first_name=first_name,
                        joined_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        vm.set(fb_user.uid, new_user)
        login_user(new_user, remember=True)
        flash('Account created!', category='success')

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
    })
