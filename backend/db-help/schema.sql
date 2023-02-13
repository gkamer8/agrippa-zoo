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
    time_uploaded DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    time_created DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Produce examples for the models table */

INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("Gordon Kamer",
        "Anthropic Toy Model",
        "anthropic",
        "A model used in Anthropic's toy model of superposition paper",
        0,
        '{}',
        'gkamer',
        'anthropic.agr'
        );

INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("Ryan Linnihan",
        "Feed Forward Network (FFN)",
        "ffn",
        "A simple FFN with Relu activations",
        1,
        '{"input": ["vector"], "output": ["vector"]}',
        'rylinni',
        'ffn.agr'
        );

INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("Jared Simpson",
        "Layer Norm",
        "layer-norm",
        "A layer normalization, as seen in Ba, Kiros, Hinton 2016",
        1,
        '{"input": ["matrix", "activations"], "output": ["matrix", "activations"]}',
        'jsimp',
        'layernorm.agr'
        );

INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("Gordon Kamer",
        "Transformer Decoder",
        "transformer-decoder",
        "A decoder-only transformer that accepts as input every constant used in the model.",
        0,
        '{"input": ["text", "tokens"], "output": ["distribution"]}',
        'gkamer',
        'decoder.agr'
        );


INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("Gordon Kamer",
        "Transformer",
        "transformer",
        "The original transformer as seen in Vaswani et al.",
        1,
        '{"input": ["text", "tokens"], "output": ["distribution"]}',
        'gkamer',
        'transformer.agr'
        );

INSERT INTO models (author_name, name, s3_storage_path, short_desc, canonical, tags, username, file_index)
VALUES ("John Wellington Wells",
        "Dealer in Magic and Spells",
        "anthropic",
        "This should actually just be the anthropic project",
        0,
        '{}',
        'gkamer',
        'anthropic.agr'
        );

/* And now for users */

/* Password correponds to 'bruh' */
INSERT INTO users (username, password_hash)
VALUES ("gkamer", "pbkdf2:sha256:260000$YWuw9E1P7aoLxJ8m$180b0de6ceb54a5b1e8ddf0a6a510cebfa2a5ffbbaaf518abfd435ed21f53da9");

INSERT INTO users (username, password_hash)
VALUES ("rylinni", "pbkdf2:sha256:260000$YWuw9E1P7aoLxJ8m$180b0de6ceb54a5b1e8ddf0a6a510cebfa2a5ffbbaaf518abfd435ed21f53da9");

INSERT INTO users (username, password_hash)
VALUES ("jsimp", "pbkdf2:sha256:260000$YWuw9E1P7aoLxJ8m$180b0de6ceb54a5b1e8ddf0a6a510cebfa2a5ffbbaaf518abfd435ed21f53da9");
