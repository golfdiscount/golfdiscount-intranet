let db = require("../db.js")

module.exports = function(app) {
  app.post("/addCustomer", (req, res) => {
    try{
      let query = `INSERT INTO customer(sold_to_name,
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
      );
      SELECT * FROM customer;
      `
      db.executeQuery(query, () => {
        sendPost(res);
      });
    } catch (e) {
      handleError(e);
    }
  });

  app.get("/getCustomers", (req, res) => {
    try {
      let query = `SELECT c.sold_to_name AS "Name",
          c.sold_to_address_1 AS "Address",
          c.sold_to_state AS "State",
          c.sold_to_country AS "Country",
          c.sold_to_zip AS "Zip"
        FROM customer AS c;
      `
      db.executeQuery(query, (results) => {
        res.status(200).type("JSON").send(JSON.stringify(results));
      });
    } catch (e) {
      handleError(e);
    }
  });
}

function handleError(e) {
  console.log(e);
  res.status(500).type("text")
    .send("Internal Server Error");
}