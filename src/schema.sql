CREATE DATABASE IF NOT EXISTS uberuber;

USE uberuber;

DROP TABLE IF EXISTS delivery_line, cart_line, delivery, driver, client;

CREATE TABLE IF NOT EXISTS client(
    id_client VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(50),
    birthdate DATE,
    is_alive BOOLEAN,
    allow_criminal_record BOOLEAN,
    wants_extra_napkins BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_client)
);

CREATE TABLE IF NOT EXISTS driver(
    id_driver VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(50),
    price DECIMAL(5,2),
    has_criminal_record BOOLEAN,
    has_driving_licence BOOLEAN,
    days_since_last_accident INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_driver)
);

CREATE TABLE IF NOT EXISTS delivery(
    id_delivery VARCHAR(50),
    delivery_date VARCHAR(50),
    total_price DECIMAL(5,2),
    state VARCHAR(50),
    id_client VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_delivery),
    FOREIGN KEY(id_client) REFERENCES client(id_client)
);

CREATE TABLE IF NOT EXISTS cart_line(
    id_client VARCHAR(50),
    id_driver VARCHAR(50),
    PRIMARY KEY(id_client, id_driver),
    FOREIGN KEY(id_client) REFERENCES client(id_client),
    FOREIGN KEY(id_driver) REFERENCES driver(id_driver)
);

CREATE TABLE IF NOT EXISTS delivery_line(
    id_driver VARCHAR(50),
    id_delivery VARCHAR(50),
    PRIMARY KEY(id_driver, id_delivery),
    FOREIGN KEY(id_driver) REFERENCES driver(id_driver),
    FOREIGN KEY(id_delivery) REFERENCES delivery(id_delivery)
);

-- Insertion des clients
INSERT INTO client (id_client, firstname, lastname, email, birthdate, is_alive, allow_criminal_record, wants_extra_napkins) VALUES
    ('CLI001', 'Jean-Michel', 'Prudent', 'jm.prudent@mail.com', '1980-05-15', true, false, true),
    ('CLI002', 'Marie', 'Aventurière', 'marie.risk@mail.com', '1995-12-03', true, true, false),
    ('CLI003', 'Philippe', 'Parano', 'phil.safe@mail.com', '1975-08-22', true, false, true),
    ('CLI004', 'Sophie', 'Téméraire', 'sophie.brave@mail.com', '1992-03-30', true, true, false),
    ('CLI005', 'Lucas', 'Indécis', 'lucas.maybe@mail.com', '1988-11-11', true, true, true);

-- Insertion des chauffeurs
INSERT INTO driver (id_driver, firstname, lastname, email, price, has_criminal_record, has_driving_licence, days_since_last_accident, description) VALUES
    ('DRV001', 'Pierre', 'Vitesse', 'pierre.speed@mail.com', 49.99, false, true, 365, 'Ancien pilote de F1, reconverti par nécessité'),
    ('DRV002', 'Jacques', 'Danger', 'jacques.danger@mail.com', 29.99, true, false, 3, 'A vu tous les Fast & Furious 17 fois'),
    ('DRV003', 'Martine', 'Prudence', 'martine.safe@mail.com', 39.99, false, true, 1825, 'N''a jamais dépassé les 50 km/h'),
    ('DRV004', 'Robert', 'Mystère', 'robert.mystery@mail.com', 45.99, true, true, 42, 'Personne ne sait où il a eu son permis'),
    ('DRV005', 'Lucie', 'Flash', 'lucie.flash@mail.com', 35.99, false, true, 730, 'Ancienne livreuse de pizza, spécialiste du timing');

-- Insertion des livraisons (deliveries)
INSERT INTO delivery (id_delivery, delivery_date, total_price, state, id_client) VALUES
    ('DEL001', '2024-01-15', 49.99, 'Complété', 'CLI001'),
    ('DEL002', '2024-01-16', 89.98, 'En cours de validation', 'CLI002'),
    ('DEL003', '2024-01-17', 35.99, 'Annulé', 'CLI003'),
    ('DEL004', '2024-01-18', 75.98, 'Accidenté', 'CLI004'),
    ('DEL005', '2024-01-19', 129.97, 'Arrêté par la police', 'CLI005');

-- Insertion des lignes de panier (cart_line)
INSERT INTO cart_line (id_client, id_driver) VALUES
    ('CLI001', 'DRV001'),
    ('CLI001', 'DRV003'),
    ('CLI002', 'DRV002'),
    ('CLI003', 'DRV004'),
    ('CLI004', 'DRV005'),
    ('CLI005', 'DRV001'),
    ('CLI005', 'DRV003'),
    ('CLI005', 'DRV005');

-- Insertion des lignes de livraison (delivery_line)
INSERT INTO delivery_line (id_driver, id_delivery) VALUES
    ('DRV001', 'DEL001'),
    ('DRV002', 'DEL002'),
    ('DRV003', 'DEL002'),
    ('DRV004', 'DEL003'),
    ('DRV005', 'DEL004'),
    ('DRV001', 'DEL005'),
    ('DRV003', 'DEL005'),
    ('DRV005', 'DEL005');

