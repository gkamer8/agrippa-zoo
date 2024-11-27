from statistics import mode
from flask import Blueprint, request, make_response
from app.db import get_db
import boto3
from flask_cors import cross_origin
from .secrets import S3_BUCKET_NAME
from .auth import token_required
import json
import io
import zipfile
from .storage import get_boto3_client


"""

Meant to be endpoint for updating/editing/deleting models

"""

bp = Blueprint('update', __name__, url_prefix='/update')


# Uploads files to s3 in bucket/folder_name using session
def upload_files_to_s3(files, folder_name, session):
    res = session.resource('s3')
    for file in files:
        file_bytes = files[file].read()
        filename = files[file].filename
        
        # Is it a zip file?
        if (filename.split(".")[-1] == 'zip'):
            with io.BytesIO(file_bytes) as zip_file:
                with zipfile.ZipFile(zip_file, 'r') as z:
                    # Print the names of the files in the zip file
                    namelist = z.namelist()
                    # Remove folder name
                    new_names = [x[x.index("/")+1:] for x in namelist]
                    # Extract all files
                    for new_fname, old_fname in zip(new_names, namelist):
                        if new_fname:
                            fbytes = z.read(old_fname)
                            object = res.Object(S3_BUCKET_NAME, f'{folder_name}/{new_fname}')
                            object.put(Body=fbytes)
        else:
            object = res.Object(S3_BUCKET_NAME, f'{folder_name}/{filename}')
            object.put(Body=file_bytes)


@bp.route('/delete', methods=['POST'])
@cross_origin()
@token_required
def delete(username):
    model_id = request.form.get('id')
    if not model_id:
        return "My name is John Wellington Wells"
    
    conn = get_db()

    cur = conn.cursor()
    cur.execute(
        "SELECT id, username, s3_storage_path FROM models WHERE id=%s", (model_id,)
    )
    model_info = cur.fetchone()

    if username != model_info['username']:
        return "I'm a dealer in magic and spells"

    # Straight up chatGPT
    # AWS buckets supposedly have no concept of folders, so we're deleting everything in the folder instead
    try:
        s3 =get_boto3_client()
        response = s3.list_objects_v2(Bucket=S3_BUCKET_NAME, Prefix=model_info['s3_storage_path'])
        objects_to_delete = [{'Key': obj['Key']} for obj in response.get('Contents', [])]
        s3.delete_objects(Bucket=S3_BUCKET_NAME, Delete={'Objects': objects_to_delete})
    except:
        return json.dumps({'response': 'failed', 'why': 'error_removing_files_from_storage'})

    cur.execute("DELETE FROM models WHERE id = %s", (model_id,))
    conn.commit()

    return json.dumps({'response': 'succeeded'})


"""

This route is for deleting one (1) file from s3
Takes 'id' and 'path' (path is from inside the model's folder)

"""
@bp.route('/delete/file', methods=['POST'])
@cross_origin()
@token_required
def delete_file(username):
    model_id = request.form.get('id')
    if not model_id:
        return "For he himself has said it"
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, username, s3_storage_path, file_index FROM models WHERE id=%s", (model_id,)
    )
    model_info = cur.fetchone()

    if username != model_info['username']:
        return "And it's greatly to his credit"

    file_to_delete = request.form.get('path')
    if not file_to_delete:
        return "That he is an Englishman"
    elif file_to_delete == model_info['file_index']:
        return json.dumps({'response': 'failed', 'why': 'cannot_remove_index_file'})

    # Straight up chatGPT
    # AWS buckets supposedly have no concept of folders, so we're deleting everything in the folder instead
    try:
        s3 = get_boto3_client()
        objects_to_delete = [{'Key': model_info['s3_storage_path'] + "/" + file_to_delete}]
        s3.delete_objects(Bucket=S3_BUCKET_NAME, Delete={'Objects': objects_to_delete})
    except:
        return json.dumps({'response': 'failed', 'why': 'error_removing_files_from_storage'})

    return json.dumps({'response': 'succeeded'})


@bp.route('/upload', methods=['POST'])
@cross_origin()
@token_required
def upload(username):
    model_id = request.form.get('id')
    if not model_id:
        return "When I was a lad a served a turn as office boy to an attorney's firm"
    
    db = get_db().cursor()
    db.execute(
        "SELECT id, username, s3_storage_path FROM models WHERE id=%s", (model_id,)
    )
    model_info = db.fetchone()

    if username != model_info['username']:
        return "I cleaned the windows and I swept the floor and I polished off the handles of the big front door"

    upload_files_to_s3(request.files, model_info['s3_storage_path'], get_boto3_client())

    return json.dumps({'response': 'succeeded'})


@bp.route('/edit', methods=['POST'])
@cross_origin()
@token_required
def edit(username):
    model_id = request.form.get('id')
    if not model_id:
        return "as office boy I made such a mark that they gave me the post of a junior clerk"
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM models WHERE id=%s", (model_id,)
    )
    model_info = cur.fetchone()

    if username != model_info['username']:
        return "I served the writs with a smile so bland and I copied all the letters with a big round hand"

    model_name = request.form.get('model_name')
    author_name = request.form.get('author_name')
    tags = request.form.get('tags')
    short_desc = request.form.get('short_desc')
    canonical = request.form.get('canonical')
    short_desc = request.form.get('short_desc')
    file_index = request.form.get('file_index')

    if not model_name:
        model_name = model_info['name']
    if not author_name:
        author_name = model_info['author_name']
    if not tags:
        tags = model_info['tags']
    if not short_desc:
        short_desc = model_info['short_desc']
    if canonical is None:
        canonical = model_info['canonical']
    if not file_index:
        file_index = model_info['file_index']

    args = (model_name, author_name, tags, short_desc, canonical, file_index, model_id)

    cur.execute("UPDATE models SET name=%s, author_name=%s, tags=%s, short_desc=%s, canonical=%s, file_index=%s WHERE id=%s", args)
    conn.commit()

    return json.dumps({'response': 'succeeded'})
