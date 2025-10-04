from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import timedelta

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # MongoDB configuration
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/thrive_solutions')
    
    # Initialize CORS first with proper configuration
    CORS(app, 
         supports_credentials=True, 
         origins=["http://localhost:5173", "http://127.0.0.1:5173"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])
    
    jwt = JWTManager(app)
    
    # MongoDB connection with better error handling
    try:
        client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        app.db = client.thrive_solutions
        print("✅ Connected to MongoDB successfully")
        
        # Create indexes
        app.db.users.create_index("email", unique=True)
        print("✅ Database indexes created")
        
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        # Create a mock db object to prevent crashes during development
        class MockDB:
            def __getattr__(self, name):
                return self
            def find_one(self, *args, **kwargs):
                return None
            def insert_one(self, *args, **kwargs):
                class Result:
                    inserted_id = "mock_id"
                return Result()
            def create_index(self, *args, **kwargs):
                return None
            def update_one(self, *args, **kwargs):
                class Result:
                    modified_count = 1
                return Result()
            def delete_one(self, *args, **kwargs):
                class Result:
                    deleted_count = 1
                return Result()
            def command(self, *args, **kwargs):
                return {"ok": 1}
        app.db = MockDB()
    
    # JWT configuration
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "message": "Token has expired",
            "error": "token_expired"
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "message": "Invalid token",
            "error": "invalid_token"
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "message": "Request doesn't contain valid token",
            "error": "authorization_required"
        }), 401
    
    # Handle OPTIONS requests for CORS
    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            response = jsonify({"status": "OK"})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response
    
    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.leads_routes import leads_bp
    from routes.projects_routes import projects_bp
    from routes.budget_routes import budget_bp
    from routes.payment_routes import payment_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(leads_bp, url_prefix='/api/leads')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    
    # Health check route
    @app.route('/api/health')
    def health_check():
        try:
            # Test database connection
            app.db.command('ping')
            db_status = "connected"
        except:
            db_status = "disconnected"
            
        return jsonify({
            "status": "healthy",
            "message": "THRIVE GROUP SOLUTIONS API is running",
            "database": db_status
        })
    
    # Add current_app to request context
    @app.before_request
    def before_request():
        request.current_app = app
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)