const express = require("express");
const app = express();
const PORT = process.env.PORT | 443;

let db = require("./db");

app.use(express.static("public"));
app.use(express.json());
require("./routes/routes")(app);

db.connect();


app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
