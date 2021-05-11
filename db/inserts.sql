/*
Adding header details

Insert order:
1) customer
2) Recipient
3) pick_ticket_header
4) order
*/
INSERT INTO customer(sold_to_name,
	sold_to_address_1,
    sold_to_city,
    sold_to_state,
    sold_to_country,
    sold_to_zip)
VALUES (
	"scott shive",
    "101 W gardner",
    "sparta",
    "MI",
    "US",
    "49345"
);

INSERT INTO recipient(ship_to_name,
	ship_to_address,
    ship_to_city,
    ship_to_state,
    ship_to_country,
    ship_to_zip)
VALUES (
	"scott shive",
    "101 W gardner",
    "sparta",
    "MI",
    "US",
    "49345"
);

INSERT INTO pick_ticket_header(pick_ticket_num,
	order_num)
VALUES(
	"C1000692572",
    "1000692572"
);

INSERT INTO `order`(order_num,
	sold_to,
    ship_to,
    ship_method)
VALUES (
	"1000692572",
    "scott shive",
    "scott shive",
    "FDXH"
);

/*
Adding pick ticket details

Insert order:
1) pick_ticket_detail
2) product
3) line_item
*/
INSERT INTO pick_ticket_detail(pick_ticket_num)
VALUES("C1000692572");

INSERT INTO product(sku,
	sku_name,
    unit_price)
VALUES (
	"95740",
    "test name",
    195.13
);

INSERT INTO line_item(pick_ticket_num,
	line_num,
    units_to_ship,
    sku,
    quantity)
VALUES (
	"C1000692572",
	2,
    1,
    "95740",
    1
);

/*
Adding a shipping confirmation

Insert order:
1) Shipping confirmation
*/
INSERT INTO shipping_conf(pick_ticket_num,
	ship_date,
    line_num,
    tracking_num)
VALUES (
	"C1000692572",
    NOW(),
    1,
    "12347807082391"
), (
	"C1000692572",
    NOW(),
    2,
    "2380109881030"
);