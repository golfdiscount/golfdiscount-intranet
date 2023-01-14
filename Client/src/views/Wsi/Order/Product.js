import PropTypes from 'prop-types';
import { React } from 'react';

function Product(props) {
  const productInfo = props.product;

  return (
    <div>
      <h3>{productInfo.sku}</h3>
      <h4>{productInfo.name}</h4>
      <p>Quantity Ordered: {productInfo.units}</p>
      <hr></hr>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.object
};

export default Product;
