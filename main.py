# main.py

import os
import sqlalchemy as db
from dotenv import load_dotenv
from questions import run_quiz
from fetch_orgs import *
from scoring import generate_user_profile


if __name__ == '__main__':
  load_dotenv()
  myGeminiApiKey = os.getenv('GENAI_KEY')

  engine = db.create_engine('sqlite:///MatchMission.db')

  user_profile = {'name': 'Carlos Jusino',
    # in descending order
    'top_5_tags_to_search': ['animals', 'culture', 'immigrants', 'housing', 'youth'],
    'animals' : 0.98,
    'culture' : 0.67,
    'immigrants' : 0.65,
    'housing' : 0.58,
    'youth' : 0.55,
    'music' : 0.44,
    'health' : 0.32,
    'freepress' : 0.21
    # omit categories that are < 0.15 match
  }
  
  # Welcome & 10 Question Quiz
  name, responses = run_quiz()

  user_profile = generate_user_profile(name, responses)

  # fetch_orgs({"animals": 0.99, "adoption": 0.8, "dogs":0.45, "cats":0.1},"animals", 10, engine) # West Hills Halo Fund Inc.
  to_fetch = 50
  for cause in user_profile['tags_list_to_fetch']:
    fetch_orgs(user_profile['causes'], cause, to_fetch, engine)
    to_fetch -= 5
  
  nonprofits = select_orgs(engine)
  display_orgs(nonprofits)
  
  