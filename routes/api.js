import express from 'express';
import shipstation from './shipstation.js';
import wsi from './wsi.js';

const router = express.Router();

router.use('/shipstation', shipstation);
router.use('/wsi', wsi);

export default router;