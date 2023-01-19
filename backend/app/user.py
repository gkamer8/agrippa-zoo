from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin
from .auth import token_required

bp = Blueprint('user', __name__, url_prefix='/user')

@bp.route('/private', methods=['GET', 'POST'])
@cross_origin()
@token_required
def info(current_user):
    info = {
        'response': 'succeeded',
        'username': current_user
    }
    return json.dumps(info)
