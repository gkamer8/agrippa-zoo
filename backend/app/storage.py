from .secrets import S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT_URL, S3_USE_SSL
import boto3
from botocore.client import Config


def get_boto3_client():
    s3 = boto3.client('s3', endpoint_url=S3_ENDPOINT_URL, aws_access_key_id=S3_ACCESS_KEY, aws_secret_access_key=S3_SECRET_KEY, use_ssl=S3_USE_SSL, config=Config(signature_version='s3v4'))
    return s3
