import uuid
import json
import sqlalchemy as db
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import engine
from services.redis_cache import get_user_weights, get_next_batch, mark_shown
from services.scoring import generate_match_explanations

user_bp = Blueprint('user', __name__)

@user_bp.route("/api/user/register", methods=['POST'])
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

        session['user_id'] = generated_id


        return jsonify({"success": True, "message": "Account created."}), 201

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
  


@user_bp.route("/api/user/login", methods=['POST'])
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

@user_bp.route("/api/user/info", methods=['GET'])
def get_current_user():
    uid = session.get('user_id')
    if not uid:
      return jsonify({"error": "Not logged in"}), 401
      
    with engine.connect() as connection:
        query = db.text("SELECT has_taken_quiz FROM Users WHERE id = :user_id LIMIT 1")
        has_taken_quiz = connection.execute(query, {"user_id": uid}).fetchone()
        connection.commit()
    
    if not has_taken_quiz: # could not find user_id
        return jsonify({"error": "User not found"}), 404
    
    # Success
    return jsonify({
      "user_id": uid,
      "has_taken_quiz": has_taken_quiz[0]
    })



@user_bp.route("/api/user/logout", methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out."}), 200

@user_bp.route("/api/user/results", methods=['GET'])
def get_user_results():
    # if we have the results
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    with engine.connect() as connection:
        query = db.text('SELECT profile FROM Users WHERE id = :user_id LIMIT 1')
        result = connection.execute(query, {'user_id': user_id}).fetchone()
    
    if not result or not result[0]:
        return jsonify({"error": "No profile found. Submit the quiz first."}), 404
    
    profile = result[0]

    # print(profile)
    # print(jsonify(profile))
    if isinstance(profile, str):
        profile = json.loads(profile)


    if "matches" in profile and profile["matches"]:
        return jsonify({"success": True, "matches": profile["matches"], "cached": True})
    
    # If its not generated yet
    user_tags, user_wts = get_user_weights(user_id)
    if not user_wts:
        return jsonify({"error": "No weights found. Submit the quiz first"}), 404
    
    matches = get_next_batch(user_id, user_wts, 20)
    if not matches:
        return jsonify ({"error": "No matching orgs found yet. Try submitting the quiz again."}), 404
    
    matches = generate_match_explanations(profile.get("causes", {}), matches)

    mark_shown(user_id, [org.get('ein') for org in matches if org.get('ein')])

    # if isinstance(profile, str):
    #     profile = json.loads(profile)


    profile["matches"] = matches
    with engine.connect() as connection:
        connection.execute(db.text(
            'UPDATE Users SET profile = :profile WHERE id = :user_id'
            ), {"profile": json.dumps(profile), "user_id": user_id}
        )
        connection.commit()

    return jsonify({"success": True, "matches": profile["matches"], "cached": False})


@user_bp.route("/api/user/weights", methods=['GET'])
def get_user_weights_endpoint():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    with engine.connect() as connection:
        query = db.text('SELECT profile FROM Users WHERE id = :user_id LIMIT 1')
        result = connection.execute(query, {"user_id": user_id}).fetchone()

    if not result or not result[0]:
        return jsonify({"error": "No profile found. Submit the quiz first."}), 404
    
    profile = result[0]

    if isinstance(profile, str):
        profile = json.loads(profile)

    return jsonify({
        "success": True,
        "weights": profile.get("causes", {}),
        "explanation": profile.get("weights_explanation")
    })
    