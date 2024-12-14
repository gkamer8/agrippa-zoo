DROP DATABASE IF EXISTS backend;

CREATE DATABASE backend;

USE backend;

DROP TABLE IF EXISTS models;

CREATE TABLE models (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_name VARCHAR(255),
    name VARCHAR(255),
    short_desc TEXT,
    canonical INT,  /* Really treat like boolean */
    tags TEXT,  /* A dictionary of tags like {"input": ["text", "tokens"], "output": ["distribution"], ...} */
    s3_storage_path TEXT,  /* assuming we know bucket is agrippa-files */
    username TEXT,
    file_index TEXT,  /* The index .agr file */
    time_uploaded DATETIME  /* Not using default timestamp to support < MySQL 5.6 */
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    time_created DATETIME DEFAULT CURRENT_TIMESTAMP
);
