from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

from models import budget_schema, JSONEncoder
import json

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        required_fields = ['budgetName', 'estimatedAmount', 'startDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "message": f"{field} is required",
                    "error": "missing_fields"
                }), 400
        
        # Validate amount
        try:
            estimated_amount = float(data['estimatedAmount'])
            if estimated_amount <= 0:
                raise ValueError("Amount must be positive")
        except (ValueError, TypeError):
            return jsonify({
                "message": "Estimated amount must be a valid positive number",
                "error": "invalid_amount"
            }), 400
        
        # Create budget
        budget_data = budget_schema(data, user_id)
        result = request.current_app.db.budgets.insert_one(budget_data)
        
        budget_data['_id'] = result.inserted_id
        budget_data['id'] = str(result.inserted_id)
        
        return jsonify({
            "message": "Budget created successfully",
            "budget": json.loads(JSONEncoder().encode(budget_data))
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Failed to create budget",
            "error": str(e)
        }), 500

@budget_bp.route('/', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        user_id = get_jwt_identity()
        budgets = list(request.current_app.db.budgets.find({"createdBy": user_id}))
        
        for budget in budgets:
            budget['id'] = str(budget['_id'])
        
        return jsonify({
            "budgets": json.loads(JSONEncoder().encode(budgets))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to fetch budgets",
            "error": str(e)
        }), 500

@budget_bp.route('/<budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if budget exists and belongs to user
        existing_budget = request.current_app.db.budgets.find_one({
            "_id": ObjectId(budget_id),
            "createdBy": user_id
        })
        
        if not existing_budget:
            return jsonify({
                "message": "Budget not found",
                "error": "not_found"
            }), 404
        
        # Validate amount if provided
        if 'estimatedAmount' in data:
            try:
                estimated_amount = float(data['estimatedAmount'])
                if estimated_amount <= 0:
                    raise ValueError("Amount must be positive")
            except (ValueError, TypeError):
                return jsonify({
                    "message": "Estimated amount must be a valid positive number",
                    "error": "invalid_amount"
                }), 400
        
        # Update budget
        update_data = {**data, "updatedAt": datetime.utcnow()}
        result = request.current_app.db.budgets.update_one(
            {"_id": ObjectId(budget_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                "message": "No changes made to budget",
                "error": "no_changes"
            }), 400
        
        # Return updated budget
        updated_budget = request.current_app.db.budgets.find_one({"_id": ObjectId(budget_id)})
        updated_budget['id'] = str(updated_budget['_id'])
        
        return jsonify({
            "message": "Budget updated successfully",
            "budget": json.loads(JSONEncoder().encode(updated_budget))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to update budget",
            "error": str(e)
        }), 500

@budget_bp.route('/<budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        
        result = request.current_app.db.budgets.delete_one({
            "_id": ObjectId(budget_id),
            "createdBy": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({
                "message": "Budget not found",
                "error": "not_found"
            }), 404
        
        return jsonify({
            "message": "Budget deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to delete budget",
            "error": str(e)
        }), 500