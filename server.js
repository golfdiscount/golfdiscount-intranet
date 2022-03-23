import express from 'express';
import logger from 'morgan'
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

import cache from './cache.js';

// API routers
import api from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();

app.disable('x-powered-by');

app.use(logger('combined'));
app.use(express.json());
app.use((req, res, next) => {
  req.cache = cache;
  next();
});
app.use('/api', api);

// Configuration for serving React files
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});