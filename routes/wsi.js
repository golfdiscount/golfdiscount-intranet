import express from 'express';

const router = express.Router();

router.get('/orders/:orderNum', (req, res) => {
    const orderNum = req.params.orderNum;

    res.send(orderNum);
});

export default router;