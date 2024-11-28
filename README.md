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

There are two profiles: `dev` and `prod`. This repo is run using `docker-compose --profile dev up` or `docker-compose --profile prod up` from the root directory. The MySQL database will automatically initialize the first time.

# Using Backup Data

## S3

In order to bring in data from an existing AWS bucket, use:

```
aws s3 sync s3://agrippa-files your-local-folder
```

assuming that the s3 bucket is called `agrippa-files`. You of course must have the AWS CLI, and uou may need to use `aws configure` to set relevant credentials and set the default availability zone (wherever the bucket is stored). Once it's downloaded, you can go to the minio console, create a bucket, go to "browse files" and drag and drop the interior folders.

## MySQL

For the MySQL data, you can use the `mysqldump` utility or another mysql client like DBeaver to first download the MySQL database as a .sql file. Then you can connect to the database (like via `docker-compose exec`) and run the backup file.
