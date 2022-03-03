import { useState } from 'react';
import ErrorMessage from '../../../common/ErrorMessage';
import './order-verifier.css';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Order Verification</h1>
        <h2>Order Number</h2>
        <form onSubmit={e => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setOrder, setError);
        }}>
          <input required type='text' name='orderNumber' />
          <button type='submit'>Submit</button>
        </form>
        {order &&
          <OrderInfo date={order.orderDate} email={order.email}/>
        }
        {order &&
          <ProductVerifier products={order.products}/>
        }
      </div>
    </div>
  );
}

function OrderInfo(props) {
  return (
    <div>
      <h2>Order Info</h2>
      <p>Order Date: {props.date}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

function ProductVerifier(props) {
  const productListings = props.products.map(product => {
    return <Product product={product} key={product.sku}/>
  });

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
      {productListings}
    </div>
  );
}

function Product(props) {
  const product = props.product;
  return (
    <div>
      <hr></hr>
      <div className='product-listing'>
        <div>
          <h3>{product.productName}</h3>
          <p>SKU: {product.sku}</p>
          <p>Quantity: {product.quantity}</p>
        </div>
        <img src={product.imageUrl} width={200} height={200}></img>
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
async function getOrder(orderNumber, setOrder, setError) {
  await fetch(`/api/shipstation/orders/${orderNumber}`)
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