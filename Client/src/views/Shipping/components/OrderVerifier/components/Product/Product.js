import PropTypes from 'prop-types';
import { React } from 'react';

function Product(props) {
  const product = props.product;
  return (
    <div>
      <hr></hr>
      <div className={`product-listing${product.verified === product.quantity ? ' verified' : ''}`}>
        <div >
          <h3>{product.productName}</h3>
          <p>SKU: {product.sku}</p>
          <p>Verified: {product.verified}</p>
          <p>Quantity: {product.quantity}</p>
          <p>UPC: {product.upc}</p>
        </div>
        <img src={product.imageUrl} alt={product.productName} width={200} height={200}></img>
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.object
};

export default Product;