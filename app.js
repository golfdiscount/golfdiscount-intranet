const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

let db = require('./db');
let wsi = require('./routes/wsi');

app.use('/wsi', wsi);
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

db.connect();

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
