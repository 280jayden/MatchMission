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