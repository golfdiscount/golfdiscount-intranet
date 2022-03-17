import { useEffect, useState } from 'react';

import Product from './product';

function ProductVerifier(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(props.products);

    if (!props.verified) {
      document.getElementById('upc-search').value = '';
      document.getElementById('upc-search').focus();
      document.querySelector('.tab-inner-content').classList.remove('verified');
    } else {
      document.getElementById('order-search').value = '';
      document.getElementById('upc-search').value = '';
      document.getElementById('order-search').focus();
      document.querySelector('.tab-inner-content').classList.add('verified');
    }
  });


  const productListings = products.map(product => {
    return <Product product={product} key={product.sku}/>
  });

  return(
    <div>
      <h2>Products</h2>
      <form onSubmit={e => {
            e.preventDefault();
            verifyUpc(e.target.elements['upc-search'].value, products, setProducts);
            checkProducts(products, props.setVerified);
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
  let foundProduct = false;
  let productsTemp = products.map(product => product);

  productsTemp.forEach(product => {
    if (product.upc === upc) {
      if (product.numVerified < product.quantity) {
        product.numVerified += 1;
        foundProduct = true;
      }
    }
  });
  
  if (!foundProduct) {
    let errorAudio = new Audio('/error.mp3');
    errorAudio.play();
  }
  
  setProducts(productsTemp);
}

/**
 * 
 * @param {Array} products Products in the current order 
 * @param {Function} setProductsVerified Function to update verified status of current products 
 */
function checkProducts(products, setVerified) {
  let verified = true;

  products.forEach(product => {
    if (product.numVerified !== product.quantity) {
      verified = false;
    }
  });

  setVerified(verified);
}

export default ProductVerifier;