# Getting Started

First I'd recommend creating a virtual environment inside `backend` using

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

NOTE: init-db is being reimplemented, don't do this now

Then you can initialize the database and run the backend using

```
python3 -m flask --app app init-db
flask run
```

You also need to place a file called `secrets.py` inside `backend/app` with the relevant secrets in order to download stuff from, inter alia, AWS. You'll need the file to look like this example:

```
# For access to S3
AWS_ACCESS_KEY="ASDFBRUHZXCVBN"
AWS_SECRET_KEY="b/RA1NYnasGAWGajksbdgAWBEoigw1263ebg"

# This can be anything - just for the auth tokens
AUTH_SECRET_KEY="bruh-bruh-bruh"

# For a MySQL backend database
DB_ENDPOINT="notarealendpoint.com"
DB_PORT=3306
DB_USER="admin"
DB_PASSWORD="notarealpassword"
DB_REGION="us-east-1"
DB_NAME="backend"

```

On the frontend, you can install the packages and then run the Webpack server using:

```
yarn install
yarn start
```

If this is giving you serious trouble, you can probably use `npm install` instead.
