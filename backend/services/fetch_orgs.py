import os
import requests
import pandas as pd
import sqlalchemy as db
import json
import numpy as np


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

def resize_image(url):
    """
    Converts an Every.org Cloudinary logo URL into a larger square image.

    Every.org stores organization logos using Cloudinary transformations.
    This function replaces the default thumbnail transformations with a
    higher-resolution 600x600 version suitable for display.

    Args:
        url (str): Original Cloudinary image URL.

    Returns:
        str: Updated image URL with larger dimensions, or an empty string
        if no URL is provided.
    """
    if not url:
      return ""

    parts = url.split("/")

    # Replace the default thumbnail transformations with a larger square image.
    parts[6] = 'c_lfill,w_600,h_600,dpr_2'
    parts[7] = 'c_crop,ar_600:600'

    return "/".join(parts)

def fetch_orgs(user_causes, cause, num_of_results, engine):
    myEveryorgApiKey = os.getenv('EVERYORG_KEY')
    
    if cause not in cause_list:
        #raise Exception("Invalid cause for every.org api search.")
        return [], [] 
    
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

    df = df.replace({np.nan: None})

    df["logoUrl"] = df["logoUrl"].apply(resize_image)
    
    # np_eins = df['ein'].tolist()
    # np_info_dicts = df.to_dict('records')

    np_eins = [ein for ein in df['ein'].tolist() if ein is not None]  # clean list, only for redis
    np_info_dicts = df.to_dict('records')  # untouched, still has None for missing eins, safe for JSON

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


def fetch_org(ein):
    """
    Fetches a single nonprofit organization from the Every.org API.

    Retrieves nonprofit information using the organization's EIN and
    formats the logo URL into a larger display image if available.

    Args:
        ein (str): Employer Identification Number of the nonprofit.

    Returns:
        dict: Nonprofit information returned from the Every.org API.
              Returns an empty dictionary if no data is found.
    """
    apiKey = os.getenv('EVERYORG_KEY')

    # GET request
    response = requests.get(f"https://partners.every.org/v0.2/nonprofit/{ein}?apiKey={apiKey}")
    result = response.json()

    nonprofit = result.get("data", {})

    if nonprofit.get("logoUrl"):
        nonprofit["logoUrl"] = resize_image(nonprofit["logoUrl"])

    return nonprofit

def fetch_propublica_data(ein):
    """
    Fetches a single nonprofit organization from the ProPublica Nonprofit Explorer API.

    Args:
        ein (str): Employer Identification Number of the nonprofit.
    
    Returns:
        dict: Nonprofit information returned from the ProPublica API, including
                subsection code, NTEE code, founding date, and latest filing data.
                Returns None if no data is found or if the request fails.
    """

    try:
        resp = requests.get(
            f"https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json"
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        
        if 'organization' not in data:
            return None
            
        filings = data.get('filings_with_data', [])
        latest = filings[0] if filings else None

        historical_revenue = []
        for filing in filings:
            year = filing.get('tax_prd_yr')
            revenue = filing.get('totrevenue')
            
            if year and revenue is not None:
                historical_revenue.append({
                    "year": year,
                    "revenue": revenue
                })
        
        # Sort chronologically (oldest to newest)
        historical_revenue = sorted(historical_revenue, key=lambda x: x['year'])
        filings_count = len(data.get('filings_with_data', [])) + len(data.get('filings_without_data', []))

        return {
            "subsectionCode": data['organization'].get('subsection_code'),
            "nteeCode": data['organization'].get('ntee_code'),
            "foundedDate": data['organization'].get('ruling_date', ''),
            "latestFiling": {
                "year": latest.get('tax_prd_yr'),
                "totalRevenue": latest.get('totrevenue'),
                "totalExpenses": latest.get('totfuncexpns'),
                "totalAssets": latest.get('totassetsend'),
                "totalLiabilities": latest.get('totliabend'),
            },
            "historicalRevenue": historical_revenue,
            "filingsCount": filings_count
            if latest else None,
        }
    except requests.RequestException as e:
        print(f"API Request failed: {e}")
        return None

def query_nonprofits_db_by_tags(engine, tags: list[str], exclude_eins: list[str], limit: int):
    """
    This is the second check for org filtering.
    We query the NonProfits table for orgs matching ALL given tags
    (AND logic), we exclude anything that is already collected from Redis.
    I decided to use LIKE since `tags` is stored as a JSON string, not JSONB
    
    """

    if not tags:
        return []

    conditions = " AND ".join([f"tags LIKE :tag{i}" for i in range(len(tags))])
    params = {f"tag{i}": f"%{tag}%" for i, tag in enumerate(tags)}
    params['limit'] = limit
    params['exclude_eins'] = exclude_eins if exclude_eins else ['']

    query = f"""
        SELECT ein, name, description, logoUrl, websiteUrl, profileUrl, location, slug, donationUrl, coverImageUrl, tags
        FROM NonProfits
        WHERE ({conditions})
        AND ein != ALL(:exclude_eins)
        LIMIT :limit    
    """ 

    with engine.connect() as connection:
        result = connection.execute(db.text(query), params).fetchall()
    
    return [dict(row._mapping) for row in result]
