let express = require('express');
let multer = require('multer');
let moment = require('moment');
let fs = require('fs');
let db = require('../db');
const path = require('path');

let router = express.Router();
let upload = multer();

router.use(upload.array());

router.get('/orders/:order_num', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try{
    let qry = `SELECT wsi_order.order_num AS "Order Number",
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

    db.executeQuery(qry, (results, error) => {
      if (typeof(results) === undefined) {
        res.status(200).send(results);
      } else {
        res.status(200).json(results[0]);
      }
    });
  } catch (e) {
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
      console.log(results);
      res.status(200).json(results[0]);
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;