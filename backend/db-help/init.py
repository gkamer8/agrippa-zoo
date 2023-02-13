import pymysql
from pymysql.constants import CLIENT
from cred import *

"""

Run this file to re-initialize the database with schema.sql

"""

conn =  pymysql.connect(host=ENDPOINT, user=USER, passwd=PASSWORD, port=PORT, database=DBNAME, client_flag=CLIENT.MULTI_STATEMENTS)

cur = conn.cursor()

"""
cur.execute("SHOW TABLES")
cur.execute("SELECT `username`, `password_hash` FROM users WHERE `username`=%s", ('gkamer',))
x = cur.fetchone()
print(x)

exit(0)
"""

# cur.execute("GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION")

sql = """SHOW DATABASES;"""
cur.execute(sql)
x = cur.fetchall()
print(x)

with open("schema.sql", "r") as f:
    cur.execute(f.read())
    conn.commit()