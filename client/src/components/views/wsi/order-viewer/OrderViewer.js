import './OrderViewer.css';
import { useState } from 'react';
import ErrorMessage from '../../../common/ErrorMessage';

/**
 * OrderViewer component with form for searching and order information
 * @returns OrderViewer component
 */
function OrderViewer() {
  const [currentOrder, setCurrentOrder] = useState();
  const [error, setError] = useState();
  let order;

  if (currentOrder) {
    order = <Order order={currentOrder} />;
  }

  return (
    <div className='tab-content'>
      {error}
      <h1>Order Number</h1>
      <form onSubmit={(e) => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setCurrentOrder, setError)
        }}>
        <input required type='text' name='orderNumber'/>
        <button type='submit'>Submit</button>
      </form>
      {order}
    </div>
  );
}

/**
 * Component to render order information such as customer, recipient, and products
 * @param {Object} props Contains information about an order
 * @returns JSX React element with order information
 */
function Order(props) {
  const order = props.order;
  const customerAddress = `${order.sold_to_address} ${order.sold_to_city}, ${order.sold_to_state} ${order.sold_to_zip} ${order.sold_to_country}`;
  const recipientAddress = `${order.ship_to_address} ${order.ship_to_city}, ${order.ship_to_state} ${order.ship_to_zip} ${order.ship_to_country}`;
  const products = order.products.map(product => {
    return(
      <Product name={product.sku_name} sku={product.sku} price={product.unit_price} qty={product.quantity} key={product.sku}/>
    )
  })

  return (
    <div>
      <OrderHeader order={order} />
      <h2>Customer</h2>
      <Address name={order.sold_to_name} address={customerAddress} />
      <h2>Recipient</h2>
      <Address name={order.ship_to_name} address={recipientAddress} />
      <h2>Products</h2>
      {products}
    </div>
  );

  /**
   * Component to render order metadata
   * @param {Object} props Contains the date of the order displayed
   * @returns JSX React element with order metadata
   */
  function OrderHeader(props) {
    const order = props.order;
    let orderDate = new Date(order.order_date).toLocaleDateString();
    return (
      <div>
        <h2>Order Information</h2>
        <p>Order Date: {orderDate}</p>
      </div>
    );
  }

  /**
   * Component with address information
   * @param {Object} props Contains information to make a complete address
   * @returns JSX React element with address information
   */
  function Address(props) {
    return (
      <div>
        <p>Name: {props.name}</p>
        <p>Address: {props.address}</p>
      </div>
    );
  }

  /**
   * A component displaying product information
   * @param {Object} props Contains information about a specific product
   * @returns JSX React element with product information
   */
  function Product(props) {
    return (
      <div>
        <p>Name: {props.name}</p>
        <p>SKU: {props.sku}</p>
        <p>Unit Price: ${props.price}</p>
        <p>Quantity: {props.qty}</p>
      </div>
    )
  }
}

/**
 * Gets order information from WSI database and updates the currently displayed order
 * Will update the error banner in case of any res status that are not 2xx
 * @param {String} orderNumber
 * @param {Function} setState Function to update state of the current order in the OrderViewer component
 * @param {Function} setError Function to update the error state of the order viewing screen
 */
function getOrder(orderNumber, setState, setError) {
  fetch(`/api/wsi/orders/${orderNumber}`)
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
    setState(res);
  })
  .catch(err => {
    setError(<ErrorMessage error={err.message} />);
  });
}

export default OrderViewer;