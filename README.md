# Getting Started

First I'd recommend creating a virtual environment inside `backend` using

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

The `db-help` directory contains some tools for working with the SQL database.

It requires a file `cred.py` (which you will need to create) that has the credentials for the SQL server you want to deal with. Note: these can be different from the database credentials held in `secrets.py`, but they might be the same.

```
DB_ENDPOINT="notarealendpoint.com"
DB_PORT=3306
DB_USER="admin"
DB_PASSWORD="notarealpassword"
DB_NAME="backend"
```

**You don't need to do this, but if you want it later,** the `init.py` file re-initializes the database using `schema.sql`:

```
python init.py
```

You also need to place a file called `secrets.py` inside `backend/app` with the relevant secrets in order to download stuff from, inter alia, AWS. You'll need the file to look like this example:

```
# For access to S3
S3_ACCESS_KEY = "ASDFBRUHZXCVBN"
S3_SECRET_KEY = "b/RA1NYnasGAWGajksbdgAWBEoigw1263ebg"
S3_ENDPOINT_URL = None  # Can switch to use s3 compatible API vs. AWS
S3_BUCKET_NAME = "agrippa-files"

# This can be anything - just for the auth tokens
AUTH_SECRET_KEY="bruh-bruh-bruh"

# For a MySQL backend database
DB_ENDPOINT="notarealendpoint.com"
DB_PORT=3306
DB_USER="admin"
DB_PASSWORD="notarealpassword"
DB_NAME="backend"

```

You can run the backend with:

```
flask run
```

On the frontend, you can install the packages and then run the Webpack server using:

```
yarn install
yarn start
```

If this is giving you serious trouble, you can probably use `npm install` instead.
