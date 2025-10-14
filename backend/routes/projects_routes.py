from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

from models import project_schema, JSONEncoder
import json

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        required_fields = ['projectName', 'deadline']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "message": f"{field} is required",
                    "error": "missing_fields"
                }), 400
        
        # Create project
        project_data = project_schema(data, user_id)
        result = request.current_app.db.projects.insert_one(project_data)
        
        project_data['_id'] = result.inserted_id
        project_data['id'] = str(result.inserted_id)
        
        return jsonify({
            "message": "Project created successfully",
            "project": json.loads(JSONEncoder().encode(project_data))
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Failed to create project",
            "error": str(e)
        }), 500

@projects_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    try:
        user_id = get_jwt_identity()
        projects = list(request.current_app.db.projects.find({"createdBy": user_id}))
        
        for project in projects:
            project['id'] = str(project['_id'])
        
        return jsonify({
            "projects": json.loads(JSONEncoder().encode(projects))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to fetch projects",
            "error": str(e)
        }), 500

@projects_bp.route('/<project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    try:
        user_id = get_jwt_identity()
        project = request.current_app.db.projects.find_one({
            "_id": ObjectId(project_id),
            "createdBy": user_id
        })
        
        if not project:
            return jsonify({
                "message": "Project not found",
                "error": "not_found"
            }), 404
        
        project['id'] = str(project['_id'])
        
        return jsonify({
            "project": json.loads(JSONEncoder().encode(project))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to fetch project",
            "error": str(e)
        }), 500

@projects_bp.route('/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if project exists and belongs to user
        existing_project = request.current_app.db.projects.find_one({
            "_id": ObjectId(project_id),
            "createdBy": user_id
        })
        
        if not existing_project:
            return jsonify({
                "message": "Project not found",
                "error": "not_found"
            }), 404
        
        # Update project
        update_data = {**data, "updatedAt": datetime.utcnow()}
        result = request.current_app.db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                "message": "No changes made to project",
                "error": "no_changes"
            }), 400
        
        # Return updated project
        updated_project = request.current_app.db.projects.find_one({"_id": ObjectId(project_id)})
        updated_project['id'] = str(updated_project['_id'])
        
        return jsonify({
            "message": "Project updated successfully",
            "project": json.loads(JSONEncoder().encode(updated_project))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to update project",
            "error": str(e)
        }), 500

@projects_bp.route('/<project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    try:
        user_id = get_jwt_identity()
        
        result = request.current_app.db.projects.delete_one({
            "_id": ObjectId(project_id),
            "createdBy": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({
                "message": "Project not found",
                "error": "not_found"
            }), 404
        
        return jsonify({
            "message": "Project deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to delete project",
            "error": str(e)
        }), 500