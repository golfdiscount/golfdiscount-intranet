import express from 'express';
import shipstation from './shipstation.js';
const router = express.Router();

router.use('/shipstation', shipstation);

export default router;