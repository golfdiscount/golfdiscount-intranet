DROP DATABASE IF EXISTS wsi;
CREATE DATABASE wsi;
USE wsi;

CREATE TABLE customer(
	customer_id INT AUTO_INCREMENT PRIMARY KEY,
	sold_to_name VARCHAR(128),
	sold_to_id VARCHAR(30) DEFAULT "",
	sold_to_address VARCHAR(128) NOT NULL,
	sold_to_city VARCHAR(30) NOT NULL,
	sold_to_state VARCHAR(36) NOT NULL,
	sold_to_country VARCHAR(36) NOT NULL,
	sold_to_zip VARCHAR(15) NOT NULL,
  	date_added DATETIME DEFAULT CURRENT_TIMESTAMP
	FOREIGN KEY (customer_id)
		REFERENCES wsi_order(sold_to)
		ON DELETE UPDATE
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
	date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (recipient_id)
		REFERENCES wsi_order(ship_to)
		ON DELETE UPDATE
);

CREATE TABLE store_address(
	store_num INT PRIMARY KEY,
	name VARCHAR(45) NOT NULL
	address VARCHAR(128) NOT NULL,
	city VARCHAR(30),
	state VARCHAR(36),
	country VARCHAR(36),
	zip VARCHAR(15)
);

INSERT INTO store_address(store_num, name, address, city, state, country, zip)
VALUES
	(1, "Pro Golf Internet", "13405 SE 30th St Suite 1A", "Bellevue", "WA", "US", 98005),
	(2, "Pro Golf Lynnwood", "19125 33rd Ave W A", "Lynnwood", "WA", "US", 98036),
	(3, "Pro Golf Bellevue", "14404 NE 20th St #150", "Bellevue", "WA", "US", 98007),
	(5, "Pro Golf Southcenter", "17305 Southcenter Pkwy", "Seattle", "WA", "US", 98188),
	(6, "Pro Golf Tacoma", "5015 Tacoma Mall Blvd", "Tacoma", "WA", "US", 98409),
	(7, "Pro Golf Bellingham", "4225 Meridian St", "Bellingham", "WA", "US", 98226);


CREATE TABLE wsi_order(
	pick_ticket_num VARCHAR(30),
	order_num VARCHAR(30),
	store_num INT DEFAULT 1 NOT NULL,
	sold_to INT,
	ship_to INT,
	ship_method VARCHAR(5) NOT NULL,
	order_date DATETIME,
	date_added DATETIME CURRENT_TIMESTAMP,
	CONSTRAINT orderToCustomer FOREIGN KEY (sold_to)
		REFERENCES customer(customer_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT orderToRecipient FOREIGN KEY (ship_to)
		REFERENCES recipient(recipient_id)
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT orderToStore FOREIGN KEY (store_num)
		REFERENCES store_address(store_num),
	PRIMARY KEY (pick_ticket_num, order_num)
);

CREATE TABLE product(
	sku VARCHAR(32) PRIMARY KEY,
	sku_name TEXT NOT NULL,
	unit_price FLOAT NOT NULL
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
		REFERENCES wsi_order(pick_ticket_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE shipping_conf(
	pick_ticket_num VARCHAR(30),
	line_num INT,
	ship_date DATETIME DEFAULT NULL,
    tracking_num TEXT,
	sent_to_shipstation INT DEFAULT 0,
	PRIMARY KEY (pick_ticket_num, line_num),
	CONSTRAINT confToTicket FOREIGN KEY (pick_ticket_num)
		REFERENCES wsi_order(pick_ticket_num)
		ON UPDATE CASCADE ON DELETE CASCADE
);

DELIMITER //

CREATE PROCEDURE flush_db()
BEGIN
	DELETE FROM wsi_order;
	DELETE FROM product;
END//

CREATE PROCEDURE getOrders()
BEGIN
SELECT wsi_order.order_num AS "Order Number",
	c.sold_to_name,
	c.sold_to_address,
	c.sold_to_city,
	c.sold_to_state,
	c.sold_to_country,
	c.sold_to_zip,
	r.ship_to_name,
	r.ship_to_address,
	r.ship_to_city,
	r.ship_to_state,
	r.ship_to_country,
	r.ship_to_zip,
	line_item.line_num,
	product.sku,
	product.sku_name,
	line_item.quantity,
	product.unit_price,
	shipping_conf.tracking_num,
	shipping_conf.sent_to_shipstation
FROM wsi_order
JOIN customer AS c ON c.customer_id = wsi_order.sold_to
JOIN recipient AS r ON r.recipient_id = wsi_order.ship_to
JOIN line_item ON line_item.pick_ticket_num = wsi_order.pick_ticket_num
JOIN product ON product.sku = line_item.sku
LEFT OUTER JOIN shipping_conf ON shipping_conf.pick_ticket_num = wsi_order.pick_ticket_num;
END//

DELIMITER ;
