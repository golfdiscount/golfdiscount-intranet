import { React, useState } from 'react';

import AddressForm from 'components/FormComponents/AddressForm';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import OrderInfoForm from './OrderInfoForm';
import ProductForm from './ProductForm';
import SuccessMessage from 'components/SuccessMessage/SuccessMessage';

import './OrderCreator.css';

function OrderCreator() {
  const [ loaded, setLoaded ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ success, setSuccess ] = useState(null);

  const [ orderInfo, setOrderInfo ] = useState({storeNumber: '1', orderNumber: '', orderDate: '', shippingMethod: 'FDXH'});
  const [ customerAddress, setCustomerAddress ] = useState({name: '', street: '', city: '', state: '', country: 'US', zip: ''});
  const [ recipientAddress, setRecipientAddress ] = useState({name: '', street: '', city: '', state: '', country: 'US', zip: ''});
  const [ products, setProducts ] = useState([{lineNumber: 1, sku: '', units: 1}]);

  // If set to true, disables the recipient address box
  const [ recipientDisabled, setRecipientDisabled ] = useState(false);

  const productList = products.map(product => {
    return (
      <ProductForm key={product.lineNumber} 
        removeProduct={() => removeProduct(product.lineNumber, products, setProducts)}
        products={products}
        setProducts={setProducts}
        productInfo={product}/>
    );
  });

  if (!loaded) {
    return <LoadingSpinner />;
  }

  return (
    <form className='tab-content' onSubmit={e => submitOrder(e, products, setLoaded, setError, setSuccess)}>
      {error && <ErrorMessage error={error} />}
      {success && <SuccessMessage message={success} />}
      <div className='order-creator tab-inner-content'>
        <div>
          <h1>Order Creation</h1>
          <button type='button' onClick={async (e) => await importOrder(e, orderInfo.orderNumber, setOrderInfo, setCustomerAddress, setRecipientAddress, setProducts, setLoaded, setError)}>
            Import From Magento
          </button>
          <OrderInfoForm orderInfo={orderInfo} setOrderInfo={setOrderInfo}/>
          <h2>Customer Address</h2>
          <AddressForm address={customerAddress} setAddress={setCustomerAddress}/>
          <label>
            <input type='checkbox' name='same_address' checked={recipientDisabled} onChange={() => setRecipientDisabled(!recipientDisabled)} />
            Shipping and billing addresses are the same
          </label>
          <h2>Recipient Address</h2>
          <AddressForm address={recipientAddress} setAddress={setRecipientAddress} disabled={recipientDisabled} />
          <button type='submit'>Create Order</button>
        </div>
        <div className='product-container'>
          <h2>Products</h2>
          {productList}
          <button type='button' onClick={() => addProduct(products, setProducts)}>Add another product</button>
        </div>
      </div>
    </form>
  );
}

/**
 * Adds a new product object to an array of current products and updates the state of the component
 * @param {Array} products Array of current products 
 * @param {Function} setProducts Function to update the state of current products 
 */
function addProduct(products, setProducts) {
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

/**
 * Removes a product from an array of current products based on its line number
 * and updates the state of the component
 * @param {Number} lineNumber Line number to remove the product for
 * @param {Function} setProducts Function to update the state of current products 
 */
function removeProduct(lineNumber, products, setProducts) {
  if (products.length !== 1){
    let newProducts = products.filter(product => product.lineNumber !== lineNumber);
    setProducts(newProducts);
  }
}

/**
 * Imports order information from the Magento API into the order form
 * @param {Event} event Event that triggered this function
 * @param {string} orderNumber Magento order number to import
 * @param {Function} setOrderInfo Function to set order information
 * @param {Function} setCustomerAddress Function to set the customer address
 * @param {Function} setRecipientAddress Function to set the recipient address
 * @param {Function} setProducts Function to set the products
 * @param {Function} setLoaded Function the set the loading state
 * @param {Function} setError Function to the set current error message
 */
async function importOrder(event, orderNumber, setOrderInfo, setCustomerAddress, setRecipientAddress, setProducts, setLoaded, setError) {
  event.preventDefault();

  try {
    setLoaded(false);
    const apiResponse = await fetch(`/api/magento/orders/${orderNumber}`);

    if (!apiResponse.ok) {
      if (apiResponse.status == 404) {
        throw `${orderNumber} could not be found in Magento`;
      }

      throw apiResponse.statusText;
    }

    const order = await apiResponse.json();
    const dateString = order.createdAt.substring(0, order.createdAt.indexOf('T'));

    setOrderInfo({storeNumber: order.storeNumber, orderNumber: order.orderNumber, orderDate: dateString});
    setCustomerAddress(order.customer);
    setRecipientAddress(order.recipient);

    const products = [];
    for (let i = 0; i < order.lineItems.length; i++) {
      const product = order.lineItems[i];
      products.push({
        sku: product.sku,
        lineNumber: i + 1,
        units: product.quantity
      });
    }

    setError(null);
    setProducts(products);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoaded(true);
  }
}

/**
 * Submits the order to the WSI API
 * @param {Event} e Form event that called this function
 */
async function submitOrder(e, products, setLoaded, setError, setSuccess) {
  e.preventDefault();

  if (!window.confirm('Are you sure you want to submit this order?')) {
    return;
  }

  setLoaded(false);

  let formData = new FormData(e.target);

  const date = new Date(formData.get('orderDate'));

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
    orderNumber: formData.get('orderNumber'),
    orderDate: date.toISOString(),
    shippingMethod: formData.get('shippingMethod'),
    store: Number(formData.get('storeNumber')),
    customer: customerAddress,
    recipient: recipientAddress,
    lineItems: products
  };

  const res = await fetch('/api/wsi/picktickets', {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  setLoaded(true);

  if (!res.ok) {
    setError(`There was an error submitting the order: ${await res.text()}`);
    setSuccess(null);
  } else {
    setError(null);
    setSuccess('Order successfully submitted');
  }
}

export default OrderCreator;