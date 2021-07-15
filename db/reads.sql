/*
Get customer information for each order for all orders
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

/*
Get shipping information for each order for all orders
*/
SELECT pth.order_num AS "Order Number",
	line_item.line_num AS "Line Number",
    product.sku AS "SKU",
    product.sku_name AS "SKU Description",
    line_item.quantity AS "Quantity",
    product.unit_price AS "Unit Price",
    shipping_conf.tracking_num AS "Tracking number",
    shipping_conf.sent_to_shipstation AS "Sent to ShipStation"
FROM pick_ticket_header AS pth
JOIN pick_ticket_detail AS ptd ON ptd.pick_ticket_num = pth.pick_ticket_num
JOIN line_item ON line_item.pick_ticket_num = ptd.pick_ticket_num
JOIN product ON product.sku = line_item.sku
JOIN shipping_conf ON shipping_conf.pick_ticket_num = pth.pick_ticket_num;

/*
Gets all information for all orders
*/
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
