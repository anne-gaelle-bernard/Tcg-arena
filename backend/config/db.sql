
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE player (
    player_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    mail VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    level INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,
    date TIMESTAMP,
    score INT,
    reward INT,
    player_id INT,
    FOREIGN KEY (player_id) REFERENCES player(player_id)
);

CREATE TABLE store (
    store_id SERIAL PRIMARY KEY,
    history TEXT,
    player_id INT,
    FOREIGN KEY (player_id) REFERENCES player(player_id)
);

CREATE TABLE booster (
    booster_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    image TEXT,
    rarity VARCHAR(50),
    release_date DATE
);

CREATE TABLE collection (
    collection_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    image TEXT,
    description TEXT,
    release_date DATE
);

CREATE TABLE cardrole (
    cardrole_id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE card (
    card_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attack INT,
    def INT,
    proba FLOAT,
    cardrole_id INT,
    collection_id INT,
    FOREIGN KEY (cardrole_id) REFERENCES cardrole(cardrole_id),
    FOREIGN KEY (collection_id) REFERENCES collection(collection_id)
);

CREATE TABLE deck (
    deck_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE player_card (
    player_id INT,
    card_id INT,
    PRIMARY KEY (player_id, card_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id),
    FOREIGN KEY (card_id) REFERENCES card(card_id)
);

CREATE TABLE deck_card (
    deck_id INT,
    card_id INT,
    PRIMARY KEY (deck_id, card_id),
    FOREIGN KEY (deck_id) REFERENCES deck(deck_id),
    FOREIGN KEY (card_id) REFERENCES card(card_id)
);

CREATE TABLE booster_card (
    booster_id INT,
    card_id INT,
    PRIMARY KEY (booster_id, card_id),
    FOREIGN KEY (booster_id) REFERENCES booster(booster_id),
    FOREIGN KEY (card_id) REFERENCES card(card_id)
);

ALTER TABLE booster
ADD COLUMN collection_id INT,
ADD FOREIGN KEY (collection_id) REFERENCES collection(collection_id);