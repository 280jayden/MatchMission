import pytest
import json
from unittest.mock import patch
from app import app 

@patch("services.scoring.client")
def test_something(mock_client):
    mock_client.chat.completions.create.return_value = ...  # fake response
    # test your logic without hitting the real API


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
