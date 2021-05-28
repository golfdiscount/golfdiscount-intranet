const express = require("express");
const app = express();
const PORT = process.env.PORT | 8080;
const multer = require("multer");

let db = require("./db");

app.use(multer().none())
app.use(express.static("public"));
app.use(express.json())
require("./routes/routes")(app);

app.get('/testRoute', (req, res) => {
  res.status(200).send('This route is working')
})

db.connect();


app.listen(PORT, () => {
  console.log(`Testing app on port ${PORT}`)
})
