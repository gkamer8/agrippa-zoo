from flask import Blueprint, request, make_response
from app.db import get_db
import boto3
from flask_cors import cross_origin
from .secrets import AWS_ACCESS_KEY, AWS_SECRET_KEY

bp = Blueprint('download', __name__, url_prefix='/download')


def get_folder_manifest_from_s3(path):

    if not path:
        return []

    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    # Retrieve a manifest (basically I think) of the contents of a folder
    # NOTE: bucket hardcoded as agrippa-files
    result = s3.list_objects_v2(Bucket='agrippa-files', Prefix=path)

    to_return = []

    # Iterate through the contents
    for content in result.get('Contents', []):
        to_return.append(content['Key'])

    return to_return


# Matching file extensions for markups
markup_extens = ['agr', 'xml']
def get_markup_from_s3(path, download=False):

    keys = get_folder_manifest_from_s3(path)
    # Find .agr or 
    markup_path = None
    for key in keys:
        splitted = key.split('/')[-1].split('.')[-1]
        if not splitted:
            continue
        if splitted in markup_extens:
            markup_path = key

    if not markup_path:
        return "A british tar is a soaring soul, as free as a mountain bird."

    # Create an S3 client
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    # Retrieve the file
    response = s3.get_object(Bucket='agrippa-files', Key=markup_path)

    # Print the contents of the file
    resp_bytes = response['Body'].read()
    resp_str = resp_bytes.decode("utf-8")

    to_return = make_response(resp_str)
    to_return.headers["Content-Type"] = "application/xml"
    if download:
        filename = markup_path.split("/")[-1] if "/" in markup_path else markup_path
        to_return.headers["Content-Disposition"] = f"attachment; filename=\"{filename}\""

    return to_return


def get_readme_from_s3(path):
    keys = get_folder_manifest_from_s3(path)
    # Find .agr or 
    md_path = None
    for key in keys:
        splitted = key.split('/')[-1]
        if not splitted:
            continue
        if splitted.lower() == "readme.md":
            md_path = key

    if not md_path:
        return ""

    # Create an S3 client
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    # Retrieve the file
    response = s3.get_object(Bucket='agrippa-files', Key=md_path)

    # Print the contents of the file
    resp_bytes = response['Body'].read()
    resp_str = resp_bytes.decode("utf-8")

    return resp_str


@bp.route('/markup', methods=['GET'])
@cross_origin()
def markup():

    model_id = request.args.get('id')
    if not model_id:
        return "A rollicking band of pirates we who tire of tossing on the sea"

    download = request.args.get('download')
    try:
        download = int(download)
    except:
        download = False

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "are trying our hands at burglary"
    
    # desired[1] should be the s3_storage_path
    return get_markup_from_s3(desired[1], download=download)


@bp.route('/readme', methods=['GET'])
@cross_origin()
def readme():

    model_id = request.args.get('id')
    if not model_id:
        return "A rollicking band of pirates we who tire of tossing on the sea"

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "are trying our hands at burglary"
    
    # desired[1] should be the s3_storage_path
    return get_readme_from_s3(desired[1])

