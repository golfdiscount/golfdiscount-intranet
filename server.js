const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

let wsi = require('./routes/wsi');
let analytics = require('./routes/analytics');

app.use('/api/wsi', wsi);
app.use('/api/analytics', analytics);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
