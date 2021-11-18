const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

let wsi = require('./routes/wsi');
let analytics = require('./routes/analytics');

app.use('/wsi', wsi);
app.use('/analytics', analytics);
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
