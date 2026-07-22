# scripts/populate_db.py


"""

Populates the NonProfits table in Postgres with real nonprofit data
pulled from Every.org's browse API

"""

import time
import json
import requests
import sqlalchemy as db
from itertools import count
from services.fetch_orgs import cause_list, resize_image, compute_completeness_score
from extensions import engine
import os
from dotenv import load_dotenv


load_dotenv()

TAKE_PER_TAG = 50
DELAY_BETWEEN_REQUESTS = 0.5

# creates the PopulatePostgres and NonProfits tables if they do not already exist
def ensure_progress_table():
  with engine.connect() as connection:
    connection.execute(db.text("""
      CREATE TABLE IF NOT EXISTS PopulatePostgres (
        tag TEXT PRIMARY KEY,
        next_page INTEGER DEFAULT 1,
        exhausted BOOL DEFAULT FALSE
      );
    """))
    connection.execute(db.text("""
      CREATE TABLE IF NOT EXISTS NonProfits (
        ein TEXT,
        name TEXT,
        description TEXT,
        profileUrl TEXT PRIMARY KEY,
        websiteUrl TEXT,
        donationUrl TEXT,
        logoUrl TEXT,
        coverImageUrl TEXT,
        slug TEXT,
        location TEXT,
        tags TEXT
      );
    """))
    connection.commit()

# sends a GET request, retrying with exponential backoff if rate limited
def fetch_with_backoff(url, params, max_retries=3):
  for attempt in range(max_retries):
    response = requests.get(url, params=params)
    if response.status_code == 429:
      wait = 2 ** attempt
      print(f"Rate limited, waiting {wait}s...")
      time.sleep(wait)
      continue
    return response
  return response

# looks up which page a tag is currently on, and whether it's exhausted
def get_tag_state(tag):
  with engine.connect() as connection:
    result = connection.execute(db.text(
      "SELECT next_page, exhausted FROM PopulatePostgres WHERE tag = :tag"

    ), {"tag": tag}).fetchone()
  
  if result:
    return result[0], result[1]
  return 1, False

# saves a tag's current progress so the script can resume from here later
def save_progress(tag, next_page, exhausted=False):
  with engine.connect() as connection:
    connection.execute(db.text("""
      INSERT INTO PopulatePostgres (tag, next_page, exhausted)
      VALUES (:tag, :next_page, :exhausted)
      ON CONFLICT (tag) DO UPDATE SET next_page = :next_page, exhausted = :exhausted

    """), {"tag": tag, "next_page": next_page, "exhausted": exhausted})
    connection.commit()

def all_tags_exhausted(tags):
  with engine.connect() as connection:
    result = connection.execute(db.text(
      "SELECT COUNT(*) FROM PopulatePostgres WHERE tag = ANY(:tags) AND exhausted = TRUE"
    ), {"tags": tags}).fetchone()
  return result[0] >= len(tags)

# fetches one page of orgs for one tag and inserts any new ones into NonProfits
def fetch_and_store_page(tag, page):
  api_key = os.getenv('EVERYORG_KEY')
  params = {'apiKey': api_key, 'take': TAKE_PER_TAG, 'page': page}
  response = fetch_with_backoff(f"https://partners.every.org/v0.2/browse/{tag}", params)
  
  if response.status_code != 200:
    print(f"[{tag}] page {page}: request failed with status {response.status_code}, will retry next run")
    return "error"
  
  result = response.json()
  nonprofits = result.get("nonprofits", [])

  if not nonprofits:
    return None
  
  new_inserts = 0
  with engine.connect() as connection:
    
    for org in nonprofits:
      
      logo_url = org.get("logoUrl")
      if logo_url:
        logo_url = resize_image(logo_url)
      
      completeness_score = compute_completeness_score(org)
      
      res = connection.execute(db.text("""
        INSERT INTO NonProfits (ein, name, description, profileUrl, websiteUrl, donationUrl, logoUrl, coverImageUrl, slug, location, tags, completeness_score)
        VALUES (:ein, :name, :description, :profileUrl, :websiteUrl, :donationUrl, :logoUrl, :coverImageUrl, :slug, :location, :tags, :completeness_score)
        ON CONFLICT (profileUrl) DO NOTHING
      """), {
        "ein": org.get("ein"),
                "name": org.get("name"),
                "description": org.get("description"),
                "profileUrl": org.get("profileUrl"),
                "websiteUrl": org.get("websiteUrl"),
                "donationUrl": org.get("donationUrl"),
                "logoUrl": logo_url,
                "coverImageUrl": org.get("coverImageUrl"),
                "slug": org.get("slug"),
                "location": org.get("location"),
                "tags": json.dumps(org.get("tags", [])),
                "completeness_score": completeness_score
      })

      new_inserts += res.rowcount
    connection.commit()
  
  return new_inserts, len(nonprofits)

# loops through every tag one page at a time, cycling through all tags before moving on to the next page
def populate_all_tags():
  ensure_progress_table()
  tags = list(cause_list)
  grand_total = 0
  start_time = time.time()

  for page in count(1):
    any_tag_active = False

    for tag in tags:
      next_page, exhausted = get_tag_state(tag)

      if exhausted or next_page != page:
        continue
      
      any_tag_active = True
      try:
        result = fetch_and_store_page(tag, page)

        if result is None:
          print(f"page {page} | [{tag}] --> 0 orgs returned, tag exhausted")
          save_progress(tag, page, exhausted=True)
        elif result == "error":
          print(f"page {page} | [{tag}] --> request failed, will retry next run")
          # don't save_progress — leave next_page as-is so it retries
        else:
          new_inserts, total_returned = result
          grand_total += new_inserts
          print(f"page {page} | [{tag}] --> {new_inserts} orgs retrieved and stored (of {total_returned} returned!)")
          save_progress(tag, page + 1)
      
        time.sleep(DELAY_BETWEEN_REQUESTS)
      
      except Exception as e:
        print(f"page {page} | [{tag}] ERROR:{e}")
      
    if not any_tag_active:
      if all_tags_exhausted(tags):
        print("\nall tags exhausted, nothing left to fetch.")
      else:
        print(f"\nNo tags matched page {page} (likely all failed last round) --> stopping to avoid a false 'done' signal. check errors above and rerun.")
      break
  
  elapsed = round(time.time() - start_time, 1)
  print("\nDone!")
  print(f"Total new orgs inserted this run: {grand_total}")
  print(f"Time elapsed: {elapsed}s")


if __name__ == "__main__":
  populate_all_tags()