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

router.post('/createOrder', (req, res) => {
  let header = createHeader(req.body);
  let detail = createDetail(req.body);

  try {
    let writeStream = fs.createWriteStream(`C${req.body.orderNum}.csv`);
    writeStream.write(header + '\r\n');
    writeStream.write(detail + '\r\n');

    let filePath = path.resolve(__dirname, `..\\C${req.body.orderNum}.csv`)
    res.status(200).sendFile(filePath);
  } catch (e) {
    console.log(e);
    res.status(500).send('There was an error creating the order file.');
  }
});

function createHeader(orderData) {
  let header = new Array(62);

  header[0] = 'PTH';
  header[1] = 'I';
  header[2] = 'C' + orderData.orderNum;
  header[3] = orderData.orderNum;
  header[4] = 'C';

  let today = new Date();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  let yyyy = today.getFullYear();

  if (mm < 10) {
    mm = '0' + mm;
  }

  if (dd < 10) {
    dd = '0' + dd;
  }

  header[5] = `${mm}/${dd}/${yyyy}`;

  let shipDate = moment(orderData.shipDate, 'YYYY-MM-DD');
  header[6] = `${shipDate.format('MM/DD/YYYY')}`;

  // Order Priority
  header[9] = "75"

  // Customer information
  header[12] = `"${orderData.name}"`;
  header[13] = `"${orderData.address}"`;
  header[14] = `"${orderData.city}"`;
  header[15] = orderData.state;
  header[16] = orderData.country;
  header[17] = orderData.zip;

  // Recipient information
  /**
   * TODO: Update this to accept recipient information
   */
  header[19] = `"${orderData.name}"`;
  header[20] = `"${orderData.address}"`;
  header[21] = `"${orderData.city}"`;
  header[22] = orderData.state;
  header[23] = orderData.country;
  header[24] = orderData.zip;

  // Shipping method
  /**
   * TODO: Update this to get shipping method from request
   */
  header[32] = "FDXH";

  header[35] = 'PGD';

  header[37] = 'HN';
  header[38] = 'PGD';
  header[39] = 'PP';

  // Ship complete
  header[45] = 'Y';

  // Consolidation Type
  header[49] = "PT";

  return header.toString();
}

function createDetail(orderData) {
  let detail = new Array(27)

  detail[0] = 'PTD';
  detail[1] = 'I';
  detail[2] = 'C' + orderData.orderNum;
  detail[3] = 1;
  detail[4] = 'A';
  detail[5] = orderData.sku;

  detail[10] = orderData.qty;
  detail[11] = detail[10];

  detail[14] = orderData.price;

  detail[17] = 'HN';
  detail[18] = 'PGD';

  return detail.toString();
}

module.exports = router;