import express from 'express';
import magento from './magestack.js';
import shipstation from './shipstation.js';
import wsi from './wsi.js';

const router = express.Router();

router.use('/magento', magento);
router.use('/shipstation', shipstation);
router.use('/wsi', wsi);

export default router;