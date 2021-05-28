let db = require("../db.js")

module.exports = function(app) {
  /*
  ADD PICK TICKET HEADER
  */
  app.post("/addCustomer", (req, res) => {
    try{
      let qry = `INSERT INTO customer(sold_to_name,
          sold_to_address,
          sold_to_city,
          sold_to_state,
          sold_to_country,
          sold_to_zip)
      VALUES (
          "${req.body.sold_to_name}",
          "${req.body.sold_to_address}",
          "${req.body.sold_to_city}",
          "${req.body.sold_to_state}",
          "${req.body.sold_to_country}",
          "${req.body.sold_to_zip}"
      );`
      db.executeQuery(qry, (results, error) => {
        if (error) {
          res.status(400).json(error)
        } else {
          res.status(201).type("JSON")
            .send({"response": `Customer ${req.body.sold_to_name} successfully added with ID ${results.insertId}`,
            "insertId": results.insertId});
        }
      });
    } catch (e) {
      handleError(e, res);
    }
  });

  app.post("/addRecipient", (req, res) => {
    try{
      let qry = `INSERT INTO recipient(ship_to_name,
        ship_to_address,
        ship_to_city,
        ship_to_state,
        ship_to_country,
        ship_to_zip)
      VALUES (
        "${req.body.ship_to_name}",
        "${req.body.ship_to_address}",
        "${req.body.ship_to_city}",
        "${req.body.ship_to_state}",
        "${req.body.ship_to_country}",
        "${req.body.ship_to_zip}"
      );`
      db.executeQuery(qry, (results) => {
        res.status(201).type("JSON")
          .send({"response": `Recipient ${req.body.ship_to_name} successfully added with ID ${results.insertId}`,
              "insertId": results.insertId});
      });
    } catch (e) {
      handleError(e, res);
    }
  });

  app.post("/addHeader", (req, res) => {
    try{
      let qry = `INSERT INTO pick_ticket(pick_ticket_num,
          order_num)
        VALUES ("${req.body.pick_ticket_num}",
          "${req.body.order_num}");`
      db.executeQuery(qry, (results, error) => {
        if (error){
          res.status(400).type("JSON")
            .send({"response":`${error.sqlMessage}`});
        } else {
          res.status(201).type("JSON")
            .send({"response":`Successfully added pick ticket header ${req.body.pick_ticket_num}`});
        }
      });
    } catch (e) {
      handleError(e, res);
    }
  });

  app.post("/addOrder", (req, res) => {
    try{
      let qry = `INSERT INTO wsi_order(order_num,
            sold_to,
            ship_to,
            ship_method,
            order_date)
          VALUES ("${req.body.order_num}",
            "${req.body.sold_to}",
            "${req.body.ship_to}",
            "${req.body.ship_method}",
            STR_TO_DATE("${req.body.order_date}", "%m/%d/%Y"));`
      db.executeQuery(qry, (results, error) => {
        if (error) {
          res.status(400).type("JSON")
            .send({"response": `${error.sqlMessage}`});
        } else {
          res.status(201).type("JSON")
            .send({"response": `Successfully added order ${req.body.order_num}`});
        }
      })
    } catch {
      handleError(e, res)
    }
  });

  /*
  ADD PICK TICKET DETAIL
  */
  app.post("/addProduct", (req, res) => {
    try{
      let qry = `INSERT IGNORE INTO product(sku,
        sku_name,
        unit_price)
      VALUES ("${req.body.sku}",
        "${req.body.sku_name}",
        "${req.body.unit_price}");`
      db.executeQuery(qry, (results, error) => {
        if (error) {
          res.status(400).type("JSON")
            .send({"response": `There was an error adding a product:\n${error.sqlMessage}`});
        } else {
          res.status(201).type("JSON")
            .send({"response": `A product with sku ${req.body.sku} was successfully created`});
        }
      })
    } catch (e) {
      res.status(500).type("JSON")
        .send({"response": "Internal Server Error"});
    }
  });

  app.post("/addLineItem", (req, res) => {
    try {
      let qry = `INSERT INTO line_item (pick_ticket_num,
          line_num,
          sku,
          units_to_ship,
          quantity)
        VALUES ("${req.body.pick_ticket_num}",
          "${req.body.line_num}",
          "${req.body.sku}",
          "${req.body.units_to_ship}",
          "${req.body.quantity}");`
        db.executeQuery(qry, (results, error) => {
          if (error) {
            res.status(400).type("JSON")
              .send({"response": `Line item could not be added\n${error.sqlMessage}`});
          } else {
            res.status(201).type("JSON")
              .send({"response": `Line number ${req.body.line_num} added to order number ${req.body.pick_ticket_num}`});
          }
        });
    } catch (e) {
      handleError(e, res);
    }
  });

  /*
  ADD SHIPPING CONFIRMATION
  */
  app.post("/addConfirmation", (req, res) => {
    try {
      let qry = `INSERT INTO shipping_conf(pick_ticket_num,
          line_num,
          ship_date,
          tracking_num)
        VALUES ("${req.body.pick_ticket_num}",
          "${req.body.line_num}",
          "${req.body.ship_date}",
          "${req.body.tracking_num}");`
      db.executeQuery(qry, (results, error) => {
        if(error) {
          res.status(400).type("text")
            .send(`There was an error adding shipping confirmation for ${req.body.pick_ticket_num}:\n${error.sqlMessage}`);
        } else {
          res.status(201).type("text")
            .send(`Shipping confirmation for order ${req.body.pick_ticket_num} line ${req.body.line_num} has been added`);
        }
      });
    } catch (e) {
      handleError(e, res);
    }
  });

  app.get("/orders/:order_num", (req, res) => {
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
        JOIN pick_ticket AS pt ON pt.order_num = wsi_order.order_num
        JOIN customer AS c ON c.customer_id = wsi_order.sold_to
        JOIN recipient AS r ON r.recipient_id = wsi_order.ship_to
        JOIN line_item ON line_item.pick_ticket_num = pt.pick_ticket_num
        JOIN product ON product.sku = line_item.sku
        LEFT OUTER JOIN shipping_conf ON shipping_conf.pick_ticket_num = pt.pick_ticket_num
        WHERE wsi_order.order_num = "${req.params.order_num}";`;
      db.executeQuery(qry, (results, error) => {
        if (error) {
          res.status(400).json(error.sqlMessage)
        } else {
          res.status(200).json(results[0]);
        }
      })
    } catch (e) {
      handleError(e, res)
    }
  });
}

function handleError(e, res) {
  res.status(500).type("text")
    .send(`Internal Server Error\n${e}`);
}