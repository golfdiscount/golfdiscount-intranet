import './OrderCreator.css';
import { useState } from 'react';

function OrderCreator() {
  const [products, setProducts] = useState([<Product key={0}/>]);

  function OrderInfo() {
    return (
      <div className='vertical-form'>
        <label>
          Store Number:
          <label>
            <input type='radio' name='store_num' value='1'/>
            1
          </label>
          <label>
            <input type='radio' name='store_num' value='2'/>
            2
          </label>
          <label>
            <input type='radio' name='store_num' value='3'/>
            3
          </label>
          <label>
            <input type='radio' name='store_num' value='5'/>
            5
          </label>
          <label>
            <input type='radio' name='store_num' value='6'/>
            6
          </label>
          <label>
            <input type='radio' name='store_num' value='7'/>
            7
          </label>
        </label>
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

  function Address() {
    return (
      <div className='vertical-form'>
        <label>Name: <input /></label>
        <label>Address: <input /></label>
        <label>City: <input /></label>
        <label>State: <input /></label>
        <label>Country: <input defaultValue={'US'} /></label>
        <label>Zip Code: <input /></label>
      </div>
    );
  }

  function Product() {
    return(
      <div className='vertical-form'>
        <label className='text-input'>SKU: <input required /></label>
        <label className='text-input'>Quantity: <input type='number' defaultValue={'1'} required /></label>
        <label className='text-input'>Price: <input type='number' required /></label>
        <button type='button' onClick={RemoveProduct}>Remove Product</button>
        <hr />
      </div>
    );
  }

  /**
   * Adds another product entry to the current set of products
   */
  function AddProduct() {
    let productCopy = products.map(product => {
      return product;
    });
    productCopy.push(<Product key={productCopy.length + 1}/>);
    setProducts(productCopy);
  }

  function RemoveProduct(productToRemove) {
    let newProducts = products.filter(product => product !== productToRemove);
    setProducts(newProducts);
  }

  return (
    <div className='tab-content'>
      <div className='order-creator'>
        <div>
          <h1>Order Creation</h1>
          <OrderInfo />
          <h2>Customer Address</h2>
          <Address />
          <h2>Recipient Address</h2>
          <Address />
        </div>
        <div className='product-container'>
          <h2>Products</h2>
          {products}
          <button type='button' onClick={AddProduct}>Add another product</button>
        </div>
      </div>
    </div>
  );
}

export default OrderCreator;