CREATE DATABASE IF NOT EXISTS wsi_stack;
USE wsi_stack;

CREATE TABLE customers(
	sold_to_name VARCHAR(128) PRIMARY KEY,
	sold_to_id VARCHAR(30) DEFAULT "",
	sold_to_address_1 VARCHAR(128) NOT NULL,
	sold_to_city VARCHAR(30) NOT NULL,
	sold_to_state VARCHAR(36) NOT NULL,
	sold_to_country VARCHAR(36) NOT NULL,
	sold_to_zip VARCHAR(15) NOT NULL
);

CREATE TABLE recipients(
	ship_to_name VARCHAR(128) PRIMARY KEY,
	ship_to_id VARCHAR(30) DEFAULT "",
	ship_to_address VARCHAR(128) NOT NULL,
	ship_to_city VARCHAR(30) NOT NULL,
	ship_to_state VARCHAR(36) NOT NULL,
	ship_to_country VARCHAR(36) NOT NULL,
	ship_to_zip VARCHAR(15) NOT NULL
);

CREATE TABLE orders(
	order_num VARCHAR(30) PRIMARY KEY,
	sold_to VARCHAR(128),
	ship_to VARCHAR(128),
	ship_method VARCHAR(5) NOT NULL,
	CONSTRAINT orderToCustomer FOREIGN KEY (sold_to) REFERENCES customers(sold_to_name),
	CONSTRAINT orderToRecipient FOREIGN KEY (ship_to) REFERENCES recipients(ship_to_name)
);

CREATE TABLE pick_ticket_headers(
	pick_ticket_num VARCHAR(30) PRIMARY KEY,
	order_num VARCHAR(30) UNIQUE,
	CONSTRAINT headerToOrder FOREIGN KEY (order_num) REFERENCES orders(order_num)
);
