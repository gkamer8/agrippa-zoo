/* Creates a table that can be used as a manifest of models stored on Agrippa */
/* Then creates a simple user table for login/register */

DROP TABLE IF EXISTS models;

CREATE TABLE models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    name TEXT,
    short_desc TEXT,
    s3_storage_path TEXT /* assuming we know bucket is agrippa-files */
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

/* Produce examples for the models table */

INSERT INTO models (author_name, name, s3_storage_path, short_desc)
VALUES ("Gordon Kamer", "Anthropic Toy Model", "anthropic", "A model used in Anthropic's toy model of superposition paper");

INSERT INTO models (author_name, name, s3_storage_path, short_desc)
VALUES ("Gordon Kamer", "Feed Forward Network (FFN)", "ffn", "A simple FFN with Relu activations");

INSERT INTO models (author_name, name, s3_storage_path, short_desc)
VALUES ("JL Ba, JR Kiros, GE Hinton", "Layer Norm", "layer-norm", "A layer normalization, as seen in Ba, Kiros, Hinton 2016");

INSERT INTO models (author_name, name, s3_storage_path, short_desc)
VALUES ("Gordon Kamer", "Transformer Decoder", "transformer-decoder", "A decoder-only transformer that accepts as input every constant used in the model.");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Ryan Linnihan", "ResNet-18", "Small convolutional image model with residual connections");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Ian Goodfellow", "Generative Adversarial Network", "A model that consists of two neural networks, a generator and a discriminator, that compete with each other to produce realistic data");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Geoff Hinton", "AlexNet", "Convolutional image model that won the 2012 ImageNet competition");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Yann LeCun", "LeNet", "Early convolutional image model that introduced the concept of using weight sharing to reduce the number of parameters");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Otto von Bismarck", "LSTM", "A type of recurrent neural network that can store and process long-term dependencies in sequential data");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Fei-Fei Li", "VGGNet", "A deep convolutional image model with a uniform architecture and high performance on a variety of image tasks");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Deng Cai", "SPPNet", "A convolutional image model that incorporates spatial pyramid pooling to handle input images of arbitrary size");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Xiaoou Tang", "R-CNN", "A model that uses a convolutional neural network to propose regions in an image and classify them into object classes");

INSERT INTO models (author_name, name, short_desc)
VALUES ("Jian Sun", "DenseNet", "A convolutional image model that connects each layer to every other layer in a feed-forward fashion");

/* And now for users */

/* Password correponds to 'bruh' */
INSERT INTO users (username, password_hash)
VALUES ("gkamer", "pbkdf2:sha256:260000$YWuw9E1P7aoLxJ8m$180b0de6ceb54a5b1e8ddf0a6a510cebfa2a5ffbbaaf518abfd435ed21f53da9");
