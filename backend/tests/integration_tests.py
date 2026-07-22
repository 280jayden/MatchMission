import pytest
import json
import uuid
from app import app 




client = app.test_client()

def test_orgs_directory_api():
    # Tests /api/orgs/directory

    # GET request
    response = client.get('/api/orgs/directory')
        
    # extract the json data from the response object
    data = response.get_json() 
    print(json.dumps(data, indent=4))

    # checks if response is successful
    assert response.status_code == 200


def test_register_creates_user():
    # unique email each run so this can be rerun without hitting the 'user already exists' 400 path
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    response = client.post('/api/user/register', json={
        'email': unique_email,
        'password': 'testpassword123',
        'name': 'test user'
    })

    data = response.get_json()
    assert response.status_code == 201
    assert data['success'] is True

def test_register_missing_fields():
    response = client.post('/api/user/register', json={
        'email': 'missingpassword@example.com'
    })

    data = response.get_json()
    assert response.status_code == 400
    assert 'error' in data


def test_login_invalid_password():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    client.post('/api/user/register', json={
        'email': unique_email,
        'password': 'correctpassword',
        'name': 'test user'
    })

    response = client.post('/api/user/login', json={
        'email': unique_email,
        'password': 'wrongpassword'
    })
    
    data = response.get_json()
    assert response.status_code == 401
    assert data['error'] == 'Invalid email or password'

def test_login_nonexistent_user():
    response = client.post('/api/user/login', json={
        'email': 'jaydenwashere@gmail.com',
        'password': 'if ur reading this ur cool'
    })

    data = response.get_json()
    assert response.status_code == 401
    assert data['error'] == 'Invalid email or password'

def test_quiz_requires_login():
    response = client.post('/api/quiz', json={
        'responses': ['some', 'fake', 'answers']
    })

    data = response.get_json()
    assert response.status_code == 401
    assert data["error"] == 'User not logged in'

def test_quiz_missing_responses():
    response = client.post('/api/quiz', json={})

    data = response.get_json()
    assert response.status_code == 400
    assert data['error'] == 'missing quiz responses'

def test_directory_get_returns_list():
    response = client.get('/api/orgs/directory')

    data = response.get_json()
    assert response.status_code == 200
    assert data["success"] is True
    assert isinstance(data["directory"], list)

def test_directory_filter_returns_matching_tags_only():
    response = client.post('/api/orgs/directory', json={
        "filters": ['animals']
    })

    data = response.get_json()
    assert response.status_code == 200
    assert data["success"] is True

    for org in data["directory"]:
        assert "animals" in org['tags']

def test_favorite_requires_login():
    response = client.post('/api/favorite', json={'ein': '123456789'})

    data = response.get_json()
    assert response.status_code == 401
    assert data['error'] == 'Not logged in'

def test_user_results_requires_login():
    responses = client.get('/api/user/results')

    data = responses.get_json()
    assert responses.status_code == 401
    assert data["error"] == "Not logged in"