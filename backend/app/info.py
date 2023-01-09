from flask import Blueprint
from app.db import get_db
import json
from flask_cors import cross_origin

bp = Blueprint('info', __name__, url_prefix='/info')

@bp.route('/manifest', methods=['GET'])
@cross_origin()
def manifest():

    # Translate column numnber into key
    DB_DICT = {
        0: 'id',
        1: 'author_name',
        2: 'name',
        3: 'short_desc'
    }
    db = get_db()
    manifest = db.execute(
        "SELECT id, author_name, name, short_desc FROM models"
    ).fetchall()

    def make_dict(row):
        x = {}
        for i in range(len(row)):
            x[DB_DICT[i]] = row[i]
        return x

    results = [make_dict(row) for row in manifest]
    data = json.dumps(results)

    return data