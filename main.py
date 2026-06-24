import requests
import pandas as pd
import sqlalchemy as db
import json

myPublicApiKey = 'pk_live_c5228e363c68a2c177763aea16b20d47'
engine = db.create_engine('sqlite:///MatchMission.db')

def fetch_cause(cause="animals", num_of_results=30):

  my_params = {
    'apiKey': myPublicApiKey,
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


fetch_cause("animals")
fetch_cause("cancer")