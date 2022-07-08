import express from 'express';
import https from 'https';

const router = express.Router();

router.get('/products/:sku', (req, res) => {
  // const url = new URL(`/api/products/${req.params.sku}?code=${process.env.magestack_key}`, process.env.MAGESTACK);
  const options = {
    hostname: 'magestack-staging.azurewebsites.net',
    path: `/api/products/${req.params.sku}`,
    method: 'GET',
    headers: {
      'x-functions-key': process.env.magestack_key
    }
  }

  const serverReq = https.get(options, (serverRes) => {
    let rawData = '';

    serverRes.on('data', (d) => {
      rawData += d;
    });

    serverRes.on('end', () => {
      console.log(rawData);
      if (serverRes.statusCode == 404) {
        res.status(404).send('Unable to find product in Magento');
      } else {
        res.status(200).json(JSON.parse(rawData));
      }
    });

    serverRes.on('error', (err) => {
      console.log(err);
      res.status(500).send('Unable to get product from Magento database');
    });
  });

  serverReq.end();
});

export default router;