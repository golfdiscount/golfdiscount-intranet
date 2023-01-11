import PropTypes from 'prop-types';
import { React } from 'react';

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
  productInfo: PropTypes.shape({
    sku: PropTypes.string,
    units: PropTypes.number,
  }),
  products: PropTypes.array,
  lineNumber: PropTypes.number,
  setProducts: PropTypes.func,
  removeProduct: PropTypes.func
};

export default Product;
