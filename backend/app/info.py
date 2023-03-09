from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin
from .download import get_folder_manifest_from_s3
import datetime

bp = Blueprint('info', __name__, url_prefix='/info')

def make_dict(row):
    for k in row:
        if type(row[k]) == datetime.datetime:
            row[k] = row[k].strftime("%m/%d/%Y, %H:%M:%S")
    return row

DEFAULT_LIMIT = 100
DEFAULT_OFFSET = 0
MARKUP_EXTS = ["xml", "agr"]

@bp.route('/manifest', methods=['GET'])
@cross_origin()
def manifest():

    # Accepts a limit and an offset
    limit = request.args.get('limit')
    offset = request.args.get('offset')
    username = request.args.get('username')

    try:
        limit = int(limit)
    except (ValueError, TypeError):
        limit = DEFAULT_LIMIT
    
    try:
        offset = int(offset)
    except (ValueError, TypeError):
        offset = DEFAULT_OFFSET

    # Translate column numnber into key
    db = get_db().cursor()
    manifest = None

    db.execute("SET @row_number = 0")
    if username is None:
        db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, (@row_number := @row_number+1) AS rn
                FROM models
                ORDER BY name
            ) tmp
            WHERE rn > %s
            ORDER BY name
            LIMIT %s
            """, (offset, limit))
        manifest = db.fetchall()
    else:
        db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, (@row_number := @row_number+1) AS rn
                FROM models
                WHERE username = %s
                ORDER BY name
            ) tmp
            WHERE rn > %s
            ORDER BY name
            LIMIT %s
            """, (username, offset, limit))
        manifest = db.fetchall()

    results = [make_dict(row) for row in manifest]

    response = {'response': 'succeeded',
                'limit': limit,
                'offset': offset,
                'content': results}

    data = json.dumps(response)

    return data

"""

Takes required model id
Optionally set file_manifest=1 to get all of the file paths, returned as file_paths=[path1, ...] in dict
Same for markup_manifest, except only returns markup files
Note that the paths returned do not include the s3 folder

"""
@bp.route('/model', methods=['GET'])
@cross_origin()
def model():
    model_id = request.args.get('id')
    if not model_id:
        return "A rollicking band of pirates we who tire of tossing on the sea"
    
    model_id = int(model_id)
    db = get_db().cursor()
    db.execute(
        "SELECT * FROM models WHERE id=%s", (model_id,)
    )
    model_info = db.fetchone()

    if not model_info:
        return json.dumps({'response': 'failed', 'why': 'no_model_exists'})

    structured = make_dict(model_info)

    file_manifest = request.args.get('file_manifest')
    if file_manifest:
        try:
            file_manifest = int(file_manifest)
        except ValueError:
            file_manifest = file_manifest == 'true'
        if file_manifest:
            files = get_folder_manifest_from_s3(structured['s3_storage_path'], exclude_prefix=True)
            structured['file_paths'] = files

    markup_manifest = request.args.get('markup_manifest')
    if markup_manifest:
        try:
            markup_manifest = int(markup_manifest)
        except ValueError:
            markup_manifest = markup_manifest == 'true'
        if markup_manifest:
            try:
                files = get_folder_manifest_from_s3(structured['s3_storage_path'], exclude_prefix=True, allowed_extensions=MARKUP_EXTS)
            except:
                return json.dumps({'response': 'failed', 'why': 'get_folder_manifest_from_s3_failed'})
            structured['markup_paths'] = files
    return json.dumps(structured)
