
from flask import Flask, request, jsonify, session # creates web server, lets you read json data frontend sends, converts Python dicts into JSON, tracks session
from flask_cors import CORS # lets frontend talk to flask
import os # needed for os.getenv()
import sqlalchemy as db # talks to sqlite database
from dotenv import load_dotenv # loads env file
from fetch_orgs import fetch_orgs, select_orgs, fetch_org
from scoring import generate_user_profile
from werkzeug.security import generate_password_hash, check_password_hash
# from questions import get_quiz_data
from redis_cache import *
import uuid # for user id
import time

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'production_12347asy39nowzxuyexoiwokx982j3947mpz8vnt4ikde86h7878tgehas')

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
    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            email TEXT,
            password_hash TEXT,
            has_taken_quiz BOOL DEFAULT FALSE,
            profile TEXT, CHECK (json_valid(profile))
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

    used_id = session.get('user_id')  # Use session user_id if available
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

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

    with engine.connect() as connection:
        connection.execute(db.text(
            "UPDATE Users SET has_taken_quiz = TRUE, profile = :profile WHERE id = :user_id"
        ), {"profile": jsonify(user_profile).get_data(as_text=True), "user_id": user_id})
        connection.commit()

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

@app.route('/api/org/<ein>', methods=['GET'])
def get_org(ein):
  """
  Gets one org by the ein
  """
  return fetch_org(ein, engine)
    

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
  data = request.get_json() or {}

  email = data.get("email")
  password = data.get("password")
  
  if not email or not password:
    return jsonify({"error": "Missing fields"}), 400

  password_hash = generate_password_hash(password) #instead of putting password in directly, do this hash
  generated_id = str(uuid.uuid4()) # generates id from uuid

  # connect to db - add user to db
  with engine.connect() as connection:
    try:
        # check if user exists
        check_query = db.text("SELECT 1 FROM Users WHERE email = :email LIMIT 1")
        existing_user = connection.execute(check_query, {"email": email}).fetchone()
        
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
        
        # add user to db
        connection.execute(db.text(
            "INSERT INTO Users (id, email, password_hash) VALUES (:id, :email, :password_hash)"
        ), {"id": generated_id, "email": email, "password_hash": password_hash})
        connection.commit()


        return jsonify({"success": True, "message": "Account created."}), 201

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
  

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json() or {} # to protect against NoneType error if no json is sent

    email = data.get("email")
    password = data.get("password")
  
    # query db to see if this user exists
    query = db.text("SELECT id, password_hash FROM Users WHERE email = :email LIMIT 1")
    with engine.connect() as connection:
        user = connection.execute(query, {"email": email}).fetchone()

    # add this in when the db exists and we can query it
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    user_id, user_password_hash = user[0], user[1]

    if not check_password_hash(user_password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # otherwise, user should exist and password should be correct.
    #set current session user to this one
    session['user_id'] = user_id
    
    return jsonify({"success": True, "message": "Logged in."}), 201


@app.route("/api/get_current_user", methods=['GET'])
def get_current_user():
    uid = session.get('user_id')

    if uid:
      return jsonify({"user_id": uid})
    else:
      return jsonify({"error": "Not logged in"}), 401