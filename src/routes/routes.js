let db = require("../db.js")

module.exports = function(app) {
  app.post("/addCustomer", (req, res) => {
    try{
      let qry = `INSERT INTO customer(sold_to_name,
          sold_to_address_1,
          sold_to_city,
          sold_to_state,
          sold_to_country,
          sold_to_zip)
      VALUES (
          "${req.body.sold_to_name}",
          "${req.body.sold_to_address}",
          "${req.body.city}",
          "${req.body.state}",
          "${req.body.country}",
          "${req.body.zip}"
      );`
      db.executeQuery(qry, (results) => {
        res.status(200).type("text")
        .send(`Customer ${req.body.sold_to_name} successfully added with ID ${results.insertId}`);
      });
    } catch (e) {
      handleError(e);
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
        res.status(200).type("text")
          .send(`Recipient ${req.body.ship_to_name} successfully added with ID ${results.insertId}`);
      });
    } catch (e) {
      handleError(e);
    }
  });

  app.post("/addHeader", (req, res) => {
    try{
      let qry = `INSERT INTO pick_ticket_header(pick_ticket_num,
          order_num)
        VALUES ("${req.body.pick_ticket_num}",
          "${req.body.order_num}");`
      db.executeQuery(qry, (results, error) => {
        if (error.errno){
          res.status(406).type("text")
            .send(`This order already exists or request parameters are bad\n${error.sqlMessage}`);
        } else{res.status(200).type("text")
          .send(`Successfully added pick ticket header ${req.body.pick_ticket_num}`);
        }
      });
    } catch (e) {
      handleError(e);
    }
  });

  app.get("/customers", (req, res) => {
    let name = req.query.name;
    try{
      if(name){
        let qry = `SELECT c.customer_id AS "Customer ID",
            c.sold_to_name AS "Name",
            c.sold_to_address_1 AS "Address",
            c.sold_to_state AS "State",
            c.sold_to_country AS "Country",
            c.sold_to_zip AS "Zip"
          FROM customer AS c
          WHERE c.sold_to_name LIKE "${name}";`
        db.executeQuery(qry, (results) => {
          res.status(200).type("JSON").send(JSON.stringify(results));
        });
      } else{
        let qry = `SELECT c.customer_id AS "Customer ID",
            c.sold_to_name AS "Name",
            c.sold_to_address_1 AS "Address",
            c.sold_to_state AS "State",
            c.sold_to_country AS "Country",
            c.sold_to_zip AS "Zip"
          FROM customer AS c;`
        db.executeQuery(qry, (results) => {
          res.status(200).type("JSON").send(JSON.stringify(results));
        });
      }
    } catch (e) {
      handleError(e);
    }
  });
}

function handleError(e) {
  res.status(500).type("text")
    .send("Internal Server Error");
}