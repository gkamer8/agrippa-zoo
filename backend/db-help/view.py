import pymysql
from pymysql.constants import CLIENT
from cred import *

"""

This file just shows the layout of the backend database

"""

conn =  pymysql.connect(host=ENDPOINT, user=USER, passwd=PASSWORD, port=PORT, database=DBNAME, client_flag=CLIENT.MULTI_STATEMENTS)

cur = conn.cursor()

cur.execute("SHOW DATABASES")
dbs = cur.fetchall()

print("Active databases:")
print(dbs)

print()

cur.execute("USE backend")
cur.execute("SHOW TABLES")
tables = cur.fetchall()

print("Active tables:")
print(tables)

cur.execute("SELECT `id`, `name` FROM `models` ORDER BY `id`")
models = cur.fetchall()

print()
print("Models:")
print(models)

cur.execute("SELECT `id`, `username` FROM `users` ORDER BY `id`")
users = cur.fetchall()

print()
print("Users:")
print(users)
