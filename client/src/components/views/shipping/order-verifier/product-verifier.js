import { useEffect } from 'react';

import Product from './product';

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
            checkProducts(props.products, props.setVerified);
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

/**
 * Searches through a list of products and adds 1 to verified quantity of
 * the product if the UPC matches
 * @param {String} upc UPC to search for
 * @param {Array} products Products in the current order 
 * @param {Function} setProducts Function to update state of current products 
 */
function verifyUpc(upc, products, setProducts) {
  let productsTemp = products.map(product => product);
  productsTemp.forEach(product => {
    if (product.upc === upc) {
      product.numVerified += 1;
    }
  });
  
  setProducts(productsTemp);
}

/**
 * 
 * @param {Array} products Products in the current order 
 * @param {Function} setProductsVerified Function to update verified status of current products 
 */
function checkProducts(products, setProductsVerified) {
  let productsVerified = true;
  products.forEach(product => {
    if (product.numVerified !== product.quantity) {
      productsVerified = false;
    }
  });

  setProductsVerified(productsVerified);
}

export default ProductVerifier;