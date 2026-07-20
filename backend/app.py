import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import sqlalchemy as db

from extensions import engine
from routes.user import user_bp
from routes.orgs import orgs_bp
from routes.quiz import quiz_bp

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv(
    'SECRET_KEY', 
    'production_12347asy39nowzxuyexoiwokx982j3947mpz8vnt4ikde86h7878tgehas'
)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

with engine.connect() as connection:
    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS NonProfits (
            ein TEXT,
            name TEXT,
            description TEXT,
            profileUrl TEXT PRIMARY KEY,
            websiteUrl TEXT,
            location TEXT,
            tags TEXT
        );
    
    """))

    connection.execute(db.text("""
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            password_hash TEXT,
            has_taken_quiz BOOL DEFAULT FALSE,
            profile JSONB
        );
    """))
    connection.commit()


app.register_blueprint(user_bp)
app.register_blueprint(orgs_bp)
app.register_blueprint(quiz_bp)


if __name__ == '__main__':
    app.run(debug=True)
