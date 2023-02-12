from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
from app.db import get_db
import json
from flask_cors import cross_origin
from functools import wraps
import jwt
import re

from .secrets import AUTH_SECRET_KEY
import datetime


MAX_USERNAME = 20
MIN_USERNAME = 4

bp = Blueprint('auth', __name__, url_prefix='/auth')

AUTH_EXP_HOURS = 24
AUTH_ALGO = "HS256"  # HMAC-SHA256

"""
The response pattern is as follows:

{
    "response": "succeeded" | "failed",
    (Optional) "why": message,
    ...other
}
"""

# Inspired by https://www.bacancytechnology.com/blog/flask-jwt-authentication
# functions that use this should be patterned like so:
#       ... routes, other decorators
#       @token_required
#       def my_cool_func(current_user):
#           pass   
def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
 
        if not token:
            return json.dumps({'response': 'failed', 'why': 'token_missing'})
        try:
            data = jwt.decode(token, AUTH_SECRET_KEY, algorithms=[AUTH_ALGO])
            db = get_db()
            match = db.execute(
                "SELECT username FROM users WHERE username=?", (data['username'],)
            ).fetchone()
            current_user = match[0]
        except:
            return json.dumps({'response': 'failed', 'why': 'token_invalid'})
 
        return f(current_user, *args, **kwargs)
   return decorator


@bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    username = request.form['username']
    password = request.form['password']

    # Translate column numnber into key
    db = get_db()
    match = db.execute(
        "SELECT username, password_hash FROM users WHERE username=?", (username,)
    ).fetchone()

    if not match:
        return json.dumps({'response': 'failed', 'why': 'no_user_exists'})

    if not check_password_hash(match['password_hash'], password):
        return json.dumps({'response': 'failed', 'why': 'wrong_password'})

    token = jwt.encode({'username' : match['username'], 'exp' : datetime.datetime.utcnow() + datetime.timedelta(hours=AUTH_EXP_HOURS)}, AUTH_SECRET_KEY, AUTH_ALGO)
    try:
        token = token.decode("utf-8")
    except AttributeError:
        pass
    return json.dumps({'response': 'succeeded', 'token': token})


def is_valid_username(username):
    valid_username = re.compile(r'^[a-zA-Z0-9_.-]+$')
    return valid_username.match(username) is not None

@bp.route('/register', methods=['POST'])
@cross_origin()
def register():

    username = request.form['username']
    password = request.form['password']
    conn = get_db()
    error = None

    if not username:
        error = json.dumps({'response': 'failed', 'why': 'username_missing'})
    elif not password:
        error = json.dumps({'response': 'failed', 'why': 'password_missing'})
    elif not is_valid_username(username):
        error = json.dumps({'response': 'failed', 'why': 'username_invalid'})
    elif len(username) > MAX_USERNAME or len(username) < MIN_USERNAME:
        error = json.dumps({'response': 'failed', 'why': 'username_invalid_length'})

    if error is None:
        try:
            db = conn.cursor()
            db.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            )
            conn.commit()
        except db.IntegrityError:
            error = json.dumps({'response': 'failed', 'why': 'username_taken'})
        else:
            return json.dumps({'response': 'succeeded'})

    return error


@bp.route('/check', methods=['POST', 'GET'])
@cross_origin()
@token_required
def check_login(username):
    return json.dumps({'response': 'succeeded'})
