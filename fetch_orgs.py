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
    # print(df)


    df.to_sql('NonProfits', con=engine, if_exists='append', index=False)

    with engine.connect() as connection:
    # TODO: how to prevent duplicate entries
        query_result = connection.execute(db.text("SELECT * FROM NonProfits;")).fetchall()
        print(pd.DataFrame(query_result))
