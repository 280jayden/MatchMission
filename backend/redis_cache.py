import time
import redis
import requests
import os
import json
from dotenv import load_dotenv


load_dotenv()

# initalize global redis object
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
r = redis.Redis.from_url(redis_url,decode_responses=True)


# save_user_weights(user_id, causes: dict) -> None
## 

def get_user_weights(user_id): # -> dict {'tag': weight}
    
    # calculates top 5 tags to fetch via sort
    print("hello")
    # returns tag_lists to fetch [], cause_wts {}
    return ['animals', 'culture', 'immigrants', 'housing', 'youth'], {
    'animals' : 0.98,
    'culture' : 0.67,
    'immigrants' : 0.65,
    'housing' : 0.58,
    'youth' : 0.55,
    'music' : 0.44,
    'health' : 0.32,
    'freepress' : 0.21}

# update_user_weights(user_id, tags: list)
## after a user favorites a np, or unfavorites



def is_cached(tag):
    # checks if a specific tag is already loaded into a cache
    return r.exists(f"tag:{tag}") == 1


def cache_tags(tags: list, np_eins: list):
    # create caches for tags
    # np_eins called from API, dict.keys()
    # z(set) is a sorted set allowing for scores

    pipe = r.pipeline()

    for tag in tags:
        # initialize with base score of 1
        pipe.zadd(f"tag:{tag}", {ein: 1 for ein in np_eins})
    
    pipe.execute()


def load_nonprofits_json(nonprofits: list):
    # adds nonprofits info to main cache
    # input: list of dicts {ein:{info}}
    # called by backend to add to np table

    # prevents network bottlenecks for large batch
    pipe = r.pipeline()
    
    for np in nonprofits:
        for ein, info in np.items():
            pipe.set(f"nonprofit:{ein}", json.dumps(info))
    
    # execute all comands in the pipeline
    pipe.execute()


def get_nonprofits(np_eins: list): # output: initial filter of nonprofits (2k)
    # retrieves possible candidates of nonprofits
    keys = [f"nonprofit:{ein}" for ein in np_eins]
    raw_data = r.mget(keys)
    return [json.loads(data) for data in raw_data if data]


def get_next_batch(user_id, batch_size:int = 100):
    # retrieve user weights (put into backend.py?) or easy redis
    tags_to_fetch, user_wts = get_user_weights(user_id)

    # run ZUNIONSTORE to calculate scores across all nonprofits matching user's tags (get_nonprofits)


    # run ZDIFFSTORE against the shown:user:{user_id}


    # run ZREVRANGE to return the top batch_size IDs

    return

# updates redis when user sees a np
def mark_shown(user_id, nonprofit_eins: list[str]):
    # redis cache has a set of shown
    now = time.time()
    r.zadd(f"shown:user:{user_id}", {ein: now for ein in nonprofit_eins})
    
    # TODO: INSERT INTO DB UserInteractions table


