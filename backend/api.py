
from flask import Flask, request, jsonify # creates web server, lets you read json data frontend sends, converts Python dicts into JSON
from flask_cors import CORS # lets frontend talk to flask
import os # needed for os.getenv()
import sqlalchemy as db # talks to sqlite database
from dotenv import load_dotenv # loads env file
from fetch_orgs import fetch_orgs, select_orgs
from scoring import generate_user_profile
from questions import get_quiz_data

import time

load_dotenv()

app = Flask(__name__)
CORS(app)

engine = db.create_engine('sqlite:///MatchMission.db')

with engine.connect() as connection:
    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS NonProfits (
            name TEXT,
            description TEXT,
            profileUrl TEXT PRIMARY KEY,
            websiteUrl TEXT,
            location TEXT,
            tags TEXT,
            score REAL,
            shown BOOL,
            favorited BOOL
        );
    """))

@app.route('/api/questions', methods=['GET']) # this will give the frontend quiz questions, GET bc react is asking for the data
def get_questions():
    return jsonify(get_quiz_data())

@app.route('/api/quiz', methods=['POST']) # runs the full pipeline after user submits the quiz

def submit_quiz():
    data = request.get_json()
    name = data.get('name', 'User')
    responses = data.get('responses')
    
    if not responses:
        return jsonify({'error': 'missing quiz responses'}), 400
    user_profile = generate_user_profile(name, responses)

    if not user_profile:
        return jsonify({'error': 'failed to generate the profile'})

    #to_fetch
    """
    for cause in user_profile['tags_list_to_fetch']:
        fetch_orgs(user_profile['causes'], cause, to_fetch, engine)
    """
    #nonprofits

    return jsonify({
        'success': True,
        'profile': user_profile
    })

@app.route('/api/orgs', methods=['GET']) # gets the orgs needed
# get bc react is asking for the org data
def get_orgs():
    # migrate to redis
    nonprofits = select_orgs(engine)
    return jsonify({'nonprofits': [dict(n) for n in nonprofits]}) # this will convert each sqlalchemy row obj into a plain python dict. 
    # sends to react as json
    

@app.route('/api/favorite', methods=['POST']) # records when a user favorites an org
# post bc react is sending the data
def favorite_org():
    # get the json body
    data = request.get_json()
    profile_url = data['profileUrl']

    # flip favorited to true in the database
    with engine.connect() as connection:
        connection.execute(db.text(
            "UPDATE NonProfits SET favorited = TRUE WHERE profileUrl = :url"
        ), {"url": profile_url})
        connection.commit()
    return jsonify({"success": True})

"""
endpoints to add

add redis support, updated sql support


"""

"""
@app.route('/api/time')
def get_current_time():
    return {"time": time.time()}
"""