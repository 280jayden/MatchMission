
from flask import Flask, request, jsonify # creates web server, lets you read json data frontend sends, converts Python dicts into JSON
from flask_cors import CORS # lets frontend talk to flask
import os # needed for os.getenv()
import sqlalchemy as db # talks to sqlite database
from dotenv import load_dotenv # loads env file
from fetch_orgs import fetch_orgs, select_orgs
from scoring import generate_user_profile
from werkzeug.security import generate_password_hash, check_password_hash
# from questions import get_quiz_data
from redis_cache import *

import time

load_dotenv()

app = Flask(__name__)
CORS(app)

engine = db.create_engine('sqlite:///MatchMission.db')

with engine.connect() as connection:
    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS NonProfits (
            ein TEXT,
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

# def submit_quiz():
#     data = request.get_json()
#     # name = data['name']
#     responses = data['responses']

#     user_profile = generate_user_profile(name, responses)

#     if not user_profile:
#         return jsonify({'error': 'failed to generate the profile'})

#     #to_fetch
#     """
#     for cause in user_profile['tags_list_to_fetch']:
#         fetch_orgs(user_profile['causes'], cause, to_fetch, engine)
#     """
#     #nonprofits

def submit_quiz():
    data = request.get_json()
    # name = data.get('name', 'User')
    responses = data.get('responses')
    
    if not responses:
        return jsonify({'error': 'missing quiz responses'}), 400
    user_profile = generate_user_profile("placeholder name", responses)

    user_id = '12345678' # TODO: configure with auth probably (JUST A PLACEHOLDER)

    # saving user weights that openai scoring generated in redis under the user id
    save_user_weights(user_id, user_profile['causes']) # saving the specific user cause weights
 


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


@app.route('/api/refresh_orgs', methods=['GET']) # gets the orgs needed
# get bc react is asking for the org data
def get_orgs():
    # migrate to redis
    user_id = '123456789' # TODO: configure with auth
    user_tags, user_wts = get_user_weights(user_id)

    tags_to_fetch = [tag for tag in user_tags if not is_cached(tag)]
    # TODO: figure out how to see if there are enough not shown nonprofits in cache, if not fetch more
    
    if tags_to_fetch:
        nonprofits_dict_list = []
        for tag in tags_to_fetch:
            # fetches orgs (max 100) for each tag
            np_eins, nonprofits_info = fetch_orgs(user_tags, tag, 100, engine) 
            cache_tags(tag, np_eins) # redis caches the ein list for each tag
            nonprofits_dict_list.extend(nonprofits_info)
        
        # loads nonprofits into redis main cache
        load_nonprofits_json(nonprofits_dict_list)

    
    next_batch = get_next_batch(user_id, user_wts, 10)
    # TODO: add shown logic for the sent batch

    return jsonify(next_batch)
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


@app.route('/api/unfavorite', methods=['POST']) # records when a user un-favorites an org
# post bc react is sending the data
def unfavorite_org():
    # get the json body
    data = request.get_json()
    profile_url = data['profileUrl']

    # flip favorited to true in the database
    with engine.connect() as connection:
        connection.execute(db.text(
            "UPDATE NonProfits SET favorited = FALSE WHERE profileUrl = :url"
        ), {"url": profile_url})
        connection.commit()
    return jsonify({"success": True})

"""
endpoints to add

add redis support, updated sql support


"""


# AUTH ENDPOINTS

@app.route("/api/register", methods=['POST'])
def register():
  data = request.get_json()

  email = data.get("email")
  password = data.get("password")
  
  if not email or not password:
    return jsonify({"error": "Missing fields"}), 400

  password_hash = generate_password_hash(password) #instead of putting password in directly, do this hash
  
  #TODO: connect to db - add user to db 
  #TODO: set current session user to this one
  
  return jsonify({"success": True, "message": "Account created."}), 201


@app.route("/api/login", methods=['POST'])
def login():
  data = request.get_json()

  email = data.get("email")
  password = data.get("password")
  
  #TODO: query db to see if this user exists

  # TODO: add this in when the db exists and we can query it
  # if not user:
  #   return jsonify({"error": "Invalid email or password"}), 401

  # if not check_password_hash(user["password_hash"], password):
  #   return jsonify({"error": "Invalid email or password"}), 401

  # otherwise, user should exist and password should be correct. TODO: set current session user to this one
  
  return jsonify({"success": True, "message": "Logged in."}), 201