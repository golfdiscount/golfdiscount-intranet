import PropTypes from 'prop-types';
import { React } from 'react';

import Address from 'components/Address';
import Product from 'views/Wsi/Order/Product';

function PickTicket(props) {
  const pickTicket = props.pickTicket;
  const orderDate = new Date(pickTicket.orderDate);
  const orderCreationDate = new Date(pickTicket.createdAt + 'Z');
  return (
    <div>
      <div>
        <p>Order Number: {pickTicket.orderNumber}</p>
        <p>Order Date: {orderDate.toLocaleDateString()}</p>
        <p>WSI Order Creation Date: {orderCreationDate.toLocaleString()}</p>
        <p>Shipping Method: {pickTicket.shippingMethod}</p>
      </div>

      <div className='horizontal-flex address-container'>
        <div>
          <h2>Customer</h2>
          <Address address={pickTicket.customer} />
        </div>
        <div>
          <h2>Recipient</h2>
          <Address address={pickTicket.recipient} />
        </div>
      </div>
      <h2>Products</h2>
      {pickTicket.lineItems.map(lineItem => {
        return <Product product={lineItem} key={lineItem.sku}/>;
      })}
    </div>
  );
}

PickTicket.propTypes = {
  pickTicket: PropTypes.object
};

export default PickTicket;
