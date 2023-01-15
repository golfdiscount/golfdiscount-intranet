import { React } from 'react';

function OrderInfoForm() {
  return (
    <div className='vertical-form'>
      <label>
        Store Number:
        <label>
          <input type='radio' name='store_num' value='1' required defaultChecked/>
          1
        </label>
        <label>
          <input type='radio' name='store_num' value='2' />
          2
        </label>
        <label>
          <input type='radio' name='store_num' value='3' />
          3
        </label>
        <label>
          <input type='radio' name='store_num' value='5' />
          5
        </label>
        <label>
          <input type='radio' name='store_num' value='6' />
          6
        </label>
        <label>
          <input type='radio' name='store_num' value='7' />
          7
        </label>
      </label>
      <label className='text-input'>
        Order Number:
        <input name='order_num' required />
      </label>
      <label>
        Order Date:
        <input type='date' name='order_date' required></input>
      </label>
      <label>
        Shipping Method:
        <select defaultValue={'FDXH'} name='shipping_method'>
          <option value='FDXH'>FedEx Home Delivery</option>
          <option value='FXES'>FedEx 3-Day</option>
          <option value='FX2D'>FedEx 2-Day</option>
          <option value='FXSO'>FedEx 1-Day</option>
        </select>
      </label>
    </div>
  );
}

export default OrderInfoForm;
