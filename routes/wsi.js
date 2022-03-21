import express from 'express';
import https from 'https';

const router = express.Router();

router.get('/orders/:orderNum', (req, res) => {
const wsiUrl = new URL(`/api/orders/${req.params.orderNum}`, process.env.WSI);

    https.get(wsiUrl, (serverRes) => {
        let rawData = '';

        serverRes.on('data', (d) => {
            rawData += d;
        });

        serverRes.on('end', () => {
            if (serverRes.statusCode == 404) {
                res.status(404).send('Unable to find order');
            } else {
                res.status(200).json(JSON.parse(rawData));
            }
        });

        serverRes.on('error', (err) => {
            console.log(err);
            res.status(500).send('Unable to get order from WSI database');
        });
    });
});

export default router;