# main.py

import os
import sqlalchemy as db
from dotenv import load_dotenv
from questions import run_quiz
from fetch_orgs import *


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
  fetch_orgs("animals", 10, engine)
  nonprofits = select_orgs(engine)
  display_orgs(nonprofits)
  # name, responses = run_quiz()

  # user_profile = llm weight ranking(responses)
    # tell llm to take the responses, give weights, output a 
    # json in the format of user_profile above

  # fetch_orgs("animals", 25, engine)
  # fetch_orgs(tag) for t in tags_to_search
    # get in batches of 30, 25, 20, 15, 10 (5 total fetches)
    # will be sorted in db by a 'match score'
    # fetch_orgs("animals", 25, engine)
    # fetch_orgs("cancer", 10, engine)
  
  # display_top_5_matches()