CREATE DATABASE IF NOT EXISTS wsi_stack;
USE wsi_stack;

DROP TABLE IF EXISTS pt_header;
DROP TABLE IF EXISTS pt_detail;

CREATE TABLE pt_header (
	pick_ticket_num VARCHAR(30) NOT NULL UNIQUE,
    order_num VARCHAR(30) NOT NULL,
    order_date DATETIME NOT NULL,
    date_last_modified DATETIME NOT NULL,
    sold_to VARCHAR(30),
    sold_to_name VARCHAR(128),
    sold_to_address_1 VARCHAR(128),
    sold_to_city VARCHAR(30),
    sold_to_state VARCHAR(36),
    sold_to_country VARCHAR(36),
    sold_to_zip VARCHAR(15),
    ship_to VARCHAR(30) DEFAULT "",
    ship_to_name VARCHAR(128) NOT NULL,
    ship_to_address VARCHAR(128) NOT NULL,
    ship_to_city VARCHAR(30) NOT NULL,
    ship_to_state VARCHAR(36) NOT NULL,
    ship_to_country VARCHAR(36) NOT NULL,
    ship_to_zip VARCHAR(15) NOT NULL,
    ship_method VARCHAR(5) NOT NULL,
    PRIMARY KEY (pick_ticket_num)
);

CREATE TABLE pt_detail (
    pick_ticket_num VARCHAR(30) NOT NULL,
    line_no INT NOT NULL,
    sku_1 VARCHAR(60) NOT NULL,
    units_ordered INT NOT NULL,
    units_to_ship INT NOT NULL,
    unit_price FLOAT,
    date_last_modified DATETIME NOT NULL,
    PRIMARY KEY (pick_ticket_num),
    CONSTRAINT detail_to_header FOREIGN KEY (pick_ticket_num)
    REFERENCES pt_header(pick_ticket_num)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
);