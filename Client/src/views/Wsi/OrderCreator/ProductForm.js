import PropTypes from 'prop-types';
import { React } from 'react';

function Product(props) {
  const productInfo = props.productInfo;
  const removeProduct = props.removeProduct;
  const products = props.products;
  const setProducts = props.setProducts;
  const setError = props.setError;

  /**
   * Updates the value of the product form dynamically based on
   * input element that triggered it
   * @param {Event} event Event that triggered this function
   */
  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const propertyName = target.name;

    updateProduct(propertyName, value, productInfo.lineNumber, products, setProducts);
  }

  return(
    <div className='vertical-form'>
      <label className='text-input'>SKU:
        <input value={productInfo.sku} name='sku' 
          onChange={handleInputChange} 
          onBlur={async () => await validateProduct(productInfo.sku, setError)} required/>
      </label>
      <label className='text-input'>Quantity:
        <input type='number' value={productInfo.units} name='units' onChange={handleInputChange} required/>
      </label>
      <button type='button' onClick={removeProduct}>Remove Product</button>
      <hr />
    </div>
  );
}

/**
 * Updates the properties of a product based on the line number for a product
 * @param {string} key Name of property to update
 * @param {string} value Value to set the property to
 * @param {number} lineNumber Line number of the product
 * @param {Array} products Array of current products
 * @param {Function} setProducts Function to update the state of current products
 */
function updateProduct(key, value, lineNumber, products, setProducts) {
  const productsTemp = products.map(product => {
    if (product.lineNumber === lineNumber) {
      product[key] = value;
    }
    return product;
  });

  setProducts(productsTemp);
}

async function validateProduct(sku, setError) {
  const apiResponse = await fetch(`/api/magento/products/${sku}`);

  if (!apiResponse.ok) {
    setError(`${sku} is not a valid SKU`);
  } else {
    setError(null);
  }
}

Product.propTypes = {
  productInfo: PropTypes.shape({
    lineNumber: PropTypes.number,
    sku: PropTypes.string,
    units: PropTypes.number,
  }),
  products: PropTypes.array,
  setProducts: PropTypes.func,
  removeProduct: PropTypes.func,
  setError: PropTypes.func
};

export default Product;
