# main.py

import os
import sqlalchemy as db
from dotenv import load_dotenv
from questions import run_quiz
from fetch_orgs import *
from scoring import generate_user_profile


def is_valid_input(choice):
  if choice == '1' or choice == '2' or choice == 'q':
    return True
  return False


if __name__ == '__main__':
  load_dotenv()
  myGeminiApiKey = os.getenv('GENAI_KEY')

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
    connection.commit()
  
  default_user_profile = {'name': 'Carlos Jusino',
    # in descending order
    'tags_list_to_fetch': ['animals', 'culture', 'immigrants', 'housing', 'youth'],
    'causes': {'animals' : 0.98,
    'culture' : 0.67,
    'immigrants' : 0.65,
    'housing' : 0.58,
    'youth' : 0.55,
    'music' : 0.44,
    'health' : 0.32,
    'freepress' : 0.21}
  }
  
  # Welcome & 10 Question Quiz
  name, responses = run_quiz()

  user_profile = generate_user_profile(name, responses)
    
  if not user_profile: 
    print()
    print("Gemini API problem occured. Using default profile\n")
    user_profile = default_user_profile
    
  to_fetch = 50
  for cause in user_profile['tags_list_to_fetch']:
    fetch_orgs(user_profile['causes'], cause, to_fetch, engine)
    to_fetch -= 5
  
  is_running = True
  while is_running:
    print()
    nonprofits = select_orgs(engine)
    display_orgs(nonprofits)

    is_valid = False
    while not is_valid:
      choice = input("Favorite (1), Keep Browsing (2), Exit (q): ")
      is_valid = is_valid_input(choice)
      if not is_valid:
        print("Invalid choice, select 1/2/q")
    
    if choice == '1':
      choice = input("Which would you like to favorite 1/2/3? ")
      print(f"Favorited {choice}!")
    elif choice == 'q':
      is_running = False
    
  print()
  print("="*50)
  print("Thank you for using Match Mission, have a nice day!")
