import PropTypes from 'prop-types';
import { React } from 'react';

function OrderInfoForm(props) {
  const orderInfo = props.orderInfo;
  const setOrderInfo = props.setOrderInfo;

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const propertyName = target.name;

    setOrderInfo({...orderInfo, [propertyName]: value});
  }

  return (
    <div className='vertical-form'>
      <label>
        Store Number:
        <label>
          <input type='radio' name='storeNumber' value='1' required defaultChecked onChange={handleInputChange} />
          1
        </label>
        <label>
          <input type='radio' name='storeNumber' value='2' onChange={handleInputChange} />
          2
        </label>
        <label>
          <input type='radio' name='storeNumber' value='3' onChange={handleInputChange} />
          3
        </label>
        <label>
          <input type='radio' name='storeNumber' value='5' onChange={handleInputChange} />
          5
        </label>
        <label>
          <input type='radio' name='storeNumber' value='6' onChange={handleInputChange} />
          6
        </label>
        <label>
          <input type='radio' name='storeNumber' value='7' onChange={handleInputChange} />
          7
        </label>
      </label>
      <label className='text-input'>
        Order Number:
        <input name='orderNumber' value={orderInfo.orderNumber} onChange={handleInputChange} required />
      </label>
      <label>
        Order Date:
        <input type='date' name='orderDate' value={orderInfo.orderDate} required onChange={handleInputChange}></input>
      </label>
      <label>
        Shipping Method:
        <select defaultValue={'FDXH'} name='shippingMethod' onChange={handleInputChange}>
          <option value='FDXH'>FedEx Home Delivery</option>
          <option value='FXES'>FedEx 3-Day</option>
          <option value='FX2D'>FedEx 2-Day</option>
          <option value='FXSO'>FedEx 1-Day</option>
        </select>
      </label>
    </div>
  );
}

OrderInfoForm.propTypes = {
  orderInfo: PropTypes.shape({
    storeNumber: PropTypes.string,
    orderNumber: PropTypes.string,
    orderDate: PropTypes.string,
    shippingMethod: PropTypes.string
  }),
  setOrderInfo: PropTypes.func
};

export default OrderInfoForm;
