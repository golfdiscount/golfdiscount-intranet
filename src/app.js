"use strict";

const express = require("express");
const app = express();
const multer = require("multer");
let db = require("./db");

app.use(multer().none())
app.use(express.static("public"));
app.use(express.json())
require("./routes/routes")(app);

db.connect();

const PORT = process.env.PORT | 8000;
const HOSTNAME = process.env.HOSTNAME | "wsi-orders.mysql.database.azure.com";
app.listen(PORT, HOSTNAME, () => {
  console.log(`API up and running on port ${PORT}`)
})
