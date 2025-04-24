from flask import jsonify, session
from functools import wraps
from models.view_models import UserViewModel


def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
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
