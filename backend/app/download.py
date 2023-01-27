from statistics import mode
from flask import Blueprint, request, make_response
from app.db import get_db
import boto3
from flask_cors import cross_origin
from .secrets import AWS_ACCESS_KEY, AWS_SECRET_KEY
import json
import io
import zipfile


bp = Blueprint('download', __name__, url_prefix='/download')

BUCKET_NAME = 'agrippa-files'


# Returns list of file paths in folder with name passed as argument "path"
# Note: that is not a full HTTP response, so this should be used as a helper function
# exclude_prefix determines whether to include the s3 folder name or not
def get_folder_manifest_from_s3(path, exclude_prefix=False, allowed_extensions=None):


    if not path:
        return []

    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    # Retrieve a manifest (basically I think) of the contents of a folder
    result = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=path + "/")

    to_return = []

    # Iterate through the contents
    for content in result.get('Contents', []):
        spliddit = content['Key'].split("/")
        # Don't add the folder itself
        if len(spliddit) > 1 and spliddit[-1] == "":
            continue
        # If exclude prefix is true, excude it
        if exclude_prefix and len(spliddit) > 1:
            content['Key'] = content['Key'][content['Key'].index("/")+1:]
        # If there are only some allowed extensions, only allow them
        if allowed_extensions:
            good = False
            for ext in allowed_extensions:
                this_ext = content['Key'].split(".")[-1]
                if this_ext == ext:
                    good = True
                    break
            if not good:
                continue
        to_return.append(content['Key'])

    return to_return
    
# Takes the full path from the bucket to a file as well as whether it should be downloaded
# returns the proper response (i.e., an endpoint function calling this should end with return get_xml_from_s3(...))
def get_xml_from_s3(path, download):
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    # Retrieve the file
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=path)
    except:
        # Probably a no such key error
        return ""

    resp_bytes = response['Body'].read()
    resp_str = resp_bytes.decode("utf-8")

    to_return = make_response(resp_str)
    to_return.headers["Content-Type"] = "application/xml"

    if download:
        filename = path.split("/")[-1]  # NOTE: Assumes path is of form folder/filename.ext (as opposed to, say, 'filename.ext')
        to_return.headers["Content-Disposition"] = f"attachment; filename=\"{filename}\""

    return to_return

# Returns the bytes from an s3 object
# Takes path to the object and an s3 connection (i.e. s3 = boto3.client(...))
# Does not return a request - functions calling this should process the bytes and send its own request.
def get_file_bytes_from_s3(path, s3):
    # Retrieve the file
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=path)
    except:
        # Probably a no such key error
        return ""

    resp_bytes = response['Body'].read()

    return resp_bytes

# Takes path to the model folder, finds the readme, and returns it
# NOTE: this should probably be designed differently
# returns the proper response (i.e., an endpoint function calling this should end with return get_readme_from_s3(...))
def get_readme_from_s3(path):
    keys = get_folder_manifest_from_s3(path)
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
    response = s3.get_object(Bucket=BUCKET_NAME, Key=md_path)

    # Print the contents of the file
    resp_bytes = response['Body'].read()
    resp_str = resp_bytes.decode("utf-8")

    return resp_str


# Takes a model id 'id' and and parameter 'download' and returns the index markup file
# 'download' specifies whether the request should trigger the browser to download the file  
@bp.route('/markup', methods=['GET'])
@cross_origin()
def markup():

    model_id = request.args.get('id')
    if model_id is None:
        return "A rollicking band of pirates we who tire of tossing on the sea"

    download = request.args.get('download')
    try:
        download = int(download)
    except:
        download = False

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path, file_index FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "are trying our hands at burglary"
    
    path = desired[1] + "/" + desired[2]
    return get_xml_from_s3(path, download=download)


# Takes a model id and returns the README file from inside its folder 
@bp.route('/readme', methods=['GET'])
@cross_origin()
def readme():
    model_id = request.args.get('id')
    if model_id is None:
        return "A rollicking band of pirates we who tired of tossing on the sea"

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "are trying our hands at burglary"
    
    # desired[1] should be the s3_storage_path
    return get_readme_from_s3(desired[1])


# Takes a model ID and filename of file inside the folder (e.g., "decoder.agr") and returns the file
@bp.route('/file', methods=['POST'])
@cross_origin()
def get_file():
    model_id = request.form.get('id')
    filename = request.form.get('filename')
    if model_id is None:
        return "hush hush, I hear them on the mannor poaching"
    elif not filename:
        return "with stealthy steps the pirates are approaching"

    model_id = int(model_id)

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "they seek a penalty fifty fold"

    # This may cause problems... will probably need to sanitize in some way...
    path = desired[1] + "/" + filename

    return get_xml_from_s3(path, False)

# Takes a model ID and downloads the project into a zip file
# Also takes "download", which specifies whether the request is meant to trigger a browser download.
@bp.route('/project', methods=['GET'])
@cross_origin()
def get_project():
    model_id = request.args.get('id')
    if model_id is None:
        return "I am the very model of a modern major general"

    model_id = int(model_id)

    db = get_db()
    desired = db.execute(
        "SELECT id, s3_storage_path, name FROM models WHERE id=?", (model_id,)
    ).fetchone()

    if not desired:
        return "I've information vegetable animal and mineral"

    download = request.args.get('download')
    try:
        download = int(download)
    except:
        download = False

    mani = get_folder_manifest_from_s3(desired['s3_storage_path'])

    file_bytes = []
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
    for fname in mani:
        file_bytes.append(get_file_bytes_from_s3(fname, s3))

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, mode="w") as zip_file:
        for i, my_bytes in enumerate(file_bytes):
            zip_file.writestr(mani[i], my_bytes)
    zip_buffer.seek(0)
    resp_str = zip_buffer.read()

    to_return = make_response(resp_str)
    to_return.headers["Content-Type"] = "application/xml"

    if download:
        filename = desired['name'] + ".zip"
        to_return.headers["Content-Disposition"] = f"attachment; filename=\"{filename}\""

    return to_return
