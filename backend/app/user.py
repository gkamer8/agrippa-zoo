from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin
from .update import upload_files_to_s3, BUCKET_NAME, get_s3_session
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
    file_index = request.form.get('file_index')
    
    if not model_name:
        return json.dumps({'response': 'failed', 'why': 'missing_model_name'})
    elif not author_name:
        return json.dumps({'response': 'failed', 'why': 'missing_author_name'})
    elif not short_desc:
        return json.dumps({'response': 'failed', 'why': 'missing_short_desc'})
    elif not tags:
        return json.dumps({'response': 'failed', 'why': 'missing_tags'})
    elif canonical is None:
        return json.dumps({'response': 'failed', 'why': 'missing_canonical'})
    elif not file_index:
        return json.dumps({'response': 'failed', 'why': 'missing_file_index'})

    try:
        canonical = canonical == 'true'
    except ValueError:
        return json.dumps({'response': 'failed', 'why': 'canonical_invalid_type'})

    db = get_db()

    session = get_s3_session()
    s3 = session.client('s3')
    result = s3.list_objects_v2(Bucket=BUCKET_NAME)
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

    upload_files_to_s3(request.files, new_name, session)  # this should correctly deal with zip files

    sql = """
    INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
    VALUES (?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
            );
    """

    # Now add to database
    db.execute(sql, (author_name, model_name, new_name, short_desc, canonical, tags, current_user, file_index))
    db.commit()

    return json.dumps({'response': 'succeeded'})
