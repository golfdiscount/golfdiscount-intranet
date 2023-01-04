import { useState } from 'react';

import { AddressForm } from 'components/FormComponents/AddressForm';

import './OrderCreator.css';

function OrderCreator() {
  const [ products, setProducts ] = useState([{lineNumber: 1,
    sku: '',
    units: 1
  }]);

  const [ customerAddress, setCustomerAddress ] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: 'US',
    zip: ''
  });
  
  const [ recipientAddress, setRecipientAddress ] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: 'US',
    zip: ''
  });

  // If set to true, disables the recipient address box
  const [ recipientDisabled, setRecipientDisabled ] = useState(false);

  let productList = products.map(product => {
    return <Product key={product.lineNumber} removeProduct={() => removeProduct(product.id)} productInfo={product} products={products} setProducts={setProducts}/>
  });

  function addProduct() {
    let productCopy = products.map(product => {
      return product;
    });

    productCopy.push({
      lineNumber: products[products.length-1].lineNumber + 1,
      sku: '',
      units: 1
    });
    setProducts(productCopy);
  }

  function removeProduct(lineNumber) {
    if (products.length !== 1){
      let newProducts = products.filter(product => product.lineNumber !== lineNumber);
      setProducts(newProducts);
    }
  }

  function toggleRecipientAddress() {
    setRecipientDisabled(!recipientDisabled);
  }

  /**
   * Submits the order to the WSI API
   * @param {Event} e Form event that called this function
   */
  async function submitOrder(e) {
    e.preventDefault();

    if (window.confirm('Are you sure you want to submit this order?')) {
      let formData = new FormData(e.target);

      const date = new Date(formData.get('order_date'));

      const orderData = {
        orderNumber: formData.get('order_num'),
        orderDate: date.toISOString(),
        shippingMethod: formData.get('shipping_method'),
        store: Number(formData.get('store_num')),
        customer: customerAddress,
        recipient: recipientDisabled ? customerAddress : recipientAddress,
        lineItems: []
      };

      products.forEach(product => {
        orderData.lineItems.push(product);
      });

      let res = await fetch('/api/wsi/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        alert(`There was an error submitting the order: ${await res.text()}`)
      } else {
        alert('Order successfully submitted');
      }
    }
  }

  return (
    <form className='tab-content' onSubmit={submitOrder}>
      <div className='order-creator tab-inner-content'>
        <div>
          <h1>Order Creation</h1>
          <OrderInfo updateRecipient={setRecipientAddress}/>
          <h2>Customer Address</h2>
          <Address address={customerAddress} setAddress={setCustomerAddress}/>
          <label>
            <input type='checkbox' onChange={toggleRecipientAddress}/>
            Shipping and billing addresses are the same
          </label>
          <h2>Recipient Address</h2>
          <Address address={recipientAddress} setAddress={setRecipientAddress} disabled={recipientDisabled}/>
          <button type='submit'>Create Order</button>
        </div>
        <div className='product-container'>
          <h2>Products</h2>
          {productList}
          <button type='button' onClick={addProduct}>Add another product</button>
        </div>
      </div>
    </form>
  );
}

function OrderInfo(props) {
  const updateRecipient = props.updateRecipient
  function useStoreAddress(e) {
    fetch(`${process.env.REACT_APP_WSI_DOMAIN}/stores/${e.target.value}`)
    .then(res => res.json())
    .then(res => updateRecipient(res));
  }
  return (
    <div className='vertical-form'>
      <label>
        Store Number:
        <label>
          <input type='radio' name='store_num' value='1' onChange={useStoreAddress} required defaultChecked/>
          1
        </label>
        <label>
          <input type='radio' name='store_num' value='2' onChange={useStoreAddress}/>
          2
        </label>
        <label>
          <input type='radio' name='store_num' value='3' onChange={useStoreAddress}/>
          3
        </label>
        <label>
          <input type='radio' name='store_num' value='5' onChange={useStoreAddress}/>
          5
        </label>
        <label>
          <input type='radio' name='store_num' value='6' onChange={useStoreAddress}/>
          6
        </label>
        <label>
          <input type='radio' name='store_num' value='7' onChange={useStoreAddress}/>
          7
        </label>
      </label>
      <label className='text-input'>
        Order Number:
        <input name='order_num' required />
      </label>
      <label>
        Order Date:
        <input type='date' name='order_date' required></input>
      </label>
      <label>
        Shipping Method:
        <select defaultValue={'FDXH'} name='shipping_method'>
          <option value='FDXH'>FedEx Home Delivery</option>
          <option value='FXES'>FedEx 3-Day</option>
          <option value='FX2D'>FedEx 2-Day</option>
          <option value='FXSO'>FedEx 1-Day</option>
        </select>
      </label>
    </div>
  );
}

function Address(props) {
  let address = {...props.address};
  let setAddress = props.setAddress;

  function updateAddress(key, value) {
    address[key] = value;
    setAddress(address);
  }

  return (
    <fieldset className='vertical-form' disabled={props.disabled}>
      <label>Name:
        <input value={address.name} onChange={(e) => updateAddress('name', e.target.value)} required/>
      </label>
      <label>Address:
        <input value={address.address} onChange={(e) => updateAddress('street', e.target.value)} required/>
      </label>
      <label>City:
        <input value={address.city} onChange={(e) => updateAddress('city', e.target.value)} required/>
      </label>
      <label>State:
        <input value={address.state} onChange={(e) => updateAddress('state', e.target.value)} required/>
      </label>
      <label>Country:
        <input value={address.country} onChange={(e) => updateAddress('country', e.target.value)} required/>
      </label>
      <label>Zip Code:
        <input value={address.zip} onChange={(e) => updateAddress('zip', e.target.value)} required/>
      </label>
    </fieldset>
  );
}

function Product(props) {
  let productInfo = props.productInfo;
  let products = props.products;
  const lineNumber = props.lineNumber;
  const setProducts = props.setProducts;

  function updateProduct(key, value) {
    productInfo[key] = value;
    const productsTemp = products.map(product => {
      if (product.lineNumber === lineNumber) {
        product = productInfo;
      }
      return product;
    });
    setProducts(productsTemp);
  }

  return(
    <div className='vertical-form'>
      <label className='text-input'>SKU:
        <input value={productInfo.sku} onChange={e => updateProduct('sku', e.target.value)} required/>
      </label>
      <label className='text-input'>Quantity:
        <input type='number' value={productInfo.units} onChange={e => updateProduct('units', e.target.value)} required/>
      </label>
      <button type='button' onClick={props.removeProduct}>Remove Product</button>
      <hr />
    </div>
  );
}

export default OrderCreator;