from flask import Blueprint

from app.db import get_db

bp = Blueprint('info', __name__, url_prefix='/info')

@bp.route('/manifest', methods=['GET'])
def register():

    db = get_db()

    manifest = db.execute(
        "SELECT * FROM models"
    )
    print(manifest)
    
    return str(manifest)