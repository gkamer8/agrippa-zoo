DROP TABLE IF EXISTS models;

CREATE TABLE models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    name TEXT,
    short_desc TEXT
);

INSERT INTO models (author_name, name, short_desc)
VALUES ("Gordon Kamer", "Transformer", "A sequence to sequence model that operates on tokens in parallel");