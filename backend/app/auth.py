from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
from app.db import get_db
import json
from flask_cors import cross_origin
from functools import wraps
import jwt

from .secrets import AUTH_SECRET_KEY
import datetime


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

    print("herasdfe")

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

    return json.dumps({'response': 'succeeded', 'token': token})


@bp.route('/register', methods=['POST'])
@cross_origin()
def register():

    username = request.form['username']
    password = request.form['password']
    db = get_db()
    error = None

    if not username:
        error = json.dumps({'response': 'failed', 'why': 'username_missing'})
    elif not password:
        error = json.dumps({'response': 'failed', 'why': 'password_missing'})

    if error is None:
        try:
            db.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                (username, generate_password_hash(password)),
            )
            db.commit()
        except db.IntegrityError:
            print("really?")
            error = json.dumps({'response': 'failed', 'why': 'username_taken'})
        else:
            return json.dumps({'response': 'succeeded'})

    return error
