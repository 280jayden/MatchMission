import requests
import pandas as pd
import sqlalchemy as db
import json

myPublicApiKey = 'pk_live_c5228e363c68a2c177763aea16b20d47'
cause = "animals"

# GET request
response = requests.get("https://partners.every.org/v0.2/search/" + cause + "?apiKey=" + myPublicApiKey)
animalNonProfits = response.json()

# create a dataframe
df = pd.DataFrame.from_dict(animalNonProfits)
print(df)

engine = db.create_engine('sqlite:///MatchMission.db')

# df.to_sql('NonProfits', con=engine, if_exists='replace', index=False)

# with engine.connect() as connection:
#    query_result = connection.execute(db.text("SELECT * FROM NonProfits;")).fetchall()
#    print(pd.DataFrame(query_result))
