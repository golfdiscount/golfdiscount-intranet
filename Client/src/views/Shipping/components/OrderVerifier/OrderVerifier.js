import { React, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import OrderInfo from 'views/Shipping/components/OrderVerifier/components/OrderInfo/OrderInfo';
import ProductVerifier from 'views/Shipping/components/OrderVerifier/components/ProductVerifier/product-verifier';

import 'views/Shipping/components/OrderVerifier/OrderVerifier.css';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (order && verified && loaded) {
      document.getElementById('order-search').value = '';
      document.getElementById('order-search').focus();
    }
  });

  if (!loaded) {
    return (<div className='tab-content loading'>
      <ReactLoading type='spin' height={250} width={250} color='#006633'/>
    </div>);
  }

  return (
    <div className='tab-content'>
      {error}
      <div className={'tab-inner-content'}>
        <h1>Order Verification</h1>
        <h2>Order Number</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          await getOrder(e.target.elements['orderNumber'].value, setOrder, setVerified, setError, setLoaded);
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
async function getOrder(orderNumber, setOrder, setVerified, setError, setLoaded) {
  orderNumber = orderNumber.trim();
  setLoaded(false);

  let errorAudio = new Audio('/error.mp3');
  const response = await fetch(`/api/shipstation/orders/${orderNumber}`);
  const order = await response.json();
  console.log(order);

  if (!response.ok) {
    errorAudio.play();
    setError(<ErrorMessage error={order.message}/>);
    setOrder();
  } else {
    if (order.orderStatus === 'shipped') {
      errorAudio.play();
      setError(<ErrorMessage error='Order has already been shipped in ShipStation'/>);
    } else {
      setError();
    }

    setVerified(false);
    setOrder(order);
  }

  setLoaded(true);
}

export default OrderVerifier;