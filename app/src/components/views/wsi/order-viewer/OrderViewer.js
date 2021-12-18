import './OrderViewer.css';
import { useState } from 'react';

function OrderViewer() {
  const [currentOrder, setCurrentOrder] = useState();
  let order = <Order orderNum={currentOrder} />;

  return (
    <div className='tab-content'>
      <h1>Order Search</h1>
      <form onSubmit={(e) => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setCurrentOrder)
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
function getOrder(orderNumber, setState) {
  console.log(orderNumber);
  setState(orderNumber);
}

export default OrderViewer;