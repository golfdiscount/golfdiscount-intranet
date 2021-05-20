/*
Get information about all customers
*/
SELECT c.sold_to_name AS "Name",
  c.sold_to_address_1 AS "Address",
  c.sold_to_state AS "State",
  c.sold_to_country AS "Country",
  c.sold_to_zip AS "Zip"
FROM customer AS c

/*
Get information about all orders
*/
SELECT wsi_order.order_num AS "Order Number",
	c.sold_to_name AS "Customer Name",
  c.sold_to_address AS "Customer Address",
  c.sold_to_city AS "Customer City",
  c.sold_to_state AS "Customer State",
  c.sold_to_country AS "Customer Country",
  c.sold_to_zip AS "Customer Zip",
  r.ship_to_name AS "Recipient Name",
  r.ship_to_address AS "Recipient Address",
  r.ship_to_city AS "Recipient City",
  r.ship_to_state AS "Recipient State",
  r.ship_to_country AS "Recipient Country",
  r.ship_to_zip AS "Recipient Zip"
FROM wsi_order
JOIN pick_ticket_header AS pth ON pth.order_num = wsi_order.order_num
JOIN customer AS c ON c.customer_id = wsi_order.sold_to
JOIN recipient AS r ON r.recipient_id = wsi_order.ship_to;