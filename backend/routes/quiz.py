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

@app.route('/api/quiz', methods=['POST']) # runs the full pipeline after user submits the quiz
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
