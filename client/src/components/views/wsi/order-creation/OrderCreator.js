import './OrderCreator.css';
import { useState } from 'react';

function OrderCreator() {

  function OrderInfo() {
    return (
      <div>
      </div>
    );
  }

  function Product() {
    const [products, addProduct] = useState([]);
    return(
      <div className='vertical-form'>
        <label>
          SKU:
          <input required />
        </label>
        <label>
          Quantity:
          <input type='number' required />
        </label>
        <label>
          Price:
          <input type='number' required />
        </label>
      </div>
    );
  }

  return (
    <div className='tab-content'>
      <p>Order creation tab</p>
      <Product />
      <button type='button' onClick>Add another product</button>
    </div>
  );
}

export default OrderCreator;