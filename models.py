from datetime import datetime
from bson import ObjectId
import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

# User Schema
def user_schema(user_data):
    return {
        "fullName": user_data.get('fullName'),
        "email": user_data.get('email'),
        "password": user_data.get('password'),  # Will be hashed
        "role": user_data.get('role', 'user'),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "isActive": True
    }

# Lead Schema
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

# Project Schema
def project_schema(project_data, user_id):
    return {
        "projectName": project_data.get('projectName'),
        "details": project_data.get('details'),
        "deadline": project_data.get('deadline'),
        "priority": project_data.get('priority', 'Medium'),
        "projectFile": project_data.get('projectFile'),
        "status": project_data.get('status', 'Active'),
        "createdBy": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

# Budget Schema
def budget_schema(budget_data, user_id):
    return {
        "budgetName": budget_data.get('budgetName'),
        "estimatedAmount": float(budget_data.get('estimatedAmount', 0)),
        "actualAmount": float(budget_data.get('actualAmount', 0)),
        "startDate": budget_data.get('startDate'),
        "endDate": budget_data.get('endDate'),
        "notes": budget_data.get('notes'),
        "projectId": budget_data.get('projectId'),
        "createdBy": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

# Payment Schema
def payment_schema(payment_data, user_id):
    return {
        "customer": payment_data.get('customer'),
        "date": payment_data.get('date'),
        "amount": float(payment_data.get('amount', 0)),
        "status": payment_data.get('status', 'Completed'),
        "createdBy": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }