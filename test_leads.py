import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_backend():
    print("🧪 Testing Leads Backend")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return
    
    # Test 2: Create a lead
    print("\n2. Testing lead creation...")
    lead_data = {
        "name": "Test Lead from Python",
        "email": "test@python.com",
        "mobile": "+911234567890",
        "company": "Test Company",
        "designation": "Manager",
        "source": "Test",
        "notes": "This is a test lead created from Python"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/leads",
            json=lead_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            created_lead = response.json()
            print(f"   ✅ Lead created: {created_lead['lead']['name']}")
            lead_id = created_lead['lead']['id']
        else:
            print(f"   ❌ Failed: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Creation failed: {e}")
        return
    
    # Test 3: Get all leads
    print("\n3. Testing get all leads...")
    try:
        response = requests.get(f"{BASE_URL}/leads")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            leads_count = len(data.get('leads', []))
            print(f"   ✅ Retrieved {leads_count} leads")
            for lead in data.get('leads', []):
                print(f"      - {lead['name']} ({lead['email']})")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Get leads failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Backend test completed!")

if __name__ == "__main__":
    test_backend()