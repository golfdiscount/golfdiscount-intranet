import { useState } from 'react';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';

/**
 * OrderViewer component with form for searching and order information
 * @returns OrderViewer component
 */
function OrderViewer() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState();

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Order Number</h1>
        <form onSubmit={(e) => {
            e.preventDefault();
            getOrder(e.target.elements['orderNumber'].value, setOrders, setError)
          }}>
          <input required type='text' name='orderNumber'/>
          <button type='submit'>Submit</button>
        </form>
        {orders.map(pickTicket => <Order order={pickTicket} key={pickTicket.pickTicketNumber} />)}
      </div>
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
  const lineItems = order.lineItems.map(lineItem => {
    return(
      <Product sku={lineItem.sku} units={lineItem.units} key={lineItem.sku}/>
    )
  })

  return (
    <div>
      <OrderHeader order={order} />
      <h2>Customer</h2>
      <Address address={order.customer} />
      <h2>Recipient</h2>
      <Address address={order.recipient} />
      <h2>Products</h2>
      {lineItems}
    </div>
  );
}

/**
 * Component to render order metadata
 * @param {Object} props Contains the date of the order displayed
 * @returns JSX React element with order metadata
 */
function OrderHeader(props) {
  const order = props.order;
  const orderDate = new Date(order.orderDate);
  return (
    <div>
      <h2>Order Information</h2>
      <p>Order Number: {order.orderNumber}</p>
      <p>Pick Ticket Number: {order.pickTicketNumber}</p>
      <p>Order Date: {orderDate.toLocaleDateString()}</p>
    </div>
  );
}

/**
 * Component with address information
 * @param {Object} props Contains information to make a complete address
 * @returns JSX React element with address information
 */
function Address(props) {
  const address = props.address
  return (
    <div>
      <p>Name: {address.name}</p>
      <p>Address: {address.street} {address.city}, {address.state} {address.zip} {address.country}</p>
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
      <h3>{props.name}</h3>
      <p>SKU: {props.sku}</p>
      <p>Quantity: {props.units}</p>
      <hr />
    </div>
  )
}

/**
 * Gets order information from WSI database and updates the currently displayed order
 * Will update the error banner in case of any res status that are not 200
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
    setState();
  });
}

export default OrderViewer;