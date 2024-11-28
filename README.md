# Getting Started

## Secrets

First, you'll need to create a `secrets.py` file in `backend/app`. This file configures secret keys for use on the backend. That file should look like the following (before replacing the default values with your own secrets):

```
# For access to S3 compatible API
S3_ACCESS_KEY = "minioadmin"
S3_SECRET_KEY = "minioadmin"
S3_ENDPOINT_URL = "http://s3:9000"
S3_BUCKET_NAME = "agrippa-files"
S3_USE_SSL = False

# This can be anything - just for the auth tokens
AUTH_SECRET_KEY="bruh-bruh-bruh"

# For a MySQL backend database
DB_ENDPOINT = "mysql"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "rootpassword"
DB_NAME = "backend"
```

## S3 Bucket

You will need to add a s3 bucket corresponding to the s3 bucket in `secrets.py`. With the built-in `minio` service, you can go to `localhost:4000` and create the bucket in the interface.

## Usage

This repo is run using `docker-compose up` from the root directory. The MySQL database will automatically initialize.
