from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin

bp = Blueprint('info', __name__, url_prefix='/info')

DB_DICT = {
    0: 'id',
    1: 'author_name',
    2: 'name',
    3: 'short_desc',
    4: 'canonical',
    5: 'tags'
}

def make_dict(row):
    x = {}
    for i in range(len(row)):
        try:
            x[DB_DICT[i]] = row[i]
        except KeyError:
            continue
    return x

DEFAULT_LIMIT = 100
DEFAULT_OFFSET = 0

@bp.route('/manifest', methods=['GET'])
@cross_origin()
def manifest():

    # Accepts a limit and an offset
    limit = request.args.get('limit')
    offset = request.args.get('offset')
    username = request.args.get('username')

    try:
        limit = int(limit)
    except (ValueError, TypeError):
        limit = DEFAULT_LIMIT
    
    try:
        offset = int(offset)
    except (ValueError, TypeError):
        offset = DEFAULT_OFFSET

    # Translate column numnber into key
    db = get_db()
    manifest = None
    if username is None:
        manifest = db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, ROW_NUMBER() OVER (ORDER BY name) AS rn
                FROM models
                ORDER BY name
            )
            WHERE rn > ?
            LIMIT ?
            """, (offset, limit)).fetchall()
    else:
        manifest = db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, ROW_NUMBER() OVER (ORDER BY name) AS rn
                FROM models
                WHERE username=?
                ORDER BY name
            )
            WHERE rn > ?
            LIMIT ?
            """, (username, offset, limit)).fetchall()

    results = [make_dict(row) for row in manifest]
    data = json.dumps(results)

    return data

@bp.route('/model', methods=['GET'])
@cross_origin()
def model():
    model_id = request.args.get('id')
    if not model_id:
        return "A rollicking band of pirates we who tire of tossing on the sea"
    
    db = get_db()
    model_info = db.execute(
        "SELECT id, author_name, name, short_desc, canonical, tags FROM models WHERE id=?", (model_id,)
    ).fetchone()

    structured = make_dict(model_info)
    return json.dumps(structured)
