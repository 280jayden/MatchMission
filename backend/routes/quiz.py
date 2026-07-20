import json
from flask import Blueprint, request, jsonify, session
import sqlalchemy as db
from extensions import engine
from services.scoring import generate_user_profile, generate_weights_explanation
from services.questions import get_quiz_data
from services.redis_cache import save_user_weights

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/api/questions', methods=['GET']) # this will give the frontend quiz questions, GET bc react is asking for the data
def get_questions():
    return jsonify(get_quiz_data())

@quiz_bp.route('/api/quiz', methods=['POST']) # runs the full pipeline after user submits the quiz
def submit_quiz():
    data = request.get_json() or {}
    # name = data.get('name', 'User')
    responses = data.get('responses')
    
    if not responses:
        return jsonify({'error': 'missing quiz responses'}), 400
    user_profile = generate_user_profile("placeholder name", responses)

    user_id = session.get('user_id')  # Use session user_id if available
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    if not user_profile:
        return jsonify({'error': 'failed to generate the profile'})
    
    user_profile['weights_explanation'] = generate_weights_explanation(user_profile['causes'], responses)


    # saving user weights that openai scoring generated in redis under the user id
    save_user_weights(user_id, user_profile['causes']) # saving the specific user cause weights

    with engine.connect() as connection:
        connection.execute(db.text(
            "UPDATE Users SET has_taken_quiz = TRUE, profile = :profile WHERE id = :user_id"
        ), {"profile": json.dumps(user_profile), "user_id": user_id})
        connection.commit()

    return jsonify({
        'success': True,
        'profile': user_profile
    })


