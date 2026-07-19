import os
import sqlalchemy as db
from dotenv import load_dotenv

load_dotenv()

engine = db.create_engine(os.getenv('DATABASE_URL', 'sqlite:///MatchMission.db'),
    pool_pre_ping=True,
    pool_recycle=300

)