from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import json

leads_bp = Blueprint('leads', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

def lead_schema(lead_data, user_id):
    return {
        "name": lead_data.get('name'),
        "email": lead_data.get('email'),
        "mobile": lead_data.get('mobile'),
        "address": lead_data.get('address'),
        "company": lead_data.get('company'),
        "designation": lead_data.get('designation'),
        "source": lead_data.get('source'),
        "notes": lead_data.get('notes'),
        "status": lead_data.get('status', 'New'),
        "nextFollowUp": lead_data.get('nextFollowUp'),
        "assignedTo": lead_data.get('assignedTo', 'Not Assigned'),
        "createdBy": user_id,
        "fileName": lead_data.get('fileName'),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

@leads_bp.route('/', methods=['POST'])
@jwt_required(optional=True)
def create_lead():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "dev_user_001"
            
        data = request.get_json()
        print("📨 Received lead creation data:", data)
        
        # Validation
        required_fields = ['name', 'mobile', 'email']
        for field in required_fields:
            if not data.get(field):
                print(f"❌ Missing field: {field}")
                return jsonify({
                    "message": f"{field} is required",
                    "error": "missing_fields"
                }), 400
        
        # Create lead
        lead_data = lead_schema(data, user_id)
        print("📝 Creating lead with data:", {k: v for k, v in lead_data.items() if k != 'password'})
        
        result = request.current_app.db.leads.insert_one(lead_data)
        print(f"✅ Lead created with ID: {result.inserted_id}")
        
        lead_data['_id'] = result.inserted_id
        lead_data['id'] = str(result.inserted_id)
        
        return jsonify({
            "message": "Lead created successfully",
            "lead": json.loads(JSONEncoder().encode(lead_data))
        }), 201
        
    except Exception as e:
        print("❌ Lead creation error:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            "message": "Failed to create lead",
            "error": str(e)
        }), 500

@leads_bp.route('/', methods=['GET'])
@jwt_required(optional=True)
def get_leads():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "dev_user_001"
            
        leads = list(request.current_app.db.leads.find({"createdBy": user_id}))
        
        for lead in leads:
            lead['id'] = str(lead['_id'])
        
        print(f"✅ Retrieved {len(leads)} leads for user {user_id}")
        
        return jsonify({
            "leads": json.loads(JSONEncoder().encode(leads))
        }), 200
        
    except Exception as e:
        print("❌ Failed to fetch leads:", str(e))
        return jsonify({
            "message": "Failed to fetch leads",
            "error": str(e)
        }), 500

@leads_bp.route('/<lead_id>', methods=['PUT'])
@jwt_required(optional=True)
def update_lead(lead_id):
    try:
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "dev_user_001"
            
        data = request.get_json()
        print(f"🔄 Updating lead {lead_id} with data:", data)
        
        # Check if lead exists and belongs to user
        existing_lead = request.current_app.db.leads.find_one({
            "_id": ObjectId(lead_id),
            "createdBy": user_id
        })
        
        if not existing_lead:
            print(f"❌ Lead {lead_id} not found for user {user_id}")
            return jsonify({
                "message": "Lead not found",
                "error": "not_found"
            }), 404
        
        # Prepare update data - only update provided fields
        update_data = {"updatedAt": datetime.utcnow()}
        
        # Only update fields that are provided in the request
        updatable_fields = ['status', 'nextFollowUp', 'assignedTo', 'notes', 'source']
        for field in updatable_fields:
            if field in data:
                update_data[field] = data[field]
        
        print(f"📝 Final update data for lead {lead_id}:", update_data)
        
        # Update lead in database
        result = request.current_app.db.leads.update_one(
            {"_id": ObjectId(lead_id)},
            {"$set": update_data}
        )
        
        print(f"📊 MongoDB update result - modified_count: {result.modified_count}")
        
        if result.modified_count == 0:
            print(f"⚠️ No changes made to lead {lead_id}")
            return jsonify({
                "message": "No changes made to lead",
                "error": "no_changes"
            }), 400
        
        # Return updated lead
        updated_lead = request.current_app.db.leads.find_one({"_id": ObjectId(lead_id)})
        updated_lead['id'] = str(updated_lead['_id'])
        
        print(f"✅ Lead {lead_id} updated successfully")
        
        return jsonify({
            "message": "Lead updated successfully",
            "lead": json.loads(JSONEncoder().encode(updated_lead))
        }), 200
        
    except Exception as e:
        print(f"❌ Error updating lead {lead_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "message": "Failed to update lead",
            "error": str(e)
        }), 500

@leads_bp.route('/<lead_id>', methods=['DELETE'])
@jwt_required(optional=True)
def delete_lead(lead_id):
    try:
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "dev_user_001"
            
        result = request.current_app.db.leads.delete_one({
            "_id": ObjectId(lead_id),
            "createdBy": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({
                "message": "Lead not found",
                "error": "not_found"
            }), 404
        
        return jsonify({
            "message": "Lead deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "message": "Failed to delete lead",
            "error": str(e)
        }), 500

# Route to initialize sample data
@leads_bp.route('/initialize-sample', methods=['POST'])
@jwt_required(optional=True)
def initialize_sample_data():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            user_id = "dev_user_001"
        
        sample_leads = [
            {
                "name": "Rajesh Kumar",
                "email": "rajesh.kumar@abccorp.com",
                "mobile": "+91 9876543210",
                "address": "123 MG Road, Bangalore, Karnataka 560001",
                "company": "ABC Corporation",
                "designation": "Project Manager",
                "source": "Referral",
                "notes": "Interested in enterprise solutions. Met at tech conference.",
                "status": "New",
                "nextFollowUp": "2024-10-10",
                "assignedTo": "Sales Team A"
            },
            {
                "name": "Priya Sharma",
                "email": "priya.sharma@xyztech.com",
                "mobile": "+91 8765432109",
                "address": "456 Park Street, Mumbai, Maharashtra 400001",
                "company": "XYZ Technologies",
                "designation": "CTO",
                "source": "Website",
                "notes": "Looking for AI integration services. High budget project.",
                "status": "Contacted",
                "nextFollowUp": "2024-10-12",
                "assignedTo": "Enterprise Sales"
            }
        ]
        
        created_leads = []
        for sample_lead in sample_leads:
            lead_data = lead_schema(sample_lead, user_id)
            result = request.current_app.db.leads.insert_one(lead_data)
            lead_data['_id'] = result.inserted_id
            lead_data['id'] = str(result.inserted_id)
            created_leads.append(lead_data)
        
        return jsonify({
            "message": "Sample data initialized successfully",
            "leads": json.loads(JSONEncoder().encode(created_leads))
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Failed to initialize sample data",
            "error": str(e)
        }), 500