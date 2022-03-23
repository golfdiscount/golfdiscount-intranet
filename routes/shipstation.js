import express from 'express';
import https from 'https';
const router = express.Router();

const SHIPSTATION_HOST = 'https://ssapi.shipstation.com'
const httpsOptions = {
  headers: {
    'Authorization': process.env.SHIPSTATION_KEY
  }
}

router.get('/orders/:orderNum', async (req, res) => {
  const url = new URL('/orders', SHIPSTATION_HOST);
  url.searchParams.append('orderNumber', req.params.orderNum);

  const ssReq = https.get(url, httpsOptions, ssRes => {
    let rawData = '';
    ssRes.on('data', data => { rawData += data });

    ssRes.on('end', async () => {
      let orders = JSON.parse(rawData);

      if (orders.total == 0) {
        res.status(404).send('The order could not be found, please check the order number and try again');
      } else {
        let order = formatOrder(orders.orders[0]);

        await Promise.all(order.products.map(async product => {
          let upc = await getProductUpc(product.sku, req.cache);
          product.upc = upc;
          product.numVerified = 0;
          return product;
        }));

        res.status(200).json(order);
      }
    });
  });

  ssReq.on('error', (e) => {
    console.log(e);
    res.status(500).send('There was an error connecting to the ShipStation API');
  });

  ssReq.end();
});

/**
 * Pulls important information like name, address, and products out
 * of a ShipStation order and reformats it
 * @param {Object} order Singular order object to extract information out of
 * @returns Object containing basic order information
 */
function formatOrder(orderInfo) {
  let order = {
    orderNumber: orderInfo.orderNumber,
    orderDate: orderInfo.orderDate,
    email: orderInfo.customerEmail,
    customerAddress: {
      name: orderInfo.shipTo.name,
      street: `${orderInfo.shipTo.street1} ${orderInfo.shipTo.street2}`,
      city: orderInfo.shipTo.city,
      state: orderInfo.shipTo.state,
      zip: orderInfo.shipTo.postalCode,
      country: orderInfo.shipTo.country,
      phone: orderInfo.shipTo.phone
    },
    products: [],
  }

  orderInfo.items.forEach(product => {
    order.products.push({
      sku: product.sku,
      productName: product.name,
      imageUrl: product.imageUrl,
      quantity: product.quantity
    });
  });

  return order;
}

async function getProductUpc(sku, cache) {
  const url = new URL(`/api/products/${sku}`, process.env.MAGESTACK)

  return new Promise(async (resolve, reject) => {
    const cachedUpc = await cache.HGET(sku, 'upc');
    
    if (cachedUpc === null) {
      console.warn(`Could not find ${sku} in the cache`);

      const req = https.get(url, res => {
        let rawData = '';
  
        res.on('data', (d) => { rawData += d });
  
        res.on('end', async () => {
          let productInfo = JSON.parse(rawData);
          console.log(`Setting UPC ${productInfo.upc} for ${sku}`);
          await cache.HSET(sku, 'upc', productInfo.upc);
          resolve(productInfo.upc);
        });
      });
  
      req.on('error', (e) => {
        console.log(e);
        reject('No UPC in system');
      });
    } else {
      resolve(cachedUpc)
    }
  });
} 

export default router;