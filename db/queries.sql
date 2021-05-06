/*
PUT an order into the database
*/
INSERT INTO pt_header (pick_ticket_num,
	order_num,
    order_date,
    date_last_modified,
    ship_to_name,
    ship_to_address,
    ship_to_city,
    ship_to_state,
    ship_to_country,
    ship_to_zip,
    ship_method)
VALUES ("C1000692572",
    1000692572,
    "20210406",
    NOW(),
    "scott shive",
    "101 W gardner",
    "sparta",
    "MI",
    "US",
    "49345",
    "FDXH"
);

INSERT INTO pt_detail (pick_ticket_num,
	line_no,
	sku_1,
	units_ordered,
	units_to_ship,
	unit_price,
	date_last_modified)
VALUES (
	"C1000692572",
    "1",
    "95740",
    "1",
    "1",
    "195.13",
    NOW()
);

/*
GET details about an order based on order number
*/
SELECT pth.order_num AS "Order Number",
	DATE_FORMAT(pth.order_date, "%Y-%m-%d") AS "Order Date",
    ptd.sku_1 AS "SKU 1",
    ptd.units_ordered AS "Quantity Ordered",
    pth.ship_method AS "Shipping Method"
FROM pt_header AS pth
JOIN pt_detail AS ptd ON ptd.pick_ticket_num = pth.pick_ticket_num;

/*
DELETE an order based on order number
*/
DELETE
FROM pt_header AS pth
WHERE pth.order_num = "1000692572";