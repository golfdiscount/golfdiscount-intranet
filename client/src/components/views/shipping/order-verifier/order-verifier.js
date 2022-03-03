import { useState } from 'react';
import ErrorMessage from '../../../common/ErrorMessage';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Order Verification Tab</h1>
        <h2>Order Number</h2>
        <form onSubmit={e => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setOrder, setError);
        }}>
          <input required type='text' name='orderNumber' />
          <button type='submit'>Submit</button>
        </form>
        {order &&
          <OrderInfo />
        }
        {order &&
          <ProductVerifier />
        }
      </div>
    </div>
  );
}

function OrderInfo() {
  return (
    <div>
      <h2>Order Info</h2>
    </div>
  );
}

function ProductVerifier() {
  const [products, updateProducts] = useState([]);
  return(
    <div>
      <h2>Products</h2>
      <form>
        <label>
          UPC:
          <input required type='text'/>
        </label>
        <button type='submit'>Verify Product</button>
      </form>
    </div>
  );
}

/**
 * Searches for an order and updates the current order displayed
 * @param {String} orderNumber Order number to do a "starts with" search in ShipStation
 * @param {Function} setOrder Function to update the currently displayed order
 * @param {Function} setError Function to update the currently displayed error
 */
async function getOrder(orderNumber, setOrder, setError) {
  return await fetch(`http://localhost:8080/api/shipstation/orders/${orderNumber}`)
  .then(res => {
    if (res.status === 404) {
      throw new Error('Order not found');
    } else if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  })
  .then(res => {
    setError();
    setOrder(res);
  })
  .catch(e => {
    setError(<ErrorMessage error={e.message} />);
    setOrder();
  });
}

export default OrderVerifier;