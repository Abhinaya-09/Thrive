from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
import re

bcrypt = Bcrypt()

def initialize_auth(app):
    bcrypt.init_app(app)

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def verify_password(plain_password, hashed_password):
    try:
        return bcrypt.check_password_hash(hashed_password, plain_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_jwt_token(user_id):
    return create_access_token(identity=str(user_id))

def validate_email(email):
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    # At least 6 characters
    return len(password) >= 6 if password else False