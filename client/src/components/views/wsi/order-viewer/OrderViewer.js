import './OrderViewer.css';
import { useState } from 'react';

function OrderViewer() {
  const [currentOrder, setCurrentOrder] = useState();
  const [errors, setErrors] = useState([]);
  let order = <Order orderNum={currentOrder} />;
  const errorMessages = errors.map(error => {
    return (
      <p style={{'color': 'red'}}>Error: {error}</p>
    );
  });

  return (
    <div className='tab-content'>
      {errorMessages}
      <h1>Order Search</h1>
      <form onSubmit={(e) => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setCurrentOrder, setErrors)
        }}>
        <label htmlFor='order-num'>Order Number:</label>
        <input required type='text' name='orderNumber'/>
        <button type='submit'>Submit</button>
      </form>
      {order}
    </div>
  );
}

function Order(props) {
  return (
    <div>
      {props.orderNum}
    </div>
  );
}

/**
 * Gets order information from WSI database and updates the currently displayed order
 * @param {String} orderNumber
 * @param {Function} setState Function to update state of the current order in the OrderViewer component
 */
function getOrder(orderNumber, setState, setError) {
  fetch(`/api/wsi/orders/${orderNumber}`)
  .then(res => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  })
  .then(res => console.log(res))
  .catch(err => {
    setError([err.message]);
  });
  setError([]);
  setState(orderNumber);
}

export default OrderViewer;