# scoring.py
#from questions import run_quiz <-- handled by flask now
from dotenv import load_dotenv
from openai import OpenAI

import os
import json

load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

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

    STEP BY STEP PROCESS:
    1. Read ALL 10 responses together as a complete picture of this person
    2. From that full picture, identify which tags from AVAILABLE TAGS best represent who this person is and what they care about
    3. Assign weights to those tags based on how strongly and consistently they appear across all responses
    4. A tag that shows up across multiple responses gets a higher weight than one mentioned once
    5. Use those tag names directly as keys in "causes"
    6. Pick the top 3 highest weighted tags for "tags_list_to_fetch"

    EXAMPLE:
    User responses mention ocean health twice, climate change three times, and science once.
    - "environment": 0.95 (climate mentioned most)
    - "oceans": 0.88 (ocean mentioned multiple times)
    - "research": 0.62 (science mentioned once)
    These become the keys in "causes" — real tag names, not placeholders.

    NEVER use placeholder names. ALWAYS use real tag names from AVAILABLE TAGS as keys.

    OUTPUT FORMAT (Return strictly this JSON structure and nothing else):
    {{
      "name": "User's Name",
      "tags_list_to_fetch": ["tag1", "tag2", "tag3"],
      "causes": {{
        "core_tag1": <weight between 0.90-1.00>,
        "core_tag2": <weight between 0.70-0.85>,
        "core_tag3": <weight between 0.40-0.60>,
        "secondary_tag1": <weight between 0.80-0.95>,
        "secondary_tag2": <weight between 0.65-0.75>,
        "secondary_tag3": <weight between 0.55-0.65>,
        "secondary_tag4": <weight between 0.45-0.55>,
        "secondary_tag5": <weight between 0.20-0.40>
      }}
    }}

    REPLACE each placeholder key with the actual matched tag name from AVAILABLE TAGS:
    - Replace "core_tag1", "core_tag2", "core_tag3" with your 3 matched core cause tags
    - Replace "secondary_tag1" through "secondary_tag5" with your 5 matched secondary cause tags
    - Replace "tag1", "tag2", "tag3" in tags_list_to_fetch with the top 3 highest weighted tags
    - NEVER output the literal strings "core_tag1", "secondary_tag1" etc. in your response

    STRICT REQUIREMENTS:
    - You MUST output EXACTLY 3 core cause tags in "causes" (weights 0.40-1.00)
    - You MUST output EXACTLY 5 secondary cause tags in "causes" (weights 0.20-0.95)
    - The "causes" dict MUST have EXACTLY 8 keys total — no more, no less
    - EVERY key MUST be a tag that exists EXACTLY as written in AVAILABLE TAGS above
    - Do NOT invent tags like "future", "technology", "sustainability" — if it's not in AVAILABLE TAGS it is forbidden
    - If you cannot find enough relevant tags, pick the closest matching ones from AVAILABLE TAGS
    - Do NOT return fewer than 8 causes under any circumstances

    - Weights must reflect genuine reasoning about the user's responses
    - A cause mentioned passionately across multiple answers should score near the top of its range
    - A cause only loosely implied should score near the bottom of its range
    - Do not space weights evenly — the gaps between weights should reflect how much more one cause matters than another
    """

  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
        {'role': 'user', 'content': prompt}
      ],
      response_format={'type': 'json_object'}
    )
    
    user_profile = json.loads(response.choices[0].message.content)
    return user_profile

  except Exception as e:
    print(f"\nThere was an error fetching Gemini: {e}")
    return None
  



def generate_weights_explanation(causes, user_responses):
  prompt = f"""
    You are explaining, on behalf of MatchMission, why the app matched this donor to their weighted causes.

    The user answered a 10-question quiz. Here are their responses:
    {json.dumps(user_responses)}

    Based on those responses, here is the weighted cause profile we matched them to:
    {json.dumps(causes)}

    In exactly 2-3 sentences, explain to the user why WE matched them to these causes.
    Speak as MatchMission using "we" (e.g. "we matched you with...", "we noticed you..."),
    not as if the user consciously chose or ranked these causes themselves — you are
    explaining our analysis of their answers, not describing their own self-awareness.
    Reference specific things they said in their answers. Be warm and specific, not generic.
    Return ONLY the explanation text, no preamble.
    """
  
  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[{'role': 'user', 'content': prompt}],
    )

    return response.choices[0].message.content.strip()
  except Exception as e:
    print(f"Error generating weights explanation: {e}")
    return ""


  
