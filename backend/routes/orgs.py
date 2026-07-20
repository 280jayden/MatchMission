from flask import Blueprint, request, jsonify, session
from extensions import engine
from services.fetch_orgs import fetch_orgs, fetch_org, fetch_propublica_data, query_nonprofits_db_by_tags, normalize_tags
from services.redis_cache import (
    get_user_weights, is_cached, cache_tags, load_nonprofits_json,
    get_next_batch, mark_shown, mark_favorited, unmark_favorited,
    get_favorites_redis, get_nonprofits, get_random_nonprofits, get_orgs_by_tags_redis
)

orgs_bp = Blueprint('orgs', __name__)

@orgs_bp.route('/api/refresh_orgs', methods=['GET']) # gets the orgs needed
# get bc react is asking for the org data
def get_orgs():

    user_id = session.get('user_id')
    if not user_id:
      return jsonify({"error": "Not logged in"}), 401
    
    user_tags, user_wts = get_user_weights(user_id)

    tags_to_fetch = [tag for tag in user_tags if not is_cached(tag)]
    # TODO: figure out how to see if there are enough not shown nonprofits in cache, if not fetch more
    
    if tags_to_fetch:
        nonprofits_dict_list = []
        for tag in tags_to_fetch:
            # fetches orgs (max 100) for each tag
            np_eins, nonprofits_info = fetch_orgs(user_tags, tag, 100, engine) 
            cache_tags(tag, np_eins) # redis caches the ein list for each tag
            nonprofits_dict_list.extend(nonprofits_info)
        
        # loads nonprofits into redis main cache
        load_nonprofits_json(nonprofits_dict_list)

    
    next_batch = get_next_batch(user_id, user_wts, 10)

    return jsonify(next_batch)
    # sends to react as json

@orgs_bp.route('/api/org/<ein>', methods=['GET'])
def get_org(ein):
  """
  Gets one org by the ein for expanded card view
  """
  
  np_data = fetch_org(ein)
  np_data['propublica'] = fetch_propublica_data(ein)

  return np_data

@orgs_bp.route('/api/score_orgs', methods=['POST'])
def score_orgs():
    # preps user nonprofit recs
    # checks saved user weights, fetches any missing tag
    # builds nonprofit list in redis

    user_id = session.get('user_id')
    if not user_id:
      return jsonify({"error": "Not logged in"}), 401

    user_tags, user_wts = get_user_weights(user_id)

    if not user_wts:
        return jsonify({
            "success": False,
            "error": "No user weights found. submit quiz first."
        }), 400

    tags_to_fetch = [tag for tag in user_tags if not is_cached(tag)]
    fetched_tags = []

    for tag in tags_to_fetch:
        np_eins, nonprofits_info = fetch_orgs(user_wts, tag, 100, engine)
        cache_tags(tag, np_eins)
        load_nonprofits_json(nonprofits_info)
        fetched_tags.append(tag)

    # rank nonprofits using the user's weights and the cached tag sets
    # it also removes orgs already marked as shown
    scored_batch = get_next_batch(user_id, user_wts, 100)

    # return metadata about the scoring step
    # the frontend might not render this directly
    # it can call /api/get_batch afterward to get full nonprofit cards
    return jsonify({
        "success": True, 
        "tags": user_tags,
        "fetchedTags": fetched_tags,
        "scoredCount": len(scored_batch)
    })

@orgs_bp.route('/api/get_batch', methods=['GET'])
def get_batch():
    # returns the next batch of nonprofit cards for the frontend
    # this assumes score_orgs has already prepped/cached the orgs
    user_id = session.get('user_id')
    if not user_id:
      return jsonify({"error": "Not logged in"}), 401

    batch_size = int(request.args.get('limit', 20))
    user_tags, user_wts = get_user_weights(user_id)

    # if not wts exist, the user may not have submitted
    if not user_wts:
        return jsonify({
            'success': False,
            'error': 'No user weights found. submit quiz first.'
        }), 400
    
    nonprofits = get_next_batch(user_id, user_wts, batch_size)

    # pull out the ein for each nonprofit in the returned batch
    nonprofit_eins = [
        nonprofit.get('ein')
        for nonprofit in nonprofits
        if nonprofit.get('ein')
    ]

    # mark these nonprofits as shown so they do not keep appearing in future batches
    if nonprofit_eins:
        mark_shown(user_id, nonprofit_eins)
    
    # send the frontend a consistent response shape
    # result.jsx can read data.nonprofits from this
    return jsonify({
        'success': True,
        'nonprofits': nonprofits
    })

@orgs_bp.route('/api/favorite', methods=['POST'])
def favorite_org():
    # get the json body
    data = request.get_json() or {}
    np_ein = data['ein']
    user_id = session.get('user_id', None)

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    # add np_ein to favorited set in redis
    mark_favorited(user_id, np_ein)

    return jsonify({"success": True})

@orgs_bp.route('/api/unfavorite', methods=['POST']) 
def unfavorite_org():
    # get the json body
    data = request.get_json() or {}
    np_ein = data['ein']
    user_id = session.get('user_id', None)

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    # remove np_ein from favorited set in redis
    unmark_favorited(user_id, np_ein)

    return jsonify({"success": True})

@orgs_bp.route('/api/favorites', methods=['GET'])
def get_favorites():
    user_id = session.get('user_id', None)

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user_favorites = get_favorites_redis(user_id)

    favorites_np_data = get_nonprofits(user_favorites)

    return jsonify({"success": True, "favorites": favorites_np_data})
    # returns a plain array of org objects

@orgs_bp.route('/api/orgs/directory', methods=['GET', 'POST'])
def get_directory():
    """
    GET: Returns a list of random nonprofits for the directory.
    POST: Returns nonprofits matching ALL given filter tags
    checking Redis -> Postgres
    """

    if request.method == 'GET':
    # get 20 cached nonprofits
        nonprofits = get_random_nonprofits(20)

        return jsonify({"success": True, "directory": nonprofits})
    
    # POST for filtering
    TARGET_COUNT = 20

    data = request.get_json() or {}
    filters = data.get("filters", [])

    if not filters:
        nonprofits = get_random_nonprofits(TARGET_COUNT)
        return jsonify({"success": True, "directory": nonprofits})
    
    already_seen = data.get('exclude_eins', [])
    seen_eins = set(already_seen) # <-- given from frontend maybe?
    combined_orgs = []

    # first check -> Redis
    redis_eins = get_orgs_by_tags_redis(filters)
    if redis_eins:
        redis_orgs = get_nonprofits(redis_eins)
        for org in redis_orgs:
            ein = org.get('ein')
            if ein and ein not in seen_eins:
                seen_eins.add(ein)
                combined_orgs.append(org)
    

    # second check -> postgres, only gets here if we're still short
    if len(combined_orgs) < TARGET_COUNT:
        needed = TARGET_COUNT - len(combined_orgs)
        db_orgs = query_nonprofits_db_by_tags(engine, filters, list(seen_eins), needed)
        for org in db_orgs:
            ein = org.get('ein')
            if ein and ein not in seen_eins:
                    seen_eins.add(ein)
                    combined_orgs.append(org)
    
    # third check -> fetch every.org
    formatted = [{
        'ein': org.get('ein'),
        'name': org.get('name'),
        'description': org.get('description'),
        'logoUrl': org.get('logoUrl'),
        'websiteUrl': org.get('websiteUrl'),
        'profileUrl': org.get('profileUrl'),
        'location': org.get('location'),
        'primarySlug': org.get('slug'),
        'slug': org.get('slug'),
        'tags': normalize_tags(org.get('tags')),
        "match_explanation": "" # not needed for directory
    } for org in combined_orgs[:TARGET_COUNT]]

    return jsonify({"success": True, "directory": formatted})
    