from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

from models import payment_schema, JSONEncoder
import json

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/', methods=['POST'])
@jwt_required()
def create_payment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation
        required_fields = ['customer', 'amount', 'date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "message": f"{field} is required",
                    "error": "missing_fields"
                }), 400
        
        # Validate amount
        try:
            amount = float(data['amount'])
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except (ValueError, TypeError):
            return jsonify({
                "message": "Amount must be a valid positive number",
                "error": "invalid_amount"
            }), 400
        
        # Create payment
        payment_data = payment_schema(data, user_id)
        result = request.current_app.db.payments.insert_one(payment_data)
        
        payment_data['_id'] = result.inserted_id
        payment_data['id'] = str(result.inserted_id)
        
        return jsonify({
            "message": "Payment recorded successfully",
            "payment": json.loads(JSONEncoder().encode(payment_data))
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Failed to record payment",
            "error": str(e)
        }), 500

@payment_bp.route('/', methods=['GET'])
@jwt_required()
def get_payments():
    try:
        user_id = get_jwt_identity()
        payments = list(request.current_app.db.payments.find({"createdBy": user_id}))
        
        for payment in payments:
            payment['id'] = str(payment['_id'])
        
        return jsonify({
            "payments": json.loads(JSONEncoder().encode(payments))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to fetch payments",
            "error": str(e)
        }), 500

@payment_bp.route('/<payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if payment exists and belongs to user
        existing_payment = request.current_app.db.payments.find_one({
            "_id": ObjectId(payment_id),
            "createdBy": user_id
        })
        
        if not existing_payment:
            return jsonify({
                "message": "Payment not found",
                "error": "not_found"
            }), 404
        
        # Validate amount if provided
        if 'amount' in data:
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    raise ValueError("Amount must be positive")
            except (ValueError, TypeError):
                return jsonify({
                    "message": "Amount must be a valid positive number",
                    "error": "invalid_amount"
                }), 400
        
        # Update payment
        update_data = {**data, "updatedAt": datetime.utcnow()}
        result = request.current_app.db.payments.update_one(
            {"_id": ObjectId(payment_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                "message": "No changes made to payment",
                "error": "no_changes"
            }), 400
        
        # Return updated payment
        updated_payment = request.current_app.db.payments.find_one({"_id": ObjectId(payment_id)})
        updated_payment['id'] = str(updated_payment['_id'])
        
        return jsonify({
            "message": "Payment updated successfully",
            "payment": json.loads(JSONEncoder().encode(updated_payment))
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to update payment",
            "error": str(e)
        }), 500

@payment_bp.route('/<payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    try:
        user_id = get_jwt_identity()
        
        result = request.current_app.db.payments.delete_one({
            "_id": ObjectId(payment_id),
            "createdBy": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({
                "message": "Payment not found",
                "error": "not_found"
            }), 404
        
        return jsonify({
            "message": "Payment deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to delete payment",
            "error": str(e)
        }), 500