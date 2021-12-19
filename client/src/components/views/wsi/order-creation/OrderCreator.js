import './OrderCreator.css';
import { useState } from 'react';

function OrderCreator() {
  const [products, setProducts] = useState([<Product key={0}/>]);
  console.log(products.length);

  function OrderInfo() {
    return (
      <div className='vertical-form'>
        <label className='text-input'>
          Order Number:
          <input required />
        </label>
        <label>
          Shipping Method:
          <select defaultValue={"FDXH"}>
            <option value="FDXH">FedEx Home Delivery</option>
            <option value="FXES">FedEx 3-Day</option>
            <option value="FX2D">FedEx 2-Day</option>
            <option value="FXSO">FedEx 1-Day</option>
          </select>
        </label>
      </div>
    );
  }

  function Product() {
    return(
      <div className='vertical-form'>
        <label className='text-input'>
          SKU:
          <input required />
        </label>
        <label className='text-input'>
          Quantity:
          <input type='number' required />
        </label>
        <label className='text-input'>
          Price:
          <input type='number' required />
        </label>
      </div>
    );
  }

  return (
    <div className='tab-content'>
      <h1>Order Creation</h1>
      <OrderInfo />
      <h2>Customer Address</h2>
      <h2>Recipient Address</h2>
      <h2>Products</h2>
      {products}
      <button type='button' onClick={() => {
        let productCopy = products.map(product => {
          return product;
        });
        productCopy.push(<Product key={productCopy.length + 1}/>);
        setProducts(productCopy);
      }}>Add another product</button>
    </div>
  );
}

export default OrderCreator;