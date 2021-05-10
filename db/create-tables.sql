DROP DATABASE wsi_stack;
CREATE DATABASE IF NOT EXISTS wsi_stack;
USE wsi_stack;

CREATE TABLE customer(
	sold_to_name VARCHAR(128) PRIMARY KEY,
	sold_to_id VARCHAR(30) DEFAULT "",
	sold_to_address_1 VARCHAR(128) NOT NULL,
	sold_to_city VARCHAR(30) NOT NULL,
	sold_to_state VARCHAR(36) NOT NULL,
	sold_to_country VARCHAR(36) NOT NULL,
	sold_to_zip VARCHAR(15) NOT NULL
);

CREATE TABLE recipient(
	ship_to_name VARCHAR(128) PRIMARY KEY,
	ship_to_id VARCHAR(30) DEFAULT "",
	ship_to_address VARCHAR(128) NOT NULL,
	ship_to_city VARCHAR(30) NOT NULL,
	ship_to_state VARCHAR(36) NOT NULL,
	ship_to_country VARCHAR(36) NOT NULL,
	ship_to_zip VARCHAR(15) NOT NULL
);

CREATE TABLE `order`(
	order_num VARCHAR(30) PRIMARY KEY,
	sold_to VARCHAR(128),
	ship_to VARCHAR(128),
	ship_method VARCHAR(5) NOT NULL,
	CONSTRAINT orderToCustomer FOREIGN KEY (sold_to)
		REFERENCES customer(sold_to_name),
	CONSTRAINT orderToRecipient FOREIGN KEY (ship_to)
		REFERENCES recipient(ship_to_name)
);

CREATE TABLE product(
	sku VARCHAR(32) PRIMARY KEY,
	sku_name TEXT NOT NULL,
	unit_price FLOAT NOT NULL
);

CREATE TABLE pick_ticket_detail(
	pick_ticket_num VARCHAR(30) PRIMARY KEY,
	date_last_modified DATETIME DEFAULT NOW()
);

CREATE TABLE line_item(
	pick_ticket_num VARCHAR(30),
	line_num INT,
	sku VARCHAR(32),
	quantity INT DEFAULT 1,
	units_to_ship INT DEFAULT 1,
	PRIMARY KEY (pick_ticket_num, line_num),
	CONSTRAINT lineToSku FOREIGN KEY (sku)
		REFERENCES product(sku),
	CONSTRAINT lineToTicket FOREIGN KEY (pick_ticket_num)
		REFERENCES pick_ticket_detail(pick_ticket_num)
);

CREATE TABLE pick_ticket_header(
	pick_ticket_num VARCHAR(30) PRIMARY KEY,
	order_num VARCHAR(30) UNIQUE,
	detail VARCHAR(30) UNIQUE,
	CONSTRAINT headerToOrder FOREIGN KEY (order_num)
		REFERENCES `order`(order_num),
	CONSTRAINT headerToDetail FOREIGN KEY (detail)
		REFERENCES pick_ticket_detail(pick_ticket_num)
);
