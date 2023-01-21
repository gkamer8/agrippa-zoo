from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin
from .auth import token_required
import boto3
from .secrets import AWS_ACCESS_KEY, AWS_SECRET_KEY
import random

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


@bp.route('/upload', methods=['POST'])
@cross_origin()
@token_required
def upload(current_user):

    model_name = request.form.get('model_name')
    author_name = request.form.get('author_name')
    short_desc = request.form.get('short_desc')
    tags = request.form.get('tags')
    canonical = request.form.get('canonical')
    
    if not model_name:
        return json.dumps({'response': 'failed', 'why': 'missing_model_name'})
    elif not author_name:
        return json.dumps({'response': 'failed', 'why': 'missing_author_name'})
    elif not short_desc:
        return json.dumps({'response': 'failed', 'why': 'missing_short_desc'})
    elif not tags:
        return json.dumps({'response': 'failed', 'why': 'missing_tags'})
    elif not canonical:
        return json.dumps({'response': 'failed', 'why': 'missing_canonical'})

    try:
        canonical = canonical == 'true'
    except ValueError:
        return json.dumps({'response': 'failed', 'why': 'canonical_invalid_type'})

    db = get_db()

    bucket_name = 'agrippa-files'

    session = boto3.Session(
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY
            ) 
    res = session.resource('s3')
    s3 = session.client('s3')
    result = s3.list_objects_v2(Bucket=bucket_name)
    # Get a list of all the directories in the bucket
    directories = [item['Key'] for item in result.get('Contents', []) if item['Size'] == 0]
    # Get a unique folder name
    new_name = ""
    allowed_alphabet = 'abcdefghizjlmnopqrstuvwxyz'
    for c in model_name:
        prospect = c
        if prospect == ' ':
            prospect = '-'
        prospect = prospect.lower()
        if prospect in allowed_alphabet:
            new_name += prospect
    if not new_name:
        new_name = str(int(random.random() * 100_000))  # give it a random number between 0 and 100,000
    
    i = 0
    saved_new_name = new_name + ""
    while new_name in directories:
        new_name = saved_new_name + str(i)
        i += 1

    for file in request.files:
        file_bytes = request.files[file].read()
        object = res.Object('agrippa-files', f'{new_name}/{request.files[file].filename}')
        result = object.put(Body=file_bytes)

    sql = """
    INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username)
    VALUES (?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
            );
    """

    # Now add to database
    db.execute(sql, (author_name, model_name, new_name, short_desc, canonical, tags, current_user))
    db.commit()

    return json.dumps({'response': 'succeeded'})
