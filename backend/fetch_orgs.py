import os
import requests
import pandas as pd
import sqlalchemy as db
import json


cause_list = {
    "aapi-led",
    "adoption",
    "afghanistan",
    "animals",
    "art",
    "athletics",
    "autism",
    "black-led",
    "buddhism",
    "cancer",
    "cats",
    "christianity",
    "climate",
    "conservation",
    "coronavirus",
    "culture",
    "dance",
    "disabilities",
    "disease",
    "dogs",
    "education",
    "environment",
    "filmandtv",
    "food-security",
    "freepress",
    "gender-equality",
    "health",
    "hinduism",
    "housing",
    "humans",
    "hurricane-ian",
    "immigrants",
    "indigenous-led",
    "indigenous-peoples",
    "islam",
    "judaism",
    "justice",
    "latine-led",
    "legal",
    "lgbt",
    "libraries",
    "mental-health",
    "museums",
    "music",
    "oceans",
    "parks",
    "poverty",
    "racial-justice",
    "radio",
    "refugees",
    "religion",
    "research",
    "science",
    "seniors",
    "space",
    "theater",
    "transgender",
    "ukraine",
    "veterans",
    "votingrights",
    "water",
    "wildfires",
    "wildlife",
    "women-led",
    "womens-health",
    "youth",
}


def fetch_orgs(user_causes, cause, num_of_results, engine):
    myEveryorgApiKey = os.getenv('EVERYORG_KEY')
    
    if cause not in cause_list:
        raise Exception("Invalid cause for every.org api search.")
    
    my_params = {
    'apiKey': myEveryorgApiKey,
    'take': num_of_results,
    'page': 1
    }

    # GET request
    response = requests.get("https://partners.every.org/v0.2/browse/" + cause, params = my_params)
    result = response.json()

    # create a dataframe
    df = pd.DataFrame(result['nonprofits'], columns = ['ein', 'name', 'description', 'profileUrl',
    'websiteUrl', 'donationUrl', 'logoUrl', 'coverImageUrl', 'slug', 'location', 'tags'])

    np_eins = df['ein'].tolist()
    np_info_dicts = df.to_dict('records')

    return np_eins, np_info_dicts

    # filter out existing nonprofits
    # with engine.connect() as connection:
    #     existing_urls = pd.read_sql('SELECT "profileUrl" FROM "NonProfits"',
    #     con=engine)['profileUrl'].tolist()
    # df_new = df[~df['profileUrl'].isin(existing_urls)].copy()

    # if df_new.empty: return

    # # calculate scores
    # scores = []
    # for nonprofit_tags in df_new['tags']:
    #     scores.append(algorithm(user_causes, nonprofit_tags))
    # df_new['score'] = scores

    # # turn tags into a string
    # df_new['tags'] = df_new['tags'].apply(json.dumps)

    # df_new['shown'] = False
    # df_new['favorited'] = False

    # df_new.to_sql('NonProfits', con=engine, if_exists='append', index=False)


def algorithm(user_causes, nonprofit_tags):
    # input: dict, list
    score = 0
    for tag in nonprofit_tags:
        score += 10 * user_causes.get(tag, 0)
    return score


def select_orgs(engine):
    with engine.connect() as connection:
        result = connection.execute(db.text
        ("SELECT * FROM NonProfits WHERE shown == FALSE ORDER BY score DESC LIMIT 3"))
        rows = result.mappings().all()

        if not rows: return []

        # set the select orgs to shown
        update_data = [{"url": row['profileUrl']} for row in rows]
        connection.execute(db.text("""UPDATE NonProfits 
            SET shown = TRUE 
            WHERE profileURL = :url"""), update_data)
        connection.commit()
        
        return rows

def display_orgs(nonprofits):
    for nonprofit in nonprofits:
        print(nonprofit.name, '--', nonprofit.location) 
        print('-' * 50)
        print("Description: ", nonprofit.description)
        print("Profile URL: ", nonprofit.profileUrl)
        print("Website URL: ", nonprofit.websiteUrl)
        print()

