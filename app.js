const express = require("express");
const app = express();

const multer = require("multer");
let db = require("./db");

app.use(multer().none())
app.use(express.static("public"));
app.use(express.json())
//require("./routes/routes")(app);

db.connect();

const PORT = process.env.PORT | 8000;
app.listen(PORT, () => {
  console.log(`Testing app on port ${PORT}`)
})
