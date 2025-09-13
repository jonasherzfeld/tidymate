from datetime import datetime
from flask import Blueprint, request, jsonify, session
import shortuuid
import uuid
from db.db import db
from models.models import Users, House
from utils.utils import login_required
from utils.api_errors import ValidationError, NotFoundError, AuthorizationError, AuthenticationError, APIError

auth = Blueprint('auth', __name__)


def get_members_by_house_id(house: House):
    house_member_list = Users.query.filter_by(house_id=house.id)
    return [user.to_dict() for user in house_member_list]


@auth.route('/login', methods=['POST'])
def login():
    # Validate required fields
    if not request.json or 'email' not in request.json or 'password' not in request.json:
        raise ValidationError("Missing required fields: email and password")

    email = request.json['email']
    password = request.json['password']

    # Check if user exists
    user_data = Users.query.filter_by(email=email).first()
    if not user_data:
        raise NotFoundError("Email does not exist")

    # Authenticate user
    if not user_data.authenticate(password):
        raise AuthenticationError("Invalid password")

    # Set session
    try:
        session["user_id"] = user_data.id
    except ConnectionError:
        raise APIError("Session database connection error", 500)

    return jsonify({
        "id": user_data.id,
        "email": user_data.email,
    }), 200


@auth.route('/logout', methods=["POST"])
def logout():
    try:
        session.clear()
    except ConnectionError:
        raise APIError("Session database connection error", 500)

    return jsonify({}), 200


@auth.route('/register', methods=["POST"])
def register():
    # Validate required fields
    if not request.json:
        raise ValidationError("Request body must be JSON")

    required_fields = ['email', 'first_name',
                       'last_name', 'password', 'join_id']
    missing_fields = [
        field for field in required_fields if field not in request.json]
    if missing_fields:
        raise ValidationError(
            f"Missing required fields: {', '.join(missing_fields)}")

    email = request.json['email']
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    password = request.json['password']
    join_id = request.json['join_id']

    # Check if user already exists in Database ort Authentication
    if Users.query.filter_by(email=email).first():
        raise APIError("Email already exists", 409)

    db_house = None
    if join_id and join_id != "null":
        if House.query.filter_by(join_id=join_id).count() != 1:
            raise NotFoundError("Invalid Join ID")
        db_house = House.query.filter_by(join_id=join_id).first()

    new_user = Users(
        id=str(uuid.uuid4()),
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        joined_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        is_admin=False,
        house=db_house)
    db.session.add(new_user)

    if db_house:
        db_house.members.append(new_user)

    db.session.commit()

    try:
        session["user_id"] = new_user.id
    except ConnectionError:
        raise APIError("Session database connection error", 500)

    return jsonify({
        "id": new_user.id,
        "email": email,
        "house_id": db_house.id if db_house else "",
    }), 200


@auth.route('/register-house', methods=["POST"])
@login_required
def register_house(user):
    try:
        house_name = request.json['house_name']
        house_city = request.json.get('house_city', "")
        house_country = request.json.get('house_country', "")
    except KeyError:
        raise ValidationError("Missing required fields")

    new_house = House(id=str(uuid.uuid4()),
                      name=house_name,
                      city=house_city,
                      country=house_country,
                      created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                      join_id="")
    db.session.add(new_house)

    # Add the user to the house members after house creation
    new_house.members.append(user)
    user.house_id = new_house.id
    user.is_admin = True
    db.session.commit()

    return jsonify({
        "house_name": new_house.name,
        "house_id": new_house.id
    }), 200


@auth.route('/activate-join', methods=["POST"])
@login_required
def activate_join(user):
    if not user.is_admin:
        raise AuthorizationError("User not unauthorized to make changes.")

    # Check if user already exists in Database ort Authentication
    if not user.house_id:
        raise NotFoundError("User not assigned to house.")
    house = House.query.filter_by(id=user.house_id).first()

    house.join_id = str(shortuuid.ShortUUID().random(length=12))
    db.session.commit()

    return jsonify({
        "join_id": house.join_id
    }), 200


@auth.route('/deactivate-join', methods=["DELETE"])
@login_required
def deactivate_join(user):
    if not user.is_admin:
        raise AuthorizationError("User not unauthorized to make changes.")

    if not user.house_id:
        raise NotFoundError("User not assigned to house.")
    house = House.query.filter_by(id=user.house_id).first()

    house.join_id = ""
    db.session.commit()
    return jsonify({
        "join_id": house.join_id
    }), 200


@auth.route('/get-house-members', methods=['GET'])
@login_required
def get_house_members(user):
    if not user.house_id:
        raise NotFoundError("User not assigned to house.")
    house = House.query.filter_by(id=user.house_id).first()

    house_member_list_json = get_members_by_house_id(house)

    return jsonify({
        "user_list": house_member_list_json,
    }), 200


@auth.route('/set-admin/<string:update_user_id>', methods=['PATCH'])
@login_required
def set_admin(user, update_user_id):
    is_admin = request.json.get('is_admin', None)

    # Validate calling user
    if not user.house_id:
        raise NotFoundError("User not assigned to house.")
    house = House.query.filter_by(id=user.house_id).first()

    # Validate requested user
    updated_user = Users.query.filter_by(id=update_user_id).first()

    # Allow change of admin status for other users
    if user.is_admin and is_admin is not None:
        updated_user.is_admin = is_admin
    else:
        raise AuthorizationError("User not unauthorized to make changes.")

    db.session.commit()
    return jsonify({
        "user": updated_user.to_dict(),
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

    db.session.commit()

    return jsonify({
        "user": user.to_dict(),
    }), 200


@auth.route('/update-house', methods=['PATCH'])
@login_required
def update_house(user):
    house = House.query.filter_by(id=user.house_id).first()

    name = request.json.get('name', None)
    country = request.json.get('country', None)
    city = request.json.get('city', None)

    if name:
        house.name = name
    if country:
        house.country = country
    if city:
        house.city = city

    db.session.commit()

    return jsonify({
        "house": house.to_dict(),
    }), 200


@auth.route('/current-user', methods=['GET'])
@login_required
def get_current_user(user):
    house = None
    if user:
        if user.house_id:
            house = House.query.filter_by(id=user.house_id).first()

        house_json = house.to_dict() if house else None
        return jsonify({
            "user": user.to_dict(),
            "house": house_json
        }), 200

    raise NotFoundError("User not found")
