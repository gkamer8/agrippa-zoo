import pymysql
from pymysql.constants import CLIENT
from cred import *

"""

Run this file to re-initialize the database with schema.sql

"""

conn =  pymysql.connect(host=ENDPOINT, user=USER, passwd=PASSWORD, port=PORT, database=DBNAME, client_flag=CLIENT.MULTI_STATEMENTS)

cur = conn.cursor()

with open("schema.sql", "r") as f:
    cur.execute(f.read())
    conn.commit()