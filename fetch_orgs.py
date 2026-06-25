import os
import requests
import pandas as pd
import sqlalchemy as db
import json

def fetch_orgs(cause, num_of_results, engine):
    myEveryorgApiKey = os.getenv('EVERYORG_KEY')

    my_params = {
    'apiKey': myEveryorgApiKey,
    'take': num_of_results,
    'page': 1
    }

    # GET request
    response = requests.get("https://partners.every.org/v0.2/browse/" + cause, params = my_params)
    result = response.json()

    # create a dataframe
    df = pd.DataFrame(result['nonprofits'], columns = ['name', 'description', 'profileUrl', 'websiteUrl', 'location', 'tags'])

    # turn tags into a string
    df['tags'] = df['tags'].apply(json.dumps)
    df['score'] = 0

    # specify the dataframe, selecting primary key in dataframe and in sqlite so that dupes don't get added
    df.to_sql('NonProfits', con=engine, if_exists='append', index=False)

    with engine.connect() as connection:
    # TODO: how to prevent duplicate entries
        # add a GROUP BY
        query_result = connection.execute(db.text("SELECT * FROM NonProfits;")).fetchall()
        print(pd.DataFrame(query_result))
# check if duplicates

def algorithm(user_causes, nonprofit_tags):
    # input: dict, list
    score = 0
    for tag in nonprofit_tags:
        score += 10 * user_causes.get(tag, 0)
    return score


def select_orgs(engine):
    with engine.connect() as connection:
        result = connection.execute(db.text("SELECT * FROM NonProfits ORDER BY score DESC LIMIT 3"))
        nonprofits = result
    return result

def display_orgs(nonprofits):
    for nonprofit in nonprofits:
        print(nonprofit[0], '--', nonprofit[4]) # Name
        print('-' * 50)
        print("Description: ", nonprofit[1])
        print("Profile URL: ", nonprofit[2])
        print("Website URL: ", nonprofit[3])
        # print("Why this fits: ") # call Gemini API for summary
        print()

