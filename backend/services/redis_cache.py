import json
import os
import time
import uuid

import redis
from dotenv import load_dotenv
from extensions import engine
from services.fetch_orgs import get_nonprofits_db

load_dotenv()

# initalize global redis object
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
r = redis.Redis.from_url(redis_url,decode_responses=True)


# save_user_weights(user_id, causes: dict) -> None
def save_user_weights(user_id, causes: dict):
    # save the user's cause/tag weights in Redis
    # ex key: user:123:weights -> animals: 0.98, health: 0.32

    if not user_id or not causes:
        return

    key = f'user:{user_id}:weights'

    r.hset(
        key,
        mapping={tag: float(weight) for tag, weight in causes.items()}
    )


##

def get_user_weights(user_id): # -> dict {'tag': weight}

    # this should get the user's saved weights from Redis
    key = f'user:{user_id}:weights'
    stored_weights = r.hgetall(key)

    if not stored_weights:
        return [], {}

    user_wts = {
        tag: float(weight)
        for tag, weight in stored_weights.items()
    }

    tags_to_fetch = sorted(
        user_wts,
        key=user_wts.get,
        reverse=True
    )[:5] # gets top 5

    return tags_to_fetch, user_wts

    # return ['animals', 'culture', 'immigrants', 'housing', 'youth'], {
    #   'animals' : 0.98,
    #   'culture' : 0.67,
    #   'immigrants' : 0.65,
    #   'housing' : 0.58,
    #   'youth' : 0.55,
    #   'music' : 0.44,
    #   'health' : 0.32,
    #   'freepress' : 0.21}

# update_user_weights(user_id, tags: list)
## after a user favorites a np, or unfavorites



def is_cached(tag):
    # checks if a specific tag is already loaded into a cache
    return r.exists(f"tag:{tag}") == 1


def cache_tags(tag: str, np_eins: list):
    # create caches for tags
    # np_eins called from API, dict.keys()
    # z(set) is a sorted set allowing for scores

    if not np_eins:
        return


    # initialize with base score of 1
    r.zadd(f"tag:{tag}", {ein: 1 for ein in np_eins})



def get_next_batch(user_id, user_wts, batch_size:int = 100):
    tag_weights = {
      f"tag:{tag}": weight
      for tag, weight in user_wts.items()
      if r.exists(f"tag:{tag}")
    }

    if not tag_weights:
      return []
    
    user_scored_key = f"user_scored:{user_id}"
    user_batch_key = f"user_batch:{user_id}"
    shown_key = f"shown:user:{user_id}"

    if not r.exists(shown_key):
      r.zadd(shown_key, {"_dummy_": 0})
    
    r.zunionstore(user_scored_key, tag_weights, aggregate='SUM')
    r.zdiffstore(user_batch_key, [user_scored_key, shown_key])

    top_eins = r.zrevrange(user_batch_key, 0, batch_size - 1)

    r.delete(user_scored_key, user_batch_key)

    return get_nonprofits_db(engine, top_eins)

# updates redis when user sees a np
def mark_shown(user_id, nonprofit_eins: list[str]):
    # redis cache has a set of shown
    now = time.time()
    r.zadd(f"shown:user:{user_id}", {ein: now for ein in nonprofit_eins})

    # TODO: INSERT INTO DB UserInteractions table

def mark_favorited(user_id, nonprofit_ein: str):
    # updates redis when user favorites a np
    key = f'user:{user_id}:favorites'

    # adds to set user:user_id:favorites
    r.sadd(key, nonprofit_ein)

def get_favorites_redis(user_id):
    key = f'user:{user_id}:favorites'
    stored_favorites = r.smembers(key)

    if not stored_favorites:
        return []
    return stored_favorites

def unmark_favorited(user_id, nonprofit_ein: str):
    # temoves a non-profit from the user's redis favorites set
    key = f'user:{user_id}:favorites'
    r.srem(key, nonprofit_ein)

def get_orgs_by_tags_redis(tags: list[str]):
    """
    this is for the FIRST check on filtering, checking if redis cache has a enough orgs to
    satisfy the filter

    This function combines multiple tag sorted sets via ZINTERSTORE (basically AND logic)
    an org must match ALL given tags to be included in the filtered directory.

    This returns a list of EINs found in Redis for these tags. It returns an
    empty list if any tag has no cached data at all
    
    """

    tag_keys = [f"tag:{tag}" for tag in tags if r.exists(f"tag:{tag}")]

    if len(tag_keys) != len(tags):
        return []
    
    temp_key = f"directory_temp:{uuid.uuid4()}"
    r.zinterstore(temp_key, tag_keys)
    eins = r.zrevrange(temp_key, 0, -1)
    r.delete(temp_key)

    return eins