/*
Get information about all customers
*/
SELECT c.sold_to_name AS "Name",
  c.sold_to_address_1 AS "Address",
  c.sold_to_state AS "State",
  c.sold_to_country AS "Country",
  c.sold_to_zip AS "Zip"
FROM customer AS c
