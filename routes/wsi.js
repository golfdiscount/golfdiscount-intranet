import express from 'express';
import https from 'https';

const router = express.Router();

router.get('/orders/:orderNum', (req, res) => {
    const url = new URL(`/api/orders/${req.params.orderNum}`, process.env.WSI);

    const serverReq = https.get(url, (serverRes) => {
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

    serverReq.end();
});

router.post('/orders', (req, res) => {
    let data = JSON.stringify(req.body);
    const url = new URL('/api/orders', process.env.WSI);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const serverReq = https.request(url, options, (serverRes) => {
        let rawData = '';

        serverRes.on('data', (d) => {
            rawData += d;
        });

        serverRes.on('end', () => {
            console.log(rawData);
            if (serverRes.statusCode != 200) {
                res.status(400).send('Unable to submit order');
            } else {
                res.status(200).send('Order submitted!');
            }
        });
    });

    serverReq.write(data);
    serverReq.end();
});

export default router;