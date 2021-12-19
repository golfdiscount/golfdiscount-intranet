let express = require('express');
let multer = require('multer');
let db = require('../db');

let router = express.Router();
let upload = multer();

router.use(upload.array());

router.get('/orders/:order_num', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try{
    let qry = `SELECT wsi_order.order_num,
      wsi_order.order_date AS order_date,
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
    LEFT OUTER JOIN shipping_conf ON shipping_conf.pick_ticket_num = wsi_order.pick_ticket_num
    WHERE wsi_order.order_num = "${req.params.order_num}";`;

    db.executeQuery(qry, (qryResults, error) => {
      let results = {
        products: []
      }

      if (error) {
        console.log(error);
        res.status(500).send('There was an error processing your request');
      } else if (qryResults.length != 0) {
        for (let i = 0; i < qryResults.length; i++) {
          let currentRecord = qryResults[i];
          if (i === 0) {
            results.order_num = currentRecord.order_num;
            results.order_date = currentRecord.order_date;
            results.sold_to_name = currentRecord.sold_to_name;
            results.sold_to_address = currentRecord.sold_to_address;
            results.sold_to_city = currentRecord.sold_to_city;
            results.sold_to_state = currentRecord.sold_to_state;
            results.sold_to_country = currentRecord.sold_to_country;
            results.sold_to_zip = currentRecord.sold_to_zip;
            results.ship_to_name = currentRecord.ship_to_name;
            results.ship_to_address = currentRecord.ship_to_address;
            results.ship_to_city = currentRecord.ship_to_city;
            results.ship_to_state = currentRecord.ship_to_state;
            results.ship_to_country = currentRecord.ship_to_country;
            results.ship_to_zip = currentRecord.ship_to_zip;
            results.tracking_num = currentRecord.tracking_num;
            results.sent_to_shipstation = currentRecord.sent_to_shipstation;
          }

          results.products.push({
            sku: currentRecord.sku,
            sku_name: currentRecord.sku_name,
            quantity: currentRecord.quantity,
            unit_price: currentRecord.unit_price
          })
        }
        res.status(200).json(results);
      } else {
        res.status(404).send('Order not found');
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e)
  }
});

router.get('/getStoreAddress/:storeNum', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let qry = `SELECT store_address.\`name\`,
        store_address.address,
        store_address.city,
        store_address.state,
        store_address.country,
        store_address.zip
      FROM store_address
      WHERE store_address.store_num = ${req.params.storeNum};`;

    db.executeQuery(qry, (results, error) => {
      res.status(200).json(results[0]);
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/checkOrder/:orderNum', (req, res) => {
  let qry =
  `SELECT *
  FROM wsi_order
  WHERE order_num = ${req.params.orderNum};`

  db.executeQuery(qry, (qryRes, err) => {
    if (err) res.status(500).send(e)

    if (qryRes.length === 0) {
      res.status(200).json({
        'found': false
      });
    } else {
      res.status(200).json({
        'found': true
      });
    }
  });
});

module.exports = router;