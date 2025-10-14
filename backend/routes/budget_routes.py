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
        
        print("📥 Received budget data:", data)
        
        # Enhanced Validation for software project budget
        required_fields = ['budgetName', 'projectId', 'projectName', 'totalBudget']
        missing_fields = []
        
        for field in required_fields:
            if field not in data or data.get(field) is None or data.get(field) == '':
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                "message": f"The following fields are required: {', '.join(missing_fields)}",
                "error": "missing_fields",
                "missing_fields": missing_fields
            }), 400
        
        # Validate numeric fields
        numeric_fields = [
            'totalBudget', 'developmentCost', 'designCost', 
            'testingCost', 'deploymentCost', 'maintenanceCost', 'thirdPartyCost'
        ]
        
        for field in numeric_fields:
            if field in data and data[field] is not None:
                try:
                    value = float(data[field])
                    if value < 0:
                        return jsonify({
                            "message": f"{field} must be a positive number",
                            "error": "invalid_amount"
                        }), 400
                except (ValueError, TypeError):
                    return jsonify({
                        "message": f"{field} must be a valid number",
                        "error": "invalid_amount_format"
                    }), 400
        
        # Create budget data for software project
        budget_data = {
            'budgetName': data['budgetName'].strip(),
            'projectId': data['projectId'],
            'projectName': data['projectName'],
            'totalBudget': float(data['totalBudget']),
            'developmentCost': float(data.get('developmentCost', 0)),
            'designCost': float(data.get('designCost', 0)),
            'testingCost': float(data.get('testingCost', 0)),
            'deploymentCost': float(data.get('deploymentCost', 0)),
            'maintenanceCost': float(data.get('maintenanceCost', 0)),
            'thirdPartyCost': float(data.get('thirdPartyCost', 0)),
            'currency': data.get('currency', 'INR'),
            'notes': data.get('notes', ''),
            'createdBy': user_id,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        print("💾 Saving budget data:", budget_data)
        
        # Insert into database
        result = request.current_app.db.budgets.insert_one(budget_data)
        
        # Fetch the created budget to return complete data
        created_budget = request.current_app.db.budgets.find_one({"_id": result.inserted_id})
        created_budget['id'] = str(created_budget['_id'])
        
        return jsonify({
            "message": "Software project budget created successfully",
            "budget": json.loads(JSONEncoder().encode(created_budget))
        }), 201
        
    except Exception as e:
        print(f"❌ Error in create_budget: {str(e)}")
        return jsonify({
            "message": "Failed to create software project budget",
            "error": str(e)
        }), 500

# FIXED ROUTE: Changed from '/project/<project_id>' to '/<project_id>/project'
@budget_bp.route('/<project_id>/project', methods=['GET'])
@jwt_required()
def get_budgets_by_project(project_id):
    try:
        user_id = get_jwt_identity()
        
        print(f"📋 Fetching budgets for project: {project_id}, user: {user_id}")
        
        # Find all budgets for this project and user
        budgets = list(request.current_app.db.budgets.find({
            "projectId": project_id,
            "createdBy": user_id
        }).sort("createdAt", -1))  # Sort by newest first
        
        print(f"✅ Found {len(budgets)} budgets")
        print("📊 Budgets data:", budgets)
        
        # Convert budgets for JSON serialization
        serialized_budgets = []
        for budget in budgets:
            budget_dict = {
                'id': str(budget['_id']),
                'budgetName': budget.get('budgetName', ''),
                'projectId': budget.get('projectId', ''),
                'projectName': budget.get('projectName', ''),
                'totalBudget': budget.get('totalBudget', 0),
                'developmentCost': budget.get('developmentCost', 0),
                'designCost': budget.get('designCost', 0),
                'testingCost': budget.get('testingCost', 0),
                'deploymentCost': budget.get('deploymentCost', 0),
                'maintenanceCost': budget.get('maintenanceCost', 0),
                'thirdPartyCost': budget.get('thirdPartyCost', 0),
                'currency': budget.get('currency', 'INR'),
                'notes': budget.get('notes', ''),
                'createdBy': budget.get('createdBy', ''),
            }
            
            # Convert datetime to ISO format for JSON serialization
            if 'createdAt' in budget and isinstance(budget['createdAt'], datetime):
                budget_dict['createdAt'] = budget['createdAt'].isoformat()
            if 'updatedAt' in budget and isinstance(budget['updatedAt'], datetime):
                budget_dict['updatedAt'] = budget['updatedAt'].isoformat()
            
            serialized_budgets.append(budget_dict)
        
        return jsonify({
            "message": "Budgets fetched successfully",
            "budgets": serialized_budgets,
            "count": len(serialized_budgets)
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching budgets: {str(e)}")
        return jsonify({
            "message": "Failed to fetch budgets",
            "error": str(e)
        }), 500

@budget_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_budgets():
    try:
        user_id = get_jwt_identity()
        
        budgets = list(request.current_app.db.budgets.find({
            "createdBy": user_id
        }).sort("createdAt", -1))
        
        serialized_budgets = []
        for budget in budgets:
            budget_dict = {
                'id': str(budget['_id']),
                'budgetName': budget.get('budgetName', ''),
                'projectId': budget.get('projectId', ''),
                'projectName': budget.get('projectName', ''),
                'totalBudget': budget.get('totalBudget', 0),
                'developmentCost': budget.get('developmentCost', 0),
                'designCost': budget.get('designCost', 0),
                'testingCost': budget.get('testingCost', 0),
                'deploymentCost': budget.get('deploymentCost', 0),
                'maintenanceCost': budget.get('maintenanceCost', 0),
                'thirdPartyCost': budget.get('thirdPartyCost', 0),
                'currency': budget.get('currency', 'INR'),
                'notes': budget.get('notes', ''),
                'createdBy': budget.get('createdBy', ''),
            }
            
            if 'createdAt' in budget and isinstance(budget['createdAt'], datetime):
                budget_dict['createdAt'] = budget['createdAt'].isoformat()
            if 'updatedAt' in budget and isinstance(budget['updatedAt'], datetime):
                budget_dict['updatedAt'] = budget['updatedAt'].isoformat()
            
            serialized_budgets.append(budget_dict)
        
        return jsonify({
            "message": "All budgets fetched successfully",
            "budgets": serialized_budgets,
            "count": len(serialized_budgets)
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching all budgets: {str(e)}")
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
        
        # Validate numeric fields if provided
        numeric_fields = [
            'totalBudget', 'developmentCost', 'designCost', 
            'testingCost', 'deploymentCost', 'maintenanceCost', 'thirdPartyCost'
        ]
        
        for field in numeric_fields:
            if field in data and data[field] is not None:
                try:
                    value = float(data[field])
                    if value < 0:
                        return jsonify({
                            "message": f"{field} must be a positive number",
                            "error": "invalid_amount"
                        }), 400
                    data[field] = value
                except (ValueError, TypeError):
                    return jsonify({
                        "message": f"{field} must be a valid number",
                        "error": "invalid_amount_format"
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
        if 'createdAt' in updated_budget and isinstance(updated_budget['createdAt'], datetime):
            updated_budget['createdAt'] = updated_budget['createdAt'].isoformat()
        if 'updatedAt' in updated_budget and isinstance(updated_budget['updatedAt'], datetime):
            updated_budget['updatedAt'] = updated_budget['updatedAt'].isoformat()
        
        return jsonify({
            "message": "Budget updated successfully",
            "budget": json.loads(JSONEncoder().encode(updated_budget))
        }), 200
        
    except Exception as e:
        print(f"❌ Error updating budget: {str(e)}")
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