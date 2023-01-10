from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin

bp = Blueprint('info', __name__, url_prefix='/info')

DB_DICT = {
    0: 'id',
    1: 'author_name',
    2: 'name',
    3: 'short_desc'
}

def make_dict(row):
    x = {}
    for i in range(len(row)):
        x[DB_DICT[i]] = row[i]
    return x

@bp.route('/manifest', methods=['GET'])
@cross_origin()
def manifest():

    # Translate column numnber into key
    db = get_db()
    manifest = db.execute(
        "SELECT id, author_name, name, short_desc FROM models"
    ).fetchall()

    results = [make_dict(row) for row in manifest]
    data = json.dumps(results)

    return data

@bp.route('/model', methods=['GET'])
@cross_origin()
def model():
    model_id = request.args.get('id')
    if not model_id:
        return "A rollicking band of pirates we who tire of tossing on the sea"
    
    print(model_id)
    db = get_db()
    model_info = db.execute(
        "SELECT id, author_name, name, short_desc FROM models WHERE id=?", (model_id,)
    ).fetchone()

    structured = make_dict(model_info)
    return json.dumps(structured)
