# scoring.py
from questions import run_quiz
from dotenv import load_dotenv
from google.genai import types

import os
import json
from google import genai

load_dotenv()


client = genai.Client(api_key=os.getenv("GENAI_KEY"))

def generate_user_profile(name, user_responses):
  # takes users quiz answers, feeds them into gemini

  prompt = f"""
  You are the scoring engine for 'MatchMission', a personalized philanthropic matchmaking app.
  Your task is to analyze a user's 10-question quiz responses and convert them into a weighted JSON profile.
  
  User Name: {name}
  User Responses: {json.dumps(user_responses)}

  AVAILABLE TAGS (You MUST ONLY use these tags):
    Core Causes: animals, culture, education, environment, health, humans, justice, religion, research
    Secondary Causes / Modifiers: aapi-led, adoption, afghanistan, art, athletics, autism, black-led, buddhism, cancer, cats, christianity, climate, conservation, coronavirus, dance, disabilities, disease, dogs, filmandtv, food-security, freepress, gender-equality, hinduism, housing, hurricane-ian, immigrants, indigenous-led, indigenous-peoples, islam, judaism, latine-led, legal, lgbt, libraries, mental-health, museums, music, oceans, parks, poverty, racial-justice, radio, refugees, science, seniors, space, theater, transgender, ukraine, veterans, votingrights, water, wildfires, wildlife, women-led, womens-health, youth
  
  SCORING RULES & FORMULA:
    1. CAPS: You MUST output a MAXIMUM of 3 `core_causes` and a MAXIMUM of 5 `secondary_causes`. Omit lower-priority causes to meet these caps.
    2. DISTINCT WEIGHTS: Do not assign the same weight to multiple tags. Create a clear mathematical hierarchy.
    3. "core_causes" Weighting Formula (Max 3):
       - Tier 1 (Derived from Q1 - Million Dollars): Weight = 0.90 to 1.00.
       - Tier 2 (Derived from Q3 - Second Cause): Weight = 0.70 to 0.85.
       - Tier 3 (Derived from Q10 - Open text hints): Weight = 0.40 to 0.60.
    4. "secondary_causes" Weighting Formula (Max 5):
       - Tier 1 (Derived from Q2 - Most drawn to): Weight = 0.80 to 0.95.
       - Tier 2 (Derived from Q6 - Who to uplift): Weight = 0.65 to 0.75.
       - Tier 3 (Derived from Q7 - Marginalized leadership): Weight = 0.55 to 0.65.
       - Tier 4 (Derived from Q8 - Faith based): Weight = 0.45 to 0.55.
       - Tier 5 (Derived from Q10 - Open text specific mentions): Weight = 0.20 to 0.40.
    5. "tags_list_to_fetch": Select the absolute top 3 most relevant tags (combining core and secondary) that the backend should query the Every.org API with to get the best candidate batch.

    OUTPUT FORMAT (Return strictly this JSON structure and nothing else):
    {{
      "name": "User's Name",
      "tags_list_to_fetch": ["tag1", "tag2", "tag3"],
      "causes": {{
        "core_tag1": 0.95,
        "core_tag2": 0.78,
        "core_tag3": 0.73
        "secondary_tag1": 0.88,
        "secondary_tag2": 0.71,
        "secondary_tag3": 0.62,
        "secondary_tag4": 0.50,
        "secondary_tag5": 0.35
      }}
    }}
    """

  try:
    response = client.models.generate_content(
      model="gemini-2.5-flash", contents=prompt,
      config=types.GenerateContentConfig(response_mime_type='application/json')
    )
    
    user_profile = json.loads(response.text)
    return user_profile

  except Exception as e:
    print(f"\nThere was an error fetching Gemini: {e}")
    return None
    


#TODO: put this in main
#print(f"\nEvaluating {name}'s interests...")




  

