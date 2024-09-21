from firebase_admin import auth
from config.config import app, db

def create_user(email, password):
    if not email or not password:
        return "Email and password are required"

    if len(password) < 6:
        return "Password must be at least 6 characters"

    try:
        auth.get_user_by_email(email)
        return "User already exists"
    except Exception as e:
        pass


    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return user.uid
    except Exception as e:
        return str(e)
