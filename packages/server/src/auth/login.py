from firebase_admin import auth

def authorize_token():
    try:
        auth_user = auth.verify_id_token

        if auth_user['uid'] != user_id:
            return jsonify({"message": "You are not authorized to update this contact"}), 403
    except:
        return jsonify({"message": "Authorization failed"}), 401
}
