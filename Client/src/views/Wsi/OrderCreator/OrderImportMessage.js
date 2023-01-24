import PropTypes from 'prop-types';
import { React } from 'react';

import './OrderImportMessage.css';

function OrderImportMessage(props) {
  const importOrder = props.importOrder;

  return (
    <div className='order-import-message' onClick={() => importOrder()}>
      <p>Click here to import order from Magento</p>
    </div>
  );
}

OrderImportMessage.propTypes = {
  importOrder: PropTypes.func
};

export default OrderImportMessage;
