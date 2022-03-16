import { useState } from 'react';

import ErrorMessage from '../../../common/ErrorMessage';
import OrderInfo from './order-info';
import ProductVerifier from './product-verifier';

import './order-verifier.css';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();
  const [products, setProducts] = useState([]);
  const [verified, setVerified] = useState(false);

  return (
    <div className='tab-content'>
      {error}
      <div className={`tab-inner-content${verified ? ' verified' : ''}`}>
        <h1>Order Verification</h1>
        <h2>Order Number</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          await getOrder(e.target.elements['orderNumber'].value, setOrder, setProducts, setError);
          setVerified(false);
        }}>
          <input required type='text' name='orderNumber' />
          <button type='submit'>Submit</button>
        </form>
        {order && <OrderInfo date={order.orderDate} email={order.email}/>}
        {order && <ProductVerifier products={products} setProducts={setProducts} setVerified={setVerified}/>}
      </div>
    </div>
  );
}

/**
 * Searches for an order and updates the current order displayed
 * @param {String} orderNumber Order number to do a "starts with" search in ShipStation
 * @param {Function} setOrder Function to update the currently displayed order
 * @param {Function} setProducts Function to update the current products displayed
 * @param {Function} setError Function to update the currently displayed error
 */
async function getOrder(orderNumber, setOrder, setProducts, setError) {
  let order = await fetch(`/api/shipstation/orders/${orderNumber}`);

  if (!order.ok) {
    setError(<ErrorMessage error={'Could not pull order from ShipStation, check order number and try again'}/>);
    setOrder();
    setProducts();
  } else {
    order = await order.json();

    await Promise.all(order.products.map(async product => {
      let productInfo = await fetch(`https://magestack-staging.azurewebsites.net/api/products/${product.sku}`);
      if (!productInfo.ok) {
        product.upc = 'No UPC in system'
      } else {
        productInfo = await productInfo.json();
        product.upc = productInfo.upc;
      }

      product.numVerified = 0;
      return product;
    }));

    order.verified = false;

    setError();
    setOrder(order);
    setProducts(order.products);
  }
}

export default OrderVerifier;