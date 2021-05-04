/*
Contains the implementation to
*/

"use strict";

const express = require("express");
const app = express();
require("./routes/routes")(app);
const multer = require("multer");

app.use(multer().none())

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API up and running on port ${PORT}`)
})