import pytest
import sqlalchemy as db
from services.fetch_orgs import *
from services.questions import is_valid_choice

def test_algorithm():
    user_causes = {'animals': 0.99, 'research': 0.85, 'education': 0.65, 'environment': 0.56}
    nonprofit_tags = ['animals', 'environment', 'dance']
    result = 10 * 0.99 + 10 * 0.56 + 10 * 0
    assert algorithm(user_causes, nonprofit_tags) == result


def test_invalid_fetch():
    user_causes = {'animals': 0.99, 'research': 0.85, 'education': 0.65, 'environment': 0.56}
    engine = db.create_engine('sqlite:///MatchMission.db')

    with pytest.raises(Exception): # if code returns successfully, test fails
        fetch_orgs(user_causes, "invalid_cause", 15, engine)

def test_invalid_choice():
    options = ["1", "2", "3"]
    assert is_valid_choice("4", options) == False