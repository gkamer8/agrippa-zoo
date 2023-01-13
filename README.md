# Getting Started

First I'd recommend creating a virtual environment inside `backend` using

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then you can initialize the database and run the backend using

```
python3 -m flask --app app init-db
flask run
```

You also need to place a file called `secrets.py` inside `backend/app` with the relevant secrets in order to download stuff from, inter alia, AWS.

On the frontend, you can install the packages and then run the Webpack server using:

```
yarn install
yarn start
```
