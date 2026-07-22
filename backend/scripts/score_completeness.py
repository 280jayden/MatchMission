# scripts/score_completeness.py

"""

This script goes through our postgres db and fills a completeness_score for every existing row in Nonprofits

"""

import sqlalchemy as db
from extensions import engine

WEIGHTS = {
    'logourl': 3,
    'websiteurl': 3,
    'coverimageurl': 2,
    'description': 2,
    'donationurl': 2,
    'ein': 1,
    'location': 1,
    'slug': 1,
}

TAG_COUNT_CAP = 5

def ensure_column():
    with engine.connect() as connection:
        connection.execute(db.text(
            "ALTER TABLE NonProfits ADD COLUMN IF NOT EXISTS completeness_score INTEGER DEFAULT 0"
        ))
        connection.commit()

def score_all():
    case_sql = " + ".join(
        f"CASE WHEN {field} IS NOT NULL AND {field} != '' THEN {weight} ELSE 0 END"
        for field, weight in WEIGHTS.items()
    )

    tag_bonus_sql = f"""
        LEAST(
            COALESCE(
                CASE
                    WHEN tags IS NOT NULL AND tags != '' AND tags LIKE '[%%]'
                    THEN json_array_length(tags::json)
                    ELSE 0
                END,
            0),
        {TAG_COUNT_CAP})
    """

    with engine.connect() as connection:
        result = connection.execute(db.text(
            f"UPDATE NonProfits SET completeness_score = {case_sql} + {tag_bonus_sql}"
        ))
        connection.commit()
    print(f"Scored {result.rowcount} orgs.")

if __name__ == "__main__":
    ensure_column()
    score_all()

