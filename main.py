import os
import sqlalchemy as db
from dotenv import load_dotenv
from fetch_orgs import fetch_orgs

if __name__ == '__main__':
  load_dotenv()
  myGeminiApiKey = os.getenv('GENAI_KEY')

  engine = db.create_engine('sqlite:///MatchMission.db')

  fetch_orgs("animals", 25, engine)
  fetch_orgs("cancer", 10, engine)