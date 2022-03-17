import { useEffect, useState } from 'react';

import ErrorMessage from '../../../common/ErrorMessage';
import OrderInfo from './order-info';
import ProductVerifier from './product-verifier';

import './order-verifier.css';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();
  const [verified, setVerified] = useState(false);

  if (order && verified) {
    document.getElementById('order-search').value = '';
    document.getElementById('order-search').focus();
  }
  

  return (
    <div className='tab-content'>
      {error}
      <div className={`tab-inner-content`}>
        <h1>Order Verification</h1>
        <h2>Order Number</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          await getOrder(e.target.elements['orderNumber'].value, setOrder, setVerified, setError);
        }}>
          <input required type='text' name='orderNumber' id='order-search'/>
          <button type='submit'>Submit</button>
        </form>
        {order && <OrderInfo date={order.orderDate} email={order.email} number={order.orderNumber}/>}
        {order && <ProductVerifier products={order.products} verified={verified} setVerified={setVerified}/>}
      </div>
    </div>
  );
}

/**
 * Searches for an order and updates the current order displayed
 * @param {String} orderNumber Order number to do a "starts with" search in ShipStation
 * @param {Function} setOrder Function to update the currently displayed order
 * @param {Function} setError Function to update the currently displayed error
 */
async function getOrder(orderNumber, setOrder, setVerified, setError) {
  let order = await fetch(`/api/shipstation/orders/${orderNumber}`);

  if (!order.ok) {
    setError(<ErrorMessage error={'Could not pull order from ShipStation, check order number and try again'}/>);
    setOrder();
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

    setError();
    setVerified(false);
    setOrder(order);
  }
}

export default OrderVerifier;