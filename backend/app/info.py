from flask import Blueprint
from app.db import get_db
import json

bp = Blueprint('info', __name__, url_prefix='/info')

@bp.route('/manifest', methods=['GET'])
def register():

    db = get_db()

    manifest = db.execute(
        "SELECT * FROM models"
    ).fetchall()

    results = [tuple(row) for row in manifest]
    data = json.dumps(results)

    return data