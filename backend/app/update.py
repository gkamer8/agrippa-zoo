from statistics import mode
from flask import Blueprint, request, make_response
from app.db import get_db
import boto3
from flask_cors import cross_origin
from .secrets import AWS_ACCESS_KEY, AWS_SECRET_KEY
from .auth import token_required
import json

"""

Meant to be endpoint for updating/editing/deleting models

"""

bp = Blueprint('update', __name__, url_prefix='/update')

BUCKET_NAME = 'agrippa-files'


# Uploads files to s3 in bucket/folder_name using session
def upload_files_to_s3(files, folder_name, session):
    res = session.resource('s3')
    for file in files:
        file_bytes = request.files[file].read()
        object = res.Object(BUCKET_NAME, f'{folder_name}/{request.files[file].filename}')
        object.put(Body=file_bytes)


def get_s3_session():
    session = boto3.Session(
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY
            )
    return session

@bp.route('/delete', methods=['POST'])
@cross_origin()
@token_required
def delete(username):
    model_id = request.form.get('id')
    if not model_id:
        return "My name is John Wellington Wells"
    
    db = get_db()
    model_info = db.execute(
        "SELECT id, username, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if username != model_info['username']:
        return "I'm a dealer in magic and spells"

    # Straight up chatGPT
    # AWS buckets supposedly have no concept of folders, so we're deleting everything in the folder instead
    try:
        s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=model_info['s3_storage_path'])
        objects_to_delete = [{'Key': obj['Key']} for obj in response.get('Contents', [])]
        s3.delete_objects(Bucket=BUCKET_NAME, Delete={'Objects': objects_to_delete})
    except:
        return json.dumps({'response': 'failed', 'why': 'error_removing_files_from_storage'})

    db.execute("DELETE FROM models WHERE id = ?", (model_id,))
    db.commit()

    return json.dumps({'response': 'succeeded'})


@bp.route('/upload', methods=['POST'])
@cross_origin()
@token_required
def upload(username):
    model_id = request.form.get('id')
    if not model_id:
        return "When I was a lad a served a turn as office boy to an attorney's firm"
    
    db = get_db()
    model_info = db.execute(
        "SELECT id, username, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if username != model_info['username']:
        return "I cleaned the windows in a smile so bland and I copied all the letters in a big round hand"

    upload_files_to_s3(request.files, model_info['s3_storage_path'], get_s3_session())

    return json.dumps({'response': 'succeeded'})
