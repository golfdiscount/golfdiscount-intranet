import PropTypes from 'prop-types';
import { React, useState } from 'react';

import AddressForm from 'components/FormComponents/AddressForm';
import AddressModel from 'models/AddressModel';
import OrderInfoForm from './OrderInfoForm';

import './OrderCreator.css';

function OrderCreator() {
  const [ products, setProducts ] = useState([{lineNumber: 1,
    sku: '',
    units: 1
  }]);

  const [ customerAddress, setCustomerAddress ] = useState(new AddressModel('', '', '', '', 'US', ''));
  const [ recipientAddress, setRecipientAddress ] = useState(new AddressModel('', '', '', '', 'US', ''));

  // If set to true, disables the recipient address box
  const [ recipientDisabled, setRecipientDisabled ] = useState(false);

  let productList = products.map(product => {
    return (
      <Product key={product.lineNumber} removeProduct={() => removeProduct(product.id)} productInfo={product} products={products} setProducts={setProducts}/>
    );
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

      const nameEntries = formData.getAll('name');
      const streetEntries = formData.getAll('street');
      const cityEntries = formData.getAll('city');
      const stateEntries = formData.getAll('state');
      const countryEntries = formData.getAll('country');
      const zipEntries = formData.getAll('zip');

      const customerAddress = {
        name: nameEntries[0],
        street: streetEntries[0],
        city: cityEntries[0],
        state: stateEntries[0],
        country: countryEntries[0],
        zip: zipEntries[0]
      };

      let recipientAddress;

      if (formData.get('same_address') !== 'on') {
        recipientAddress = {
          name: nameEntries[1],
          street: streetEntries[1],
          city: cityEntries[1],
          state: stateEntries[1],
          country: countryEntries[1],
          zip: zipEntries[1]
        };
      } else {
        recipientAddress = customerAddress;
      }

      const orderData = {
        orderNumber: formData.get('order_num'),
        orderDate: date.toISOString(),
        shippingMethod: formData.get('shipping_method'),
        store: Number(formData.get('store_num')),
        customer: customerAddress,
        recipient: recipientAddress,
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
        alert(`There was an error submitting the order: ${await res.text()}`);
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
          <OrderInfoForm />
          <h2>Customer Address</h2>
          <AddressForm address={customerAddress} setAddress={setCustomerAddress} />
          <label>
            <input type='checkbox' name='same_address' onChange={toggleRecipientAddress} />
            Shipping and billing addresses are the same
          </label>
          <h2>Recipient Address</h2>
          <AddressForm address={recipientAddress} setAddress={setRecipientAddress} disabled={recipientDisabled} />
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

Product.propTypes = {
  lineNumber: PropTypes.number,
  productInfo: PropTypes.object,
  products: PropTypes.array,
  setProducts: PropTypes.func,
  removeProduct: PropTypes.func
};

export default OrderCreator;