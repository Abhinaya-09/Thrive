import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_create_lead():
    print("Testing lead creation...")
    lead_data = {
        "name": "Test Lead",
        "email": "test@example.com",
        "mobile": "+1234567890",
        "company": "Test Company",
        "designation": "Manager",
        "source": "Website",
        "notes": "Test lead creation"
    }
    
    response = requests.post(
        f"{BASE_URL}/leads",
        json=lead_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        print("✅ Lead created successfully!")
        print(f"Response: {response.json()}")
    else:
        print("❌ Failed to create lead")
        print(f"Response: {response.text}")
    print()

def test_get_leads():
    print("Testing get all leads...")
    response = requests.get(f"{BASE_URL}/leads")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Retrieved {len(data.get('leads', []))} leads")
        print(f"Response: {data}")
    else:
        print("❌ Failed to get leads")
        print(f"Response: {response.text}")
    print()

if __name__ == "__main__":
    print("🧪 Testing THRIVE Backend API")
    print("=" * 50)
    
    test_health()
    test_create_lead()
    test_get_leads()