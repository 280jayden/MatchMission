import pytest
import json

from api import app 

client = app.test_client()

def test_refresh_orgs():
    print("Testing the API internally via Flask Test Client...\n")

    # GET request
    response = client.get('/api/refresh_orgs')

        
    # extract the json data from the response object
    data = response.get_json() 
    print(json.dumps(data, indent=4))

    # checks if response is successful
    assert response.status_code == 200
    # print("Success! Status Code: 200")