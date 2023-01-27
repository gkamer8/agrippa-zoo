from flask import Blueprint, request
from app.db import get_db
import json
from flask_cors import cross_origin
from .download import get_folder_manifest_from_s3

bp = Blueprint('info', __name__, url_prefix='/info')

def make_dict(row):
    return dict(row)

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
    db = get_db()
    manifest = None
    if username is None:
        manifest = db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, ROW_NUMBER() OVER (ORDER BY name) AS rn
                FROM models
                ORDER BY name
            )
            WHERE rn > ?
            LIMIT ?
            """, (offset, limit)).fetchall()
    else:
        manifest = db.execute("""
            SELECT *
            FROM
            (
                SELECT id, author_name, name, short_desc, canonical, tags, ROW_NUMBER() OVER (ORDER BY name) AS rn
                FROM models
                WHERE username=?
                ORDER BY name
            )
            WHERE rn > ?
            LIMIT ?
            """, (username, offset, limit)).fetchall()

    results = [make_dict(row) for row in manifest]
    data = json.dumps(results)

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
    
    db = get_db()
    model_info = db.execute(
        "SELECT * FROM models WHERE id=?", (model_id,)
    ).fetchone()

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
            files = get_folder_manifest_from_s3(structured['s3_storage_path'], exclude_prefix=True, allowed_extensions=MARKUP_EXTS)
            structured['markup_paths'] = files
    return json.dumps(structured)
