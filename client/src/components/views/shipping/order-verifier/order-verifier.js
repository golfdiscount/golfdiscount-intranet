import { useState, useEffect } from 'react';
import ErrorMessage from '../../../common/ErrorMessage';
import './order-verifier.css';

function OrderVerifier() {
  const [error, setError] = useState();
  const [order, setOrder] = useState();
  const [products, setProducts] = useState([]);

  return (
    <div className='tab-content'>
      {error}
      <div className='tab-inner-content'>
        <h1>Order Verification</h1>
        <h2>Order Number</h2>
        <form onSubmit={e => {
          e.preventDefault();
          getOrder(e.target.elements['orderNumber'].value, setOrder, setProducts, setError);
        }}>
          <input required type='text' name='orderNumber' />
          <button type='submit'>Submit</button>
        </form>
        {order && <OrderInfo date={order.orderDate} email={order.email}/>}
        {order && <ProductVerifier products={products} setProducts={setProducts}/>}
      </div>
    </div>
  );
}

function OrderInfo(props) {
  let orderDate = new Date(props.date);
  return (
    <div>
      <h2>Order Info</h2>
      <p>Order Date: {orderDate.toISOString().substring(0, 10)}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

function ProductVerifier(props) {
  useEffect(() => {
    document.getElementById('upc-search').value = '';
    document.getElementById('upc-search').focus();
  });

  const productListings = props.products.map(product => {
    return <Product product={product} key={product.sku}/>
  });

  return(
    <div>
      <h2>Products</h2>
      <form onSubmit={e => {
            e.preventDefault();
            verifyUpc(e.target.elements['upc-search'].value, props.products, props.setProducts);
          }}>
        <label>
          UPC: <input id='upc-search' required type='text'/>
        </label>
        <button type='submit'>Verify Product</button>
      </form>
      {productListings}
    </div>
  );
}

function Product(props) {
  const product = props.product;
  return (
    <div>
      <hr></hr>
      <div className={`product-listing${product.numVerified === product.quantity ? ' verified' : ''}`}>
        <div >
          <h3>{product.productName}</h3>
          <p>SKU: {product.sku}</p>
          <p>Verified: {product.numVerified}</p>
          <p>Quantity: {product.quantity}</p>
          <p>UPC: {product.upc ?? 'ERROR'}</p>
        </div>
        <img src={product.imageUrl} alt={product.productName} width={200} height={200}></img>
      </div>
    </div>
  );
}

/**
 * Searches for an order and updates the current order displayed
 * @param {String} orderNumber Order number to do a "starts with" search in ShipStation
 * @param {Function} setOrder Function to update the currently displayed order
 * @param {Function} setError Function to update the currently displayed error
 */
async function getOrder(orderNumber, setOrder, setProducts, setError) {
  let order = await fetch(`/api/shipstation/orders/${orderNumber}`);

  if (!order.ok) {
    setError(<ErrorMessage error={'Could not pull order from ShipStation, check order number and try again'}/>);
    setOrder();
    setProducts();
  } else {
    order = await order.json();

    await Promise.all(order.products.map(async product => {
      let productInfo = await fetch(`https://magestack-staging.azurewebsites.net/api/products/${product.sku}`);
      if (!productInfo.ok) {
        product.upc = 'No UPC in system'
      } else {
        productInfo = await productInfo.json();
        product.upc = productInfo.upc;
      }

      product.numVerified = 0;
      return product;
    }));

    setError();
    setOrder(order);
    setProducts(order.products);
  }
}

function verifyUpc(upc, products, setProducts) {
  let productsTemp = products.map(product => product);
  productsTemp.forEach(product => {
    if (product.upc === upc) {
      product.numVerified += 1;
    }
  });

  setProducts(productsTemp);
}

export default OrderVerifier;