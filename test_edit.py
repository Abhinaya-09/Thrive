import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_edit_functionality():
    print("🧪 Testing Lead Edit Functionality")
    print("=" * 50)
    
    # First, create a test lead
    print("1. Creating test lead...")
    lead_data = {
        "name": "Test Lead for Editing",
        "email": "test.edit@example.com",
        "mobile": "+911234567890",
        "company": "Test Company",
        "designation": "Manager",
        "source": "Test",
        "notes": "This is a test lead for editing",
        "status": "New",
        "nextFollowUp": "2024-10-10",
        "assignedTo": "Test Team"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/leads",
            json=lead_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            created_lead = response.json()
            lead_id = created_lead['lead']['id']
            print(f"   ✅ Test lead created: {created_lead['lead']['name']} (ID: {lead_id})")
            
            # Test updating the lead
            print("\n2. Testing lead update...")
            update_data = {
                "status": "Contacted",
                "nextFollowUp": "2024-10-15",
                "assignedTo": "Updated Team"
            }
            
            response = requests.put(
                f"{BASE_URL}/leads/{lead_id}",
                json=update_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                updated_data = response.json()
                print(f"   ✅ Lead updated successfully!")
                print(f"   New status: {updated_data['lead']['status']}")
                print(f"   New follow-up: {updated_data['lead']['nextFollowUp']}")
                print(f"   New assigned: {updated_data['lead']['assignedTo']}")
            else:
                print(f"   ❌ Update failed: {response.text}")
                
            # Clean up: delete the test lead
            print("\n3. Cleaning up test lead...")
            response = requests.delete(f"{BASE_URL}/leads/{lead_id}")
            if response.status_code == 200:
                print("   ✅ Test lead deleted")
            else:
                print("   ⚠️ Could not delete test lead")
                
        else:
            print(f"   ❌ Failed to create test lead: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Test failed: {e}")

if __name__ == "__main__":
    test_edit_functionality()