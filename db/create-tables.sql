DROP DATABASE wsi_stack;
CREATE DATABASE IF NOT EXISTS wsi_stack;
USE wsi_stack;

CREATE TABLE customer(
	customer_id INT AUTO_INCREMENT PRIMARY KEY,
	sold_to_name VARCHAR(128),
	sold_to_id VARCHAR(30) DEFAULT "",
	sold_to_address_1 VARCHAR(128) NOT NULL,
	sold_to_city VARCHAR(30) NOT NULL,
	sold_to_state VARCHAR(36) NOT NULL,
	sold_to_country VARCHAR(36) NOT NULL,
	sold_to_zip VARCHAR(15) NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipient(
	recipient_id INT AUTO_INCREMENT PRIMARY KEY,
	ship_to_name VARCHAR(128),
	ship_to_id VARCHAR(30) DEFAULT "",
	ship_to_address VARCHAR(128) NOT NULL,
	ship_to_city VARCHAR(30) NOT NULL,
	ship_to_state VARCHAR(36) NOT NULL,
	ship_to_country VARCHAR(36) NOT NULL,
	ship_to_zip VARCHAR(15) NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pick_ticket_header(
	pick_ticket_num VARCHAR(30) PRIMARY KEY,
	order_num VARCHAR(30) UNIQUE
);

CREATE TABLE `order`(
	order_num VARCHAR(30) PRIMARY KEY,
	sold_to INT,
	ship_to INT,
	ship_method VARCHAR(5) NOT NULL,
	CONSTRAINT orderToCustomer FOREIGN KEY (sold_to)
		REFERENCES customer(customer_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT orderToRecipient FOREIGN KEY (ship_to)
		REFERENCES recipient(recipient_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT orderToHeader FOREIGN KEY (order_num)
		REFERENCES pick_ticket_header(order_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE product(
	sku VARCHAR(32) PRIMARY KEY,
	sku_name TEXT NOT NULL,
	unit_price FLOAT NOT NULL
);

CREATE TABLE pick_ticket_detail(
	pick_ticket_num VARCHAR(30) PRIMARY KEY,
	date_last_modified DATETIME DEFAULT NOW(),
	CONSTRAINT detailToHeader FOREIGN KEY (pick_ticket_num)
		REFERENCES pick_ticket_header(pick_ticket_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE line_item(
	pick_ticket_num VARCHAR(30),
	line_num INT,
	sku VARCHAR(32),
	quantity INT DEFAULT 1,
	units_to_ship INT DEFAULT 1,
	PRIMARY KEY (pick_ticket_num, line_num),
	CONSTRAINT lineToSku FOREIGN KEY (sku)
		REFERENCES product(sku)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT lineToTicket FOREIGN KEY (pick_ticket_num)
		REFERENCES pick_ticket_detail(pick_ticket_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE shipping_conf(
	pick_ticket_num VARCHAR(30),
	line_num INT,
	ship_date DATETIME DEFAULT NULL,
    tracking_num TEXT,
	PRIMARY KEY (pick_ticket_num, line_num),
	CONSTRAINT confToTicket FOREIGN KEY (pick_ticket_num)
		REFERENCES pick_ticket_header(pick_ticket_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);
