from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import traceback

# Import models and auth functions
try:
    from models import user_schema
    from auth import hash_password, verify_password, create_jwt_token, validate_email, validate_password
except ImportError:
    # Fallback for development
    def user_schema(user_data):
        return {
            "fullName": user_data.get('fullName'),
            "email": user_data.get('email'),
            "password": user_data.get('password'),
            "role": user_data.get('role', 'user'),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "isActive": True
        }
    
    def hash_password(password):
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(plain_password, hashed_password):
        import hashlib
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password
    
    def create_jwt_token(user_id):
        return f"dev-token-{user_id}"
    
    def validate_email(email):
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password(password):
        return len(password) >= 6 if password else False

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("📨 Received registration data:", data)
        
        # Validation
        required_fields = ['fullName', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                print(f"❌ Missing field: {field}")
                return jsonify({
                    "message": f"{field} is required",
                    "error": "missing_fields"
                }), 400
        
        if not validate_email(data['email']):
            print(f"❌ Invalid email: {data['email']}")
            return jsonify({
                "message": "Invalid email format",
                "error": "invalid_email"
            }), 400
        
        if not validate_password(data['password']):
            print("❌ Weak password")
            return jsonify({
                "message": "Password must be at least 6 characters long",
                "error": "weak_password"
            }), 400
        
        # Check if user already exists
        existing_user = request.current_app.db.users.find_one({"email": data['email']})
        if existing_user:
            print(f"❌ User already exists: {data['email']}")
            return jsonify({
                "message": "User with this email already exists",
                "error": "user_exists"
            }), 409
        
        # Create user
        user_data = user_schema(data)
        user_data['password'] = hash_password(data['password'])
        
        print("📝 Creating user with data:", {k: v for k, v in user_data.items() if k != 'password'})
        
        result = request.current_app.db.users.insert_one(user_data)
        print(f"✅ User created with ID: {result.inserted_id}")
        
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": str(result.inserted_id),
                "fullName": data['fullName'],
                "email": data['email']
            }
        }), 201
        
    except Exception as e:
        print("❌ Registration error:", str(e))
        print("🔍 Stack trace:")
        traceback.print_exc()
        return jsonify({
            "message": "Registration failed",
            "error": str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("📨 Received login data:", {**data, 'password': '***'})
        
        if not data.get('identifier') or not data.get('password'):
            return jsonify({
                "message": "Email and password are required",
                "error": "missing_credentials"
            }), 400
        
        # Find user by email
        user = request.current_app.db.users.find_one({
            "email": data['identifier']
        })
        
        if not user:
            print(f"❌ User not found: {data['identifier']}")
            return jsonify({
                "message": "Invalid email or password",
                "error": "invalid_credentials"
            }), 401
        
        # Verify password
        if not verify_password(data['password'], user['password']):
            print("❌ Invalid password")
            return jsonify({
                "message": "Invalid email or password",
                "error": "invalid_credentials"
            }), 401
        
        # Create JWT token
        token = create_jwt_token(user['_id'])
        
        print(f"✅ Login successful for user: {user['email']}")
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user['_id']),
                "fullName": user['fullName'],
                "email": user['email'],
                "role": user.get('role', 'user')
            }
        }), 200
        
    except Exception as e:
        print("❌ Login error:", str(e))
        traceback.print_exc()
        return jsonify({
            "message": "Login failed",
            "error": str(e)
        }), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = request.current_app.db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({
                "message": "User not found",
                "error": "user_not_found"
            }), 404
        
        return jsonify({
            "user": {
                "id": str(user['_id']),
                "fullName": user['fullName'],
                "email": user['email'],
                "role": user.get('role', 'user'),
                "createdAt": user.get('createdAt')
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to fetch profile",
            "error": str(e)
        }), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # With JWT, logout is handled on the client side by removing the token
    return jsonify({
        "message": "Logout successful"
    }), 200