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

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;
app.listen(PORT, HOSTNAME, () => {
  console.log(`API up and running on port ${PORT}`)
})
