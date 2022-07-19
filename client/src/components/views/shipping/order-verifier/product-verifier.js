import { useEffect, useState } from 'react';

import Product from './product';

function ProductVerifier(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(props.products);

    if (!props.verified) {
      document.querySelector('.tab-inner-content').classList.remove('verified');
      document.getElementById('product-search').value = '';
      document.getElementById('product-search').focus();
    } else {
      document.getElementById('order-search').value = '';
      document.getElementById('product-search').value = '';
      document.getElementById('order-search').focus();
      document.querySelector('.tab-inner-content').classList.add('verified');
    }
  }, [props.products, props.verified]);


  const productListings = products.map(product => {
    return <Product product={product} key={product.sku}/>
  });

  return(
    <div>
      <h2>Products</h2>
      <form onSubmit={e => {
            e.preventDefault();
            verifyProduct(e.target.elements['product-search'].value, products, setProducts);
            checkProducts(products, props.setVerified);
          }}>
        <label>
          UPC: <input id='product-search' required type='text'/>
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
function verifyProduct(query, products, setProducts) {
  let foundProduct = false;
  let productsTemp = products.map(product => product);

  productsTemp.forEach(product => {
    if (product.upc === query || product.sku === query) {
      if (product.verified < product.quantity) {
        product.verified += 1;
        foundProduct = true;
      }
    }
  });
  
  if (!foundProduct) {
    let errorAudio = new Audio('/error.mp3');
    errorAudio.play();
  }

  document.getElementById('product-search').value = '';
  document.getElementById('product-search').focus();
  
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
    if (product.verified !== product.quantity) {
      verified = false;
    }
  });

  setVerified(verified);
}

export default ProductVerifier;