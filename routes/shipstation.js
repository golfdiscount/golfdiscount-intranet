import express from 'express';
import https from 'https';
const router = express.Router();

const SHIPSTATION_HOST = 'https://ssapi.shipstation.com'
const httpsOptions = {
  headers: {
    'Authorization': process.env.SHIPSTATION_KEY
  }
}

router.get('/orders/:orderNum', (req, res) => {
  const reqUrl = new URL('/orders', SHIPSTATION_HOST);
  reqUrl.searchParams.append('orderNumber', req.params.orderNum);

  const ssReq = https.get(reqUrl, httpsOptions, ssRes => {
    let rawData = '';
    ssRes.on('data', data => { rawData += data });

    ssRes.on('end', () => {
      res.status(200).json(JSON.parse(rawData));
    });
  });

  ssReq.on('error', (e) => {
    console.log(e);
    res.status(500).send('There was an error connecting to the ShipStation API');
  });

  ssReq.end();
});

export default router;